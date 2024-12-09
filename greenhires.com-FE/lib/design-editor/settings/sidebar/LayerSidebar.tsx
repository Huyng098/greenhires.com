import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SelectionBackgroundIcon from "@duyank/icons/regular/SelectionBackground";
import XIcon from "@duyank/icons/regular/X";
import { LayerId } from "@lidojs/design-core";
import { getPosition } from "@lidojs/design-utils";
import reverse from "lodash/reverse";
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useEditor, useSelectedLayers } from "../../hooks";
import { PageContext } from "../../layers/core/PageContext";
import { isResumeLayer } from "../../ultils/layer/layers";
import ReverseTransformLayer from "./layer/ReverseTransformLayer";
import LayerContent from "./LayerContent";
import Sidebar, { SidebarProps } from "./Sidebar";
import SortableLayer from "./SortableLayer";

type LayerSidebarProps = SidebarProps;
const LayerSidebar: ForwardRefRenderFunction<
  HTMLDivElement,
  LayerSidebarProps
> = ({ ...props }, ref) => {
  const dataRef = useRef({ isMultipleSelect: false });
  const { selectedLayerIds } = useSelectedLayers();
  const [activeId, setActiveId] = useState<LayerId | null>(null);
  const { layers, actions, activePage } = useEditor((state) => ({
    layers:
      state.pages[state.activePage] && state.pages[state.activePage].layers,
    activePage: state.activePage,
  }));
  const layerList = useMemo(() => {
    if (!layers) {
      return;
    }
    return reverse(layers["ROOT"].data.child.map((layerId) => layers[layerId]));
  }, [layers]);
  const rootLayer = useMemo(() => {
    if (!layers) {
      return;
    }
    return layers.ROOT;
  }, [layers]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) {
      return;
    }
    if (active.id !== over.id) {
      const newIndex =
        layerList!.length - layerList!.findIndex((f) => f.id === over.id) - 1;
      actions.moveLayerPosition(activePage, active.id as string, newIndex);
    }
  };

  const handleClickOption = (e: React.MouseEvent) => {
    actions.showContextMenu(getPosition(e.nativeEvent));
  };
  useEffect(() => {
    const enableMultipleSelect = (e: KeyboardEvent) => {
      dataRef.current.isMultipleSelect = e.shiftKey;
    };
    window.addEventListener("keydown", enableMultipleSelect);
    window.addEventListener("keyup", enableMultipleSelect);
    return () => {
      window.removeEventListener("keydown", enableMultipleSelect);
      window.removeEventListener("keyup", enableMultipleSelect);
    };
  }, []);

  const activeLayer = useMemo(
    () => (layerList || []).find((layer) => layer.id === activeId),
    [layerList, activeId]
  );
  const handleSelectLayer = (layerId: LayerId) => {
    actions.selectLayers(
      activePage,
      layerId,
      dataRef.current.isMultipleSelect ? "add" : "replace"
    );
  };

  return (
    <Sidebar {...props}>
      <PageContext.Provider value={{ pageIndex: activePage }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              height: 48,
              borderBottom: "1px solid rgba(57,76,96,.15)",
              padding: "0 20px",
            }}
          >
            <p
              style={{
                lineHeight: "48px",
                fontWeight: 600,
                color: "#181C32",
                flexGrow: 1,
              }}
            >
              Layers
            </p>
            <div
              style={{
                fontSize: 20,
                flexShrink: 0,
                width: 32,
                height: 32,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                actions.setSidebar();
              }}
            >
              <XIcon />
            </div>
          </div>

          <DndContext
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            onDragCancel={() => setActiveId(null)}
            onDragEnd={handleDragEnd}
            onDragStart={({ active }) => {
              if (!active) {
                return;
              }
              setActiveId(active.id as LayerId);
            }}
          >
            <div
              ref={ref}
              style={{
                flexGrow: 1,
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr)",
                  gridRowGap: 8,
                  padding: 16,
                }}
              >
                <SortableContext
                  items={(layerList || []).map((layer) => layer.id)}
                  strategy={rectSortingStrategy}
                >
                  {createPortal(
                    <DragOverlay>
                      {activeLayer ? (
                        <LayerContent layer={activeLayer} />
                      ) : null}
                    </DragOverlay>,
                    document.body
                  )}
                  {(layerList || []).map(
                    (layer) =>
                      !isResumeLayer(layer) && (
                        <div className="bg-slate-200 p-3 rounded">
                          <SortableLayer
                            key={layer.id}
                            layer={layer}
                            onClick={() => handleSelectLayer(layer.id)}
                            onOpenOption={handleClickOption}
                          />
                        </div>
                      )
                  )}
                </SortableContext>
                {rootLayer && (
                  <div
                    className="bg-slate-200 p-3 rounded"
                    style={{
                      borderRadius: 8,
                      padding: 8,
                      cursor: "pointer",
                      position: "relative",
                      borderWidth: 2,
                      borderStyle: "solid",
                      borderColor: selectedLayerIds.includes(rootLayer.id)
                        ? "#3d8eff"
                        : "transparent",
                    }}
                    onMouseDown={() => handleSelectLayer(rootLayer.id)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      ></div>
                      <div style={{ minWidth: 0, flexGrow: 1 }}>
                        <ReverseTransformLayer
                          hiddenChild={true}
                          layer={rootLayer}
                        />
                      </div>

                      <div style={{ flexShrink: 0, fontSize: 24 }}>
                        <SelectionBackgroundIcon />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DndContext>
        </div>
      </PageContext.Provider>
    </Sidebar>
  );
};

export default forwardRef<HTMLDivElement, LayerSidebarProps>(LayerSidebar);
