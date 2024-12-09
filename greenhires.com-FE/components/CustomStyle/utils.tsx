export type BorderProps = {
  borderWidth?: number;
  strokeDashArray?: string | number;
  type?: string;
  borderRadius?: number;
  borderColor?: string;
  backgroundColor?: string;
};

export const getBorder = (props: BorderProps) =>
  props.type === "none"
    ? props.type
    : `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='${props.backgroundColor ?? "none"}' rx='${props.borderRadius}' ry='${props.borderRadius}' stroke='${props.borderColor ?? "black"}' stroke-width='${props.borderWidth}' stroke-dasharray='${props.strokeDashArray}' stroke-dashoffset='0' stroke-linecap='${props.type}'/%3e%3c/svg%3e")`;

export type BorderTypes =
  | "none"
  | "line"
  | "dashed"
  | "triple-dashed"
  | "dotted";

interface BorderStyle {
  type: string;
  strokeDashArray: number | string;
}

export const BORDER_MAPPING: Record<BorderTypes, BorderStyle> = {
  none: {
    type: "none",
    strokeDashArray: 0,
  },
  line: {
    strokeDashArray: 1,
    type: "square",
  },
  dashed: {
    strokeDashArray: "6%2c14",
    type: "square",
  },
  "triple-dashed": {
    strokeDashArray: "5%2c10",
    type: "square",
  },
  dotted: {
    strokeDashArray: "2%2c8",
    type: "butt",
  },
};
