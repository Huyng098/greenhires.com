import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from '@lidojs/design-core';

export const getRhombusPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const halfW = normalizeNumber(width / 2);
  const halfH = normalizeNumber(height / 2);
  const vector = [
    new Vector(halfW, 0),
    new Vector(normalizeNumber(width), halfH),
    new Vector(halfW, normalizeNumber(height)),
    new Vector(0, halfH),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
