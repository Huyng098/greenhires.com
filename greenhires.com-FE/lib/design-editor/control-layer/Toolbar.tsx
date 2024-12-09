import { AIText } from "@/components/controls/texteditor/ai-text";
import DotsThreeBoldIcon from "@duyank/icons/bold/DotsThreeBold";
import DuplicateIcon from "@duyank/icons/external/Duplicate";
import LockKeyIcon from "@duyank/icons/regular/LockKey";
import TrashIcon from "@duyank/icons/regular/Trash";
import { LayerComponentProps, boundingRect } from "@lidojs/design-core";
import { Images, OpenAiLogo } from "@phosphor-icons/react";
import { Node as ProsemirrorNode } from "prosemirror-model";
import React, { Fragment, useContext, useMemo, useRef, useState } from "react";
import { setContent } from "../common/text-editor/core/helper/setContent";
import { useEditor, useSelectedLayers } from "../hooks";
import { ShapeLayerProps, TextLayerProps } from "../layers";
import { PageContext } from "../layers/core/PageContext";
import { Layer } from "../types";
import {
  isGroupLayer,
  isItemLayer,
  isResumeLayer,
  isSectionLayer,
  isShapeLayer,
  isTextLayer,
} from "../ultils/layer/layers";
import { duplicate } from "../ultils/menu-actions/duplicate";

const Toolbar = () => {
  const { pageIndex } = useContext(PageContext);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { selectedLayerIds, selectedLayers } = useSelectedLayers();
  const {
    actions,
    state,
    isDragging,
    isResizing,
    isRotating,
    controlBox,
    pageSize,
    editingLayer,
    textEditor,
    isOpenMenu,
    scale,
    isPageLocked,
    isUpdatingLine,
  } = useEditor((state, query) => ({
    isGroup: state.selectedLayers[state.activePage].length > 1,
    isDragging: state.dragData.status,
    isResizing: state.resizeData.status,
    isRotating: state.rotateData.status,
    isUpdatingLine: state.updateLineData.status,
    controlBox: state.controlBox,
    textEditor: state.textEditor,
    editingLayer: state.textEditor
      ? (state.pages[state.textEditor.pageIndex].layers[
          state.textEditor.layerId
        ] as unknown as Layer<TextLayerProps>)
      : null,
    pageSize: query.getPageSize(),
    isPageLocked: state.pages[state.activePage].layers.ROOT.data.locked,
    isOpenMenu: !!state.openMenu,
    scale: state.scale,
  }));
  const selectedNodes = useMemo(() => {
    if (selectedLayers.length === 1 && isTextLayer(selectedLayers[0])) {
      if (editingLayer) {
        const editor = textEditor?.editor;
        if (editor) {
          const nodes: ProsemirrorNode[] = [];
          const { $from, $to } = editor.state.selection;
          const nodeList = editor.state.doc.cut($from.pos, $to.pos);
          nodeList.content.forEach((node) => {
            nodes.push(node);
          });
          return nodes;
        }
        return null;
      }
      return null;
    }
    return null;
  }, [selectedLayers]);

  const isLocked = selectedLayers.find((i) => i.data.locked);
  const boundingBoxRect = useMemo(() => {
    if (!controlBox) {
      return {
        x: 0,
        y: 80,
        width: pageSize.width,
        height: pageSize.height,
      };
    }
    return boundingRect(
      controlBox.boxSize,
      controlBox.position,
      controlBox.rotate
    );
  }, [controlBox, pageSize.height, pageSize.width]);
  const handleDuplicate = () => {
    duplicate(state, { pageIndex, layerIds: selectedLayerIds, actions });
  };
  const showContextMenu = () => {
    if (isOpenMenu) {
      actions.hideContextMenu();
    } else {
      const rect = toolbarRef.current?.getBoundingClientRect() as DOMRect;
      actions.showContextMenu({
        clientX: rect.right - 42,
        clientY: rect.bottom + 4,
      });
    }
  };

  const handleUngroup = () => {
    if (selectedLayerIds.length === 1) {
      actions.ungroup(selectedLayerIds[0]);
    }
  };
  const cv_key = useMemo(() => {
    if (selectedLayerIds.length === 0) {
      return undefined;
    }

    const [firstId] = selectedLayerIds;
    const idParts = firstId.split(".");

    if (
      selectedLayerIds.every(
        (id) => id.startsWith("basics") && id !== "basics.picture"
      )
    ) {
      return "basics";
    }
    const itemKey = idParts.slice(0, 3).join(".");
    if (selectedLayerIds.every((id) => id.startsWith(itemKey))) {
      return itemKey;
    }
    const sectionKey = idParts.slice(0, 2).join(".");
    if (selectedLayerIds.every((id) => id.startsWith(sectionKey))) {
      return sectionKey;
    }
    return undefined;
  }, [selectedLayerIds]);

  const handleGroup = () => {
    if (cv_key) {
      const layer_type = cv_key.includes("items")
        ? "ItemLayer"
        : "SectionLayer";

      actions.group(selectedLayerIds, cv_key, layer_type);
    } else {
      actions.group(selectedLayerIds);
    }
  };

  const onChangeReplacePart = (text: string) => {
    const editor = textEditor?.editor;
    if (editor) {
      const { tr } = editor.state;
      const { from } = editor.state.selection;
      let newSelectedPoint = from;
      let trx = tr;
      selectedNodes?.forEach((e) => {
        try {
          const currentDocSize = trx.doc.nodeSize;

          trx.insertText(
            text,
            newSelectedPoint,
            newSelectedPoint + e.nodeSize - 2
          );
          const sizeOffset = trx.doc.nodeSize - currentDocSize;
          newSelectedPoint = newSelectedPoint + e.nodeSize + sizeOffset;
        } catch (error) {
          console.log("error: ", error);
        }
      });
      editor.dispatch(trx);
    }
  };
  const onChangeAIText = (value: string, isMinus: boolean) => {
    selectedLayers.forEach((layer) => {
      const editor = layer.data.editor;
      if (editor) {
        const color = (layer.data.props as TextLayerProps).colors[0];
        const fontSize = (layer.data.props as TextLayerProps).fontSizes[0];
        const fontFamily = (layer.data.props as TextLayerProps).fonts[0];
        if (!isMinus) {
          const innerHTML = `${editor.dom.innerHTML} <p style="color: ${color}; font-size: ${fontSize}px; font-family: ${fontFamily}">${value}</p>`;
          if (state.textEditor) {
            const editingEditor = state.textEditor.editor;
            if (editingEditor) {
              setContent(innerHTML)(
                editingEditor.state,
                editingEditor.dispatch
              );
            }
          } else {
            setContent(innerHTML)(editor.state, editor.dispatch);
          }
        } else {
          const innerHTML = editor.dom.innerHTML.replace(
            new RegExp(`<p[^>]*><span[^>]*>${value}</span></p>`, "g"),
            ""
          );
          if (state.textEditor) {
            const editingEditor = state.textEditor.editor;
            if (editingEditor) {
              setContent(innerHTML)(
                editingEditor.state,
                editingEditor.dispatch
              );
            }
          } else {
            setContent(innerHTML)(editor.state, editor.dispatch);
          }
        }
      }
    });
  };

  const openImageEditor = (selectingLayer: Layer<LayerComponentProps>) => {
    if (isShapeLayer(selectingLayer)) {
      const image = selectingLayer.data.props.image;
      if (image && selectedLayerIds.includes(selectingLayer.id)) {
        const layerProps = selectingLayer.data.props;
        actions.history
          .throttle(2000)
          .setProp<ShapeLayerProps>(pageIndex, selectingLayer.id, {
            fill: "image",
          });
        actions.openImageEditor(pageIndex, selectingLayer.id, {
          boxSize: layerProps.boxSize,
          position: layerProps.position,
          rotate: layerProps.rotate,
          image: {
            boxSize: {
              width: image.boxSize.width * layerProps.scale,
              height: image.boxSize.height * layerProps.scale,
            },
            position: {
              x: image.position.x * layerProps.scale,
              y: image.position.y * layerProps.scale,
            },
            rotate: image.rotate || 0,
            url: image.url,
          },
        });
      }
    }
  };

  const [aiOpen, setAIOpen] = useState(false);
  const [option, setOption] = useState<
    "grammar" | "shorter" | "longer" | "text" | "paragraph" | "rewrite" | null
  >(null);

  if (
    isDragging ||
    isResizing ||
    isRotating ||
    isUpdatingLine ||
    (selectedLayerIds.includes("ROOT") && !isLocked && !isPageLocked) ||
    !controlBox
  ) {
    return null;
  }
  const containerGroupLayer = !!selectedLayers.find((l) => isGroupLayer(l));
  const containerCVLayer = !!selectedLayers.find(
    (l) => isSectionLayer(l) || isItemLayer(l)
  );
  const containerSectionLayer = !!selectedLayers.find((l) => isSectionLayer(l));
  if (isResumeLayer(selectedLayers[0])) return null;
  return (
    <div
      ref={toolbarRef}
      style={{
        position: "absolute",
        left: (boundingBoxRect.x + boundingBoxRect.width / 2) * scale,
        top: boundingBoxRect.y * scale - 60,
        transform: "translateX(-50%)",
      }}
    >
      <div
        style={{
          height: 40,
          borderRadius: 4,
          padding: "0 4px",
          display: "inline-flex",
          alignItems: "center",
          background: "#fff",
          boxShadow:
            "0 0 0 1px rgba(64,87,109,.07),0 2px 12px rgba(53,71,90,.2)",
          overflow: "hidden",
          pointerEvents: "auto",
          color: "#0d1216",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            whiteSpace: "nowrap",
          }}
        >
          {!isPageLocked && !isLocked && !selectedLayerIds.includes("ROOT") && (
            <Fragment>
              {selectedLayerIds.length > 1 && (
                <div
                  className="hover:bg-[rgba(64,87,109,.07)]"
                  style={{
                    lineHeight: "32px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: "0 8px",
                    fontWeight: 700,
                  }}
                  onClick={handleGroup}
                >
                  {cv_key ? "Merge" : "Group"}
                </div>
              )}
              {containerGroupLayer && (
                <div
                  className="hover:bg-[rgba(64,87,109,.07)]"
                  style={{
                    lineHeight: "32px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: "0 8px",
                    fontWeight: 700,
                  }}
                  onClick={handleUngroup}
                >
                  Ungroup
                </div>
              )}
              {selectedLayerIds.length === 1 && containerCVLayer && (
                <div
                  className="hover:bg-[rgba(64,87,109,.07)]"
                  style={{
                    lineHeight: "32px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: "0 8px",
                    fontWeight: 700,
                  }}
                  onClick={handleUngroup}
                >
                  Split
                </div>
              )}
              {selectedLayers.length === 1 &&
                (isTextLayer(selectedLayers[0]) ||
                  isShapeLayer(selectedLayers[0])) && (
                  <>
                    <AIText
                      job_title=""
                      initialText={
                        //selectedText ||
                        selectedLayers[0].data.editor?.dom.innerText || ""
                      }
                      className="flex"
                      onChangeText={onChangeAIText}
                      option={option}
                      setOption={setOption}
                      aiOpen={aiOpen}
                      setAIOpen={setAIOpen}
                      onChange={onChangeReplacePart}
                    >
                      <button
                        className="enabled:hover:text-secondary-main"
                        style={{
                          width: 32,
                          height: 32,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: 24,
                        }}
                        onClick={() => setAIOpen(true)}
                        disabled={option !== null}
                      >
                        <OpenAiLogo size={24} weight="light" />
                      </button>
                    </AIText>
                    <div
                      className="hover:bg-[rgba(64,87,109,.07)]"
                      style={{
                        width: 32,
                        height: 32,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        fontSize: 24,
                      }}
                      onClick={() => openImageEditor(selectedLayers[0])}
                    >
                      <Images />
                    </div>
                  </>
                )}
              {!containerSectionLayer && (
                <div
                  className="hover:bg-[rgba(64,87,109,.07)]"
                  style={{
                    width: 32,
                    height: 32,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontSize: 24,
                  }}
                  onClick={handleDuplicate}
                >
                  <DuplicateIcon />
                </div>
              )}

              <div
                className="hover:bg-[rgba(64,87,109,.07)]"
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: 24,
                }}
                onClick={() => actions.deleteLayer(pageIndex, selectedLayerIds)}
              >
                <TrashIcon />
              </div>

              <div
                className="hover:bg-[rgba(64,87,109,.07)]"
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: 24,
                }}
                onClick={showContextMenu}
              >
                <DotsThreeBoldIcon />
              </div>
            </Fragment>
          )}
          {(isLocked || isPageLocked) && (
            <div
              className={`${isPageLocked ? "" : "hover:bg-[rgba(64,87,109,.07)]"}`}
              style={{
                width: 32,
                height: 32,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                fontSize: 24,
                color: isPageLocked ? "rgba(36,49,61,.4)" : undefined,
              }}
              onClick={() => {
                actions.unlock(pageIndex, selectedLayerIds);
              }}
            >
              <LockKeyIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Toolbar);
