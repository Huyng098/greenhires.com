import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from '@lidojs/design-core';

const PADDING = 16;
export const getParallelogramPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const vector = [
    new Vector(PADDING, 0),
    new Vector(normalizeNumber(width), 0),
    new Vector(normalizeNumber(width) - PADDING, normalizeNumber(height)),
    new Vector(0, normalizeNumber(height)),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
export const getParallelogramUpsideDownPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const vector = [
    new Vector(normalizeNumber(width - PADDING), 0),
    new Vector(0, 0),
    new Vector(PADDING, normalizeNumber(height)),
    new Vector(normalizeNumber(width), normalizeNumber(height)),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
