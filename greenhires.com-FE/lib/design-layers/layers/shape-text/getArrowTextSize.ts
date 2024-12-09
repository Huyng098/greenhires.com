import {
  getRoundedPolygon,
  normalizeNumber,
  Vector,
} from "@lidojs/design-core";

const ARROW_SIZE = 32;
export const getArrowTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const rectHeight = height / 2;

  const maxWidth = width - ARROW_SIZE * 2;

  const posX = 0;
  const posY = (height - rectHeight) / 2;

  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(rectHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
export const getArrowBottomTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const rectHeight = height - ARROW_SIZE * 2;

  const maxWidth = width / 2;

  const posX = (width - maxWidth) / 2;
  const posY = 0;

  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(rectHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
export const getArrowTopTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const rectHeight = height - ARROW_SIZE * 2;

  const maxWidth = width / 2;

  const posX = (width - maxWidth) / 2;
  const posY = ARROW_SIZE * 2;

  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(rectHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
export const getArrowLeftTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const rectHeight = height / 2;

  const maxWidth = width - ARROW_SIZE * 2;

  const posX = ARROW_SIZE * 2;
  const posY = (height - rectHeight) / 2;

  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(rectHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
export const getChevronTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const rectWidth = width - ARROW_SIZE * 4;
  const rectHeight = height;

  const posX = ARROW_SIZE * 2;
  const posY = 0;

  return {
    width: normalizeNumber(rectWidth),
    height: normalizeNumber(rectHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};

export const getArrowPentagonTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const rectWidth = width - ARROW_SIZE * 2;
  const rectHeight = height;

  return {
    width: normalizeNumber(rectWidth),
    height: normalizeNumber(rectHeight),
    x: 0,
    y: 0,
  };
};
