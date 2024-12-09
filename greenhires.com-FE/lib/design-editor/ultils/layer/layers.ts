import {
  boundingRect,
  LayerComponentProps,
  LayerId,
  SerializedLayer,
  SerializedLayers,
} from "@lidojs/design-core";
import { createElement, ReactElement } from "react";
import { v4 } from "uuid";
import { resolvers } from "../../editor/resolvers";
import {
  FrameLayerProps,
  GroupLayerProps,
  ImageLayerProps,
  ItemLayerProps,
  LineLayerProps,
  RootLayerProps,
  SectionLayerProps,
  ShapeLayerProps,
  SvgLayerProps,
  TextLayerProps,
  VideoLayerProps,
} from "../../layers";

import { Layer, LayerComponent, LayerData, Layers } from "../../types";
import { resolveComponent } from "./resolveComponent";

export const getRandomId = (): LayerId => v4();
export const deserializeLayer = <P extends LayerComponentProps>(
  data: SerializedLayer
): LayerData<P> => {
  const { type, props } = deserializeComponent(data);
  return {
    ...(type as LayerComponent<P>)?.info,
    comp: type as LayerComponent<P>,
    props,
    locked: data.locked,
    child: data.child,
    parent: data.parent,
  };
};

const deserializeComponent = (data: SerializedLayer): ReactElement => {
  const {
    type: { resolvedName },
    props,
  } = data;
  const component = resolvers[resolvedName];
  return createElement(component, props) as ReactElement;
};

export const getBoundingBoxGroup = (layers: Layers, ids: string[]) => {
  const { left, right, top, bottom } = ids.reduce(
    (acc, id) => {
      const props = layers[id].data.props;
      const rect = boundingRect(props.boxSize, props.position, props.rotate);
      if (acc.left === null || acc.left > rect.x) {
        acc.left = rect.x;
      }
      if (acc.right === null || acc.right < rect.x + rect.width) {
        acc.right = rect.x + rect.width;
      }
      if (acc.top === null || acc.top > rect.y) {
        acc.top = rect.y;
      }
      if (acc.bottom === null || acc.bottom < rect.y + rect.height) {
        acc.bottom = rect.y + rect.height;
      }
      return acc;
    },
    {
      left: null,
      right: null,
      top: null,
      bottom: null,
    } as {
      left: number | null;
      right: number | null;
      top: number | null;
      bottom: number | null;
    }
  );
  return {
    left,
    right,
    top,
    bottom,
  };
};

export const serializeLayers = (
  layers: Layers,
  rootTreeId: LayerId
): SerializedLayers => {
  let res: SerializedLayers = {};
  res[rootTreeId] = {
    type: {
      resolvedName: resolveComponent(layers[rootTreeId].data.comp),
    },
    props: layers[rootTreeId].data.props,
    locked: layers[rootTreeId].data.locked,
    child: layers[rootTreeId].data.child,
    parent: layers[rootTreeId].data.parent,
  };
  layers[rootTreeId].data.child.forEach((childId) => {
    res = { ...res, ...serializeLayers(layers, childId) };
  });
  return res;
};

export const serializeItem = (
  layers: Layers,
  rootTreeId: LayerId
): SerializedLayers => {
  let res: SerializedLayers = {};
  const new_item_id = rootTreeId.replace(/\[(.*?)\]/g, "[{humantree_id}]");
  const parent_id =
    layers[rootTreeId]?.data?.parent?.replace(
      /\[(.*?)\]/g,
      "[{humantree_id}]"
    ) || null;
  res[new_item_id] = {
    type: {
      resolvedName: resolveComponent(layers[rootTreeId].data.comp),
    },
    props: layers[rootTreeId].data.props,
    locked: layers[rootTreeId].data.locked,
    child: layers[rootTreeId].data.child.map((child) =>
      child.replace(/\[(.*?)\]/g, "[{humantree_id}]")
    ),
    parent: parent_id,
  };
  layers[rootTreeId].data.child.forEach((childId) => {
    res = { ...res, ...serializeItem(layers, childId) };
  });
  return res;
};

export const isRootLayer = <P extends LayerComponentProps>(
  layer: Layer<RootLayerProps> | Layer<P>
): layer is Layer<RootLayerProps> => layer.data.type === "Root";

export const isMainLayer = <P extends LayerComponentProps>(layer: Layer<P>) =>
  layer.data.parent === "ROOT";

export const isGroupLayer = <P extends LayerComponentProps>(
  layer: Layer<GroupLayerProps> | Layer<P>
): layer is Layer<GroupLayerProps> => layer.data.type === "Group";

export const isResumeLayer = <P extends LayerComponentProps>(
  layer: Layer<RootLayerProps> | Layer<P>
): layer is Layer<RootLayerProps> => layer.data.type === "Resume";

export const isSectionLayer = <P extends LayerComponentProps>(
  layer: Layer<SectionLayerProps> | Layer<P>
): layer is Layer<SectionLayerProps> => layer.data.type === "Section";

export const isItemLayer = <P extends LayerComponentProps>(
  layer: Layer<ItemLayerProps> | Layer<P>
): layer is Layer<ItemLayerProps> => layer.data.type === "Item";

export const isTextLayer = <P extends LayerComponentProps>(
  layer: Layer<TextLayerProps> | Layer<P>
): layer is Layer<TextLayerProps> => layer.data.type === "Text";

export const isFrameLayer = <P extends LayerComponentProps>(
  layer: Layer<FrameLayerProps> | Layer<P>
): layer is Layer<FrameLayerProps> => layer.data.type === "Frame";

export const isSvgLayer = <P extends LayerComponentProps>(
  layer: Layer<SvgLayerProps> | Layer<P>
): layer is Layer<SvgLayerProps> => layer.data.type === "Svg";

export const isImageLayer = <P extends LayerComponentProps>(
  layer: Layer<ImageLayerProps> | Layer<P>
): layer is Layer<ImageLayerProps> => layer.data.type === "Image";

export const isShapeLayer = <P extends LayerComponentProps>(
  layer: Layer<ShapeLayerProps> | Layer<P>
): layer is Layer<ShapeLayerProps> => layer.data.type === "Shape";

export const isLineLayer = <P extends LayerComponentProps>(
  layer: Layer<LineLayerProps> | Layer<P>
): layer is Layer<LineLayerProps> => layer.data.type === "Line";

export const isVideoLayer = <P extends LayerComponentProps>(
  layer: Layer<VideoLayerProps> | Layer<P>
): layer is Layer<VideoLayerProps> => layer.data.type === "Video";
