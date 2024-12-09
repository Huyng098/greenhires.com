import { LayerComponentProps } from "@lidojs/design-core";
import { EditorState, Layer } from "../types";

export const deltaPositionGroup = (
  state: EditorState,
  layer: Layer<LayerComponentProps>
) => {
  let dx = 0;
  let dy = 0;
  let parent = layer.data.parent;

  while (parent && parent !== "ROOT") {
    const parentLayer = state.pages[state.activePage].layers[parent];
    dx += parentLayer.data.props.position.x;
    dy += parentLayer.data.props.position.y;
    parent = parentLayer.data.parent;
  }

  return { dx, dy };
};
