import { normalizeNumber } from '@lidojs/design-core';

export const getCircleTextSize = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const maxWidth = width / Math.sqrt(2);
  const maxHeight = height / Math.sqrt(2);

  const posX = (width - maxWidth) / 2;
  const posY = (height - maxHeight) / 2;
  
  return {
    width: normalizeNumber(maxWidth),
    height: normalizeNumber(maxHeight),
    x: normalizeNumber(posX),
    y: normalizeNumber(posY),
  };
};
