import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from "@lidojs/design-core";

export const getTriangleTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const maxHeight = height / 2;
  const maxWidth = width/2;
  const posX = width / 4;
  const posY = height / 2;
  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(maxHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
export const getTriangleUpsideDownTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const maxHeight = height / 2;
  const maxWidth = width/2;
  const posX = width / 4;
  const posY = 0;
  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(maxHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
