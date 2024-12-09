import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from '@lidojs/design-core';

export const getTrianglePath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const halfWidth = normalizeNumber(width / 2);
  const vectors = [
    new Vector(halfWidth, 0),
    new Vector(normalizeNumber(width), normalizeNumber(height)),
    new Vector(0, normalizeNumber(height)),
  ];
  return getRoundedPolygon(vectors, roundedCorners).join(' ');
};
export const getTriangleUpsideDownPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const halfWidth = normalizeNumber(width / 2);
  const vectors = [
    new Vector(0, 0),
    new Vector(normalizeNumber(width), 0),
    new Vector(halfWidth, normalizeNumber(height)),
  ];
  return getRoundedPolygon(vectors, roundedCorners).join(' ');
};
