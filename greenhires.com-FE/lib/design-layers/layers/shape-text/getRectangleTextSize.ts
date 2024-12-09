import { normalizeNumber } from '@lidojs/design-core';

export const getRectangleTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  return {
    width: normalizeNumber(width),
    height: normalizeNumber(height),
    x: 0,
    y: 0,
  };
};
