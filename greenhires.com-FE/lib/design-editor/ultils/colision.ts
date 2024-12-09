import { LayerComponentProps } from "@lidojs/design-core";
import { LayerData } from "../types";

export const isCanCollide = (
  current: LayerData<LayerComponentProps>,
  other: LayerData<LayerComponentProps>,
  checkSameParent = true
) => {
  return (
    other.props.position.y >= current.props.position.y &&
    ((other.props.position.x + other.props.boxSize.width >=
      current.props.position.x &&
      other.props.position.x <=
        current.props.position.x + current.props.boxSize.width) ||
      (checkSameParent && other.parent === current.parent)) // same parent
  );
};

export const isCollision = (
  pageRect: DOMRect,
  layerRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
) => {
  return (
    layerRect.x < pageRect.x + pageRect.width &&
    layerRect.x + layerRect.width > pageRect.x &&
    layerRect.y < pageRect.y + pageRect.height &&
    layerRect.y + layerRect.height > pageRect.y
  );
};
