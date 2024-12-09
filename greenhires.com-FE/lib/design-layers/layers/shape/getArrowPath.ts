import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from '@lidojs/design-core';

const ARROW_SIZE = 32;
export const getArrowPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const oneFourthHeight = normalizeNumber(height / 4);
  const vector = [
    new Vector(normalizeNumber(width) - ARROW_SIZE, 0),
    new Vector(normalizeNumber(width), normalizeNumber(height / 2)),
    new Vector(normalizeNumber(width) - ARROW_SIZE, normalizeNumber(height)),
    new Vector(
      normalizeNumber(width) - ARROW_SIZE,
      normalizeNumber(height - oneFourthHeight)
    ),
    new Vector(0, normalizeNumber(height - oneFourthHeight)),
    new Vector(0, normalizeNumber(oneFourthHeight)),
    new Vector(
      normalizeNumber(width) - ARROW_SIZE,
      normalizeNumber(oneFourthHeight)
    ),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
export const getArrowBottomPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const oneFourthWidth = normalizeNumber(width / 4);
  const vector = [
    new Vector(normalizeNumber(oneFourthWidth), 0),
    new Vector(normalizeNumber(width - oneFourthWidth), 0),
    new Vector(
      normalizeNumber(width - oneFourthWidth),
      normalizeNumber(height) - ARROW_SIZE
    ),
    new Vector(normalizeNumber(width), normalizeNumber(height) - ARROW_SIZE),
    new Vector(normalizeNumber(width / 2), normalizeNumber(height)),
    new Vector(0, normalizeNumber(height) - ARROW_SIZE),
    new Vector(oneFourthWidth, normalizeNumber(height) - ARROW_SIZE),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
export const getArrowTopPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const oneFourthWidth = width / 4;
  const vector = [
    new Vector(normalizeNumber(width / 2), 0),
    new Vector(normalizeNumber(width), ARROW_SIZE),
    new Vector(normalizeNumber(width - oneFourthWidth), ARROW_SIZE),
    new Vector(
      normalizeNumber(width - oneFourthWidth),
      normalizeNumber(height)
    ),
    new Vector(oneFourthWidth, normalizeNumber(height)),
    new Vector(oneFourthWidth, ARROW_SIZE),
    new Vector(0, ARROW_SIZE),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
export const getArrowLeftPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const oneFourthHeight = normalizeNumber(height / 4);

  const vector = [
    new Vector(ARROW_SIZE, 0),
    new Vector(ARROW_SIZE, oneFourthHeight),
    new Vector(normalizeNumber(width), oneFourthHeight),
    new Vector(
      normalizeNumber(width),
      normalizeNumber(height) - oneFourthHeight
    ),
    new Vector(ARROW_SIZE, normalizeNumber(height) - oneFourthHeight),
    new Vector(ARROW_SIZE, normalizeNumber(height)),
    new Vector(0, normalizeNumber(height / 2)),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
export const getChevronPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const arrowSize = ARROW_SIZE / 2;
  const halfHeight = normalizeNumber(height / 2);
  const vector = [
    new Vector(0, 0),
    new Vector(normalizeNumber(width) - arrowSize, 0),
    new Vector(normalizeNumber(width), halfHeight),
    new Vector(normalizeNumber(width) - arrowSize, height),
    new Vector(0, normalizeNumber(height)),
    new Vector(arrowSize, halfHeight),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};

export const getArrowPentagonPath = ({
  width,
  height,
  roundedCorners,
}: {
  width: number;
  height: number;
  roundedCorners: number;
}) => {
  const arrowSize = ARROW_SIZE / 2;
  const halfHeight = height / 2;

  const vector = [
    new Vector(0, 0),
    new Vector(width - arrowSize, 0),
    new Vector(width, halfHeight),
    new Vector(width - arrowSize, height),
    new Vector(0, height),
  ];
  return getRoundedPolygon(vector, roundedCorners).join(' ');
};
