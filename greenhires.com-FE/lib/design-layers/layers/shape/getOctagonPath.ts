import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from '@lidojs/design-core';

export const getOctagonPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const withRate = normalizeNumber(width * 0.29);
  const heightRate = normalizeNumber(height * 0.29);
  const vector = [
    new Vector(withRate, 0),
    new Vector(normalizeNumber(width) - withRate, 0),
    new Vector(normalizeNumber(width), heightRate),
    new Vector(normalizeNumber(width), normalizeNumber(height) - heightRate),
    new Vector(normalizeNumber(width) - withRate, normalizeNumber(height)),
    new Vector(withRate, normalizeNumber(height)),
    new Vector(0, normalizeNumber(height) - heightRate),
    new Vector(0, heightRate),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
