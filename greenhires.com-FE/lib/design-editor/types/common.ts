export type HorizontalGuideline = {
  y: number;
  x1: number;
  x2: number;
  label?: string;
};
export type VerticalGuideline = {
  x: number;
  y1: number;
  y2: number;
  label?: string;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
export type GetFontQuery = Partial<{
  limit: string;
  offset: string;
  q: string;
  name: string[];
}>;

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GestureEvent = UIEvent & {
  scale: number;
  rotation: number;
};
