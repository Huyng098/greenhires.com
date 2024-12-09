import { PAGE_PADDING_X, PAGE_PADDING_Y } from "@/constants/general";

interface ITemplatePadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const DEFAULT_PADDING = {
  top: PAGE_PADDING_Y,
  right: PAGE_PADDING_X,
  bottom: PAGE_PADDING_Y,
  left: PAGE_PADDING_X,
};

export const TemplatePadding: Record<string, ITemplatePadding> = {
  "Template 2": {
    ...DEFAULT_PADDING,
    right: 64,
    left: 64,
  },
  "Template 3": {
    ...DEFAULT_PADDING,
    top: 35,
  },
  "Template 9": {
    ...DEFAULT_PADDING,
    top: 72,
    bottom: 72,
  },
  "Template 11": {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  "Template 13": {
    ...DEFAULT_PADDING,
    top: 100,
  },
  "Template 14": {
    top: 100,
    right: 130,
    bottom: 100,
    left: 130,
  },
};

export function getTemplatePadding(template: string): ITemplatePadding {
  const padding = TemplatePadding[template];
  if (!padding) {
    return DEFAULT_PADDING;
  }
  return padding;
}
