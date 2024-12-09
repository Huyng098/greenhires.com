import { useEffect, useMemo } from "react";
import { useEditor, useSelectedLayers } from "../hooks";
import {
  FrameLayerProps,
  LineLayerProps,
  RootLayerProps,
  ShapeLayerProps,
  SvgLayerProps,
  TextLayerProps,
} from "../layers";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Layer } from "../types";
import {
  isFrameLayer,
  isLineLayer,
  isRootLayer,
  isShapeLayer,
  isSvgLayer,
  isTextLayer,
} from "../ultils/layer/layers";
import CommonSettings from "./CommonSettings";
import FrameSettings from "./FrameSettings";
import LineSettings from "./LineSettings";
import RootSettings from "./RootSettings";
import ShapeSettings from "./ShapeSettings";
import SvgSettings from "./SvgSetting";
import TextSettings from "./TextSettings";

const LayerSettings = () => {
  const { selectedLayers, selectedLayerIds } = useSelectedLayers();
  const { actions, sidebar, isPageLocked } = useEditor((state) => ({
    sidebar: state.sidebar,
    isPageLocked:
      state.pages[state.activePage] &&
      state.pages[state.activePage].layers.ROOT.data.locked,
    state: state,
  }));
  const {
    rootLayer,
    textLayers,
    lineLayers,
    shapeLayers,
    svgLayers,
    frameLayers,
  } = useMemo(() => {
    return selectedLayers.reduce(
      (acc, layer) => {
        if (layer.data.locked) {
          return acc;
        }
        if (isRootLayer(layer)) {
          acc.rootLayer = layer;
        } else if (isSvgLayer(layer)) {
          acc.svgLayers.push(layer);
        } else if (isTextLayer(layer)) {
          acc.textLayers.push(layer);
        } else if (isShapeLayer(layer)) {
          acc.shapeLayers.push(layer);
        } else if (isFrameLayer(layer)) {
          acc.frameLayers.push(layer);
        } else if (isLineLayer(layer)) {
          acc.lineLayers.push(layer);
        }
        return acc;
      },
      {
        textLayers: [],
        lineLayers: [],
        shapeLayers: [],
        rootLayer: null,
        svgLayers: [],
        frameLayers: [],
      } as {
        textLayers: Layer<TextLayerProps>[];
        lineLayers: Layer<LineLayerProps>[];
        shapeLayers: Layer<ShapeLayerProps>[];
        rootLayer: Layer<RootLayerProps> | null;
        svgLayers: Layer<SvgLayerProps>[];
        frameLayers: Layer<FrameLayerProps>[];
      }
    );
  }, [selectedLayers]);
  useEffect(() => {
    const layerType: string[] = [];
    if (sidebar && sidebar !== "LAYER_MANAGEMENT") {
      selectedLayers.forEach((layer) => {
        layerType.push(layer.data.type);
      });
      if (
        sidebar &&
        layerType.includes("Text") &&
        ![
          "FONT_FAMILY",
          "TEXT_EFFECT",
          "CHOOSING_COLOR",
          "CHOOSING_SHAPE_COLOR",
          "CHOOSING_SHAPE_BORDER_COLOR",
        ].includes(sidebar)
      ) {
        actions.setSidebar();
      } else if (
        sidebar &&
        (layerType.includes("Shape") || layerType.includes("Root")) &&
        ![
          "FONT_FAMILY",
          "CHOOSING_COLOR",
          "CHOOSING_SHAPE_COLOR",
          "CHOOSING_SHAPE_BORDER_COLOR",
          "CHOOSING_COLOR_TEXT_SHAPE",
        ].includes(sidebar)
      ) {
        actions.setSidebar();
      }
    }
    // layer props shouldn't affect this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebar, selectedLayerIds, actions]);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 14,
        fontWeight: 600,
        padding: "0 8px",
      }}
    >
      <ScrollArea className="whitespace-nowrap w-full py-2">
        <div className="flex w-full">
          {rootLayer && !isPageLocked && <RootSettings layer={rootLayer} />}
          {frameLayers.length > 0 && !isPageLocked && (
            <FrameSettings layers={frameLayers} />
          )}
          {lineLayers.length > 0 && !isPageLocked && (
            <LineSettings layers={lineLayers} />
          )}
          {svgLayers.length === 1 && !isPageLocked && (
            <SvgSettings layer={svgLayers[0]} />
          )}
          {shapeLayers.length > 0 && !isPageLocked && (
            <ShapeSettings layers={shapeLayers} />
          )}
          {textLayers.length > 0 && !isPageLocked && (
            <TextSettings layers={textLayers} />
          )}
          <CommonSettings />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default LayerSettings;
