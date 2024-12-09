import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from '@lidojs/design-core';

export const getHexagonVerticalPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const oneFourthHeight = normalizeNumber(height * 0.25);
  const vector = [
    new Vector(normalizeNumber(width / 2), 0),
    new Vector(normalizeNumber(width), oneFourthHeight),
    new Vector(
      normalizeNumber(width),
      normalizeNumber(height) - oneFourthHeight
    ),
    new Vector(normalizeNumber(width / 2), normalizeNumber(height)),
    new Vector(0, normalizeNumber(height) - oneFourthHeight),
    new Vector(0, oneFourthHeight),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
export const getHexagonHorizontalPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const oneFourthWidth = normalizeNumber(width * 0.25);

  const vector = [
    new Vector(oneFourthWidth, 0),
    new Vector(normalizeNumber(width) - oneFourthWidth, 0),
    new Vector(normalizeNumber(width), normalizeNumber(height / 2)),
    new Vector(
      normalizeNumber(width - oneFourthWidth),
      normalizeNumber(height)
    ),
    new Vector(oneFourthWidth, normalizeNumber(height)),
    new Vector(0, normalizeNumber(height / 2)),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
