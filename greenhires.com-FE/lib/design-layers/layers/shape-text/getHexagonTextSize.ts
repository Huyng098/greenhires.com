import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from "@lidojs/design-core";

export const getHexagonVerticalTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const maxWidth = width;
  const maxHeight = height / 2;

  const posX = 0;
  const posY = (height - maxHeight) / 2;

  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(maxHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
export const getHexagonHorizontalTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const maxWidth = width / 2;
  const maxHeight = height;

  const posX = (width - maxWidth) / 2;
  const posY = 0;

  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(maxHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
