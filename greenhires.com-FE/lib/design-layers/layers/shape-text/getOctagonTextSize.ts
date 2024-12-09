import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from "@lidojs/design-core";

export const getOctagonTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const withRate = normalizeNumber(width * 0.29);
  const heightRate = normalizeNumber(height * 0.29);

  const maxWidth = width - withRate;
  const maxHeight = height - heightRate;

  const posX = withRate / 2;
  const posY = heightRate / 2;

  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(maxHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
