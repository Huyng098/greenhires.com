import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from '@lidojs/design-core';

export const getCrossPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const oneThirdWidth = normalizeNumber(width / 3);
  const twoThirdsWidth = oneThirdWidth * 2;
  const oneThirdHeight = normalizeNumber(height / 3);
  const twoThirdsHeight = oneThirdHeight * 2;
  const vector = [
    new Vector(oneThirdWidth, 0),
    new Vector(twoThirdsWidth, 0),
    new Vector(twoThirdsWidth, oneThirdHeight),
    new Vector(normalizeNumber(width), oneThirdHeight),
    new Vector(normalizeNumber(width), twoThirdsHeight),
    new Vector(twoThirdsWidth, twoThirdsWidth),
    new Vector(twoThirdsWidth, normalizeNumber(height)),
    new Vector(oneThirdWidth, normalizeNumber(height)),
    new Vector(oneThirdWidth, twoThirdsHeight),
    new Vector(0, twoThirdsHeight),
    new Vector(0, oneThirdHeight),
    new Vector(oneThirdWidth, oneThirdHeight),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
