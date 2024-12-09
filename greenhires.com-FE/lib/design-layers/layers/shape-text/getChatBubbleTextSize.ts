import { normalizeNumber } from "@lidojs/design-core";

// TODO: need to validate min size before using this
export const getChatBubbleSquareTextSize = ({
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

export const getChatBubbleRoundTextSize = ({
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
