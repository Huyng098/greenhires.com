import { Delta, LayerId } from "@lidojs/design-core";
import { Layers } from "../types";

export const getOverlap = (
  dragedLayers: Record<LayerId, Delta>,
  layers: Layers
) => {
  if (Object.entries(dragedLayers).length !== 1) return {};
  const [id, position] = Object.entries(dragedLayers)[0];
  const layer = layers[id];
  if (!layer) return {};
  const { boxSize } = layer.data.props;
  const overlap = Object.entries(layers).filter(([key, value]) => {
    if (key === id) return false;
    const { boxSize: boxSize2, position: position2 } = value.data.props;
    const overlapX =
      position.x + boxSize.width > position2.x &&
      position.x < position2.x + boxSize2.width;
    const overlapY =
      position.y + boxSize.height > position2.y &&
      position.y < position2.y + boxSize2.height;
    return overlapX && overlapY;
  });
  return overlap;
};
