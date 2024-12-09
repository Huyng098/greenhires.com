import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from '@lidojs/design-core';

export const getPentagonPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const paddingRatio = 0.191;
  const vector = [
    new Vector(normalizeNumber(width / 2), 0),
    new Vector(
      normalizeNumber(width),
      normalizeNumber(paddingRatio * 2 * height)
    ),
    new Vector(
      normalizeNumber(width - paddingRatio * width),
      normalizeNumber(height)
    ),
    new Vector(normalizeNumber(paddingRatio * width), normalizeNumber(height)),
    new Vector(0, normalizeNumber(paddingRatio * 2 * height)),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
