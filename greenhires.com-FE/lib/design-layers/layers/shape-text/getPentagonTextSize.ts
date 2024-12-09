import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from "@lidojs/design-core";

export const getPentagonTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const paddingRatio = 0.191;

  const maxWidth =
    normalizeNumber(width - paddingRatio * width) -
    normalizeNumber(paddingRatio * width);
  const offSetHeight = normalizeNumber(
    paddingRatio * 2 * height * (1 - (width - maxWidth) / width)
  );
  const maxHeight =
    normalizeNumber(height) -
    normalizeNumber(paddingRatio * 2 * height) +
    offSetHeight;

  const posX = normalizeNumber(paddingRatio * width);
  const posY = normalizeNumber(paddingRatio * 2 * height) - offSetHeight;

  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(maxHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
