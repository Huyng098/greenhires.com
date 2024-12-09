import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from "@lidojs/design-core";

const PADDING = 16;
export const getParallelogramTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const maxWidth = width - PADDING * 8;
  const maxHeight = height;

  const posX = PADDING * 4;
  const posY = 0;

  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(maxHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
export const getParallelogramUpsideDownTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const maxWidth = width - PADDING * 8;
  const maxHeight = height;

  const posX = PADDING * 4;
  const posY = 0;

  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(maxHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
