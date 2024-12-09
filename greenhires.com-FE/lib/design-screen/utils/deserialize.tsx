import {
  LayerComponentProps,
  LayerId,
  SerializedLayer,
  SerializedPage,
} from "@lidojs/design-core";
import { createElement, ReactElement } from "react";
import TransformLayer from "../layers/TransformLayer";
import { resolvers } from "./resolvers";

const renderLayer = (
  layers: Record<LayerId, SerializedLayer>,
  layerId: LayerId
): ReactElement | null => {
  const layer = layers[layerId];
  const resolver = resolvers[layer.type.resolvedName];
  if (!resolver) {
    return null;
  }
  const child = layer.child.map((lId) => renderWrapperLayer(layers, lId));
  return createElement(
    resolver,
    { ...(layer.props as LayerComponentProps), key: layerId, layerId },
    child
  );
};
export const renderWrapperLayer = (
  layers: Record<LayerId, SerializedLayer>,
  layerId: LayerId
) => {
  return createElement(
    TransformLayer,
    { ...(layers[layerId].props as LayerComponentProps), key: layerId },
    renderLayer(layers, layerId)
  );
};
export const renderPages = (serializedPages: SerializedPage[]) => {
  return serializedPages?.map((serializedPage) => {
    return renderWrapperLayer(serializedPage.layers, "ROOT");
  });
};
