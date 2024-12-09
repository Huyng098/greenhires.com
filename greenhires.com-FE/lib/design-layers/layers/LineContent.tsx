import { ArrowType, LayerComponentProps, LineStyle } from "@lidojs/design-core";
import React, { FC } from "react";
import ArrowArrow from "./line/ArrowArrow";
import ArrowBar from "./line/ArrowBar";
import ArrowCircle from "./line/ArrowCircle";
import ArrowDiamond from "./line/ArrowDiamond";
import ArrowSquare from "./line/ArrowSquare";
import ArrowTriangle from "./line/ArrowTriangle";

export interface LineContentProps extends LayerComponentProps {
  style: LineStyle;
  color: string;
  arrowStart?: ArrowType;
  arrowEnd?: ArrowType;
  usingMainColor?: boolean;
}

const arrow = {
  bar: ArrowBar,
  arrow: ArrowArrow,
  triangle: ArrowTriangle,
  outlineCircle: ArrowCircle,
  circle: ArrowCircle,
  outlineSquare: ArrowSquare,
  square: ArrowSquare,
  outlineDiamond: ArrowDiamond,
  diamond: ArrowDiamond,
};
export const LineContent: FC<LineContentProps> = ({
  style,
  color,
  boxSize,
  arrowStart = "none",
  arrowEnd = "none",
}) => {
  const getDashArray = () => {
    switch (style) {
      case "longDashes":
        return `${boxSize.height * 6}, ${boxSize.height}`;
      case "shortDashes":
        return `${boxSize.height * 3}, ${boxSize.height}`;
      case `dots`:
        return `${boxSize.height}, ${boxSize.height}`;
      default:
        return undefined;
    }
  };

  const arrowOffset = (type: ArrowType) => {
    if (type === "arrow") {
      return boxSize.height * 0.5;
    } else if (type === "bar") {
      return boxSize.height * 0.75;
    } else if (type === "triangle") {
      return boxSize.height * 2.75;
    } else if (["circle", "outlineCircle"].includes(type)) {
      return boxSize.height * 3.75;
    } else if (["square", "outlineSquare"].includes(type)) {
      return boxSize.height * 3.75;
    } else if (["diamond", "outlineDiamond"].includes(type)) {
      return boxSize.height * 3.25;
    }
    return 0;
  };
  return (
    <div
      style={{
        pointerEvents: "auto",
        width: boxSize.width,
        height: boxSize.height,
      }}
    >
      <svg
        style={{
          stroke: color,
          fill: color,
          width: "100%",
          height: "100%",
          minWidth: 1,
          minHeight: 1,
          overflow: "visible",
        }}
      >
        <path
          d={`M${arrowOffset(arrowStart)},${boxSize.height / 2}L${
            boxSize.width - arrowOffset(arrowEnd)
          },${boxSize.height / 2}`}
          pointerEvents="auto"
          strokeDasharray={getDashArray()}
          strokeLinecap="butt"
          strokeWidth={boxSize.height}
        />
        {arrowStart !== "none" &&
          React.createElement(arrow[arrowStart], {
            type: "start",
            weight: boxSize.height,
            width: boxSize.width,
            fillNone: [
              "outlineCircle",
              "outlineSquare",
              "outlineDiamond",
            ].includes(arrowStart),
          })}
        {arrowEnd !== "none" &&
          React.createElement(arrow[arrowEnd], {
            type: "end",
            weight: boxSize.height,
            width: boxSize.width,
            fillNone: [
              "outlineCircle",
              "outlineSquare",
              "outlineDiamond",
            ].includes(arrowEnd),
          })}
      </svg>
    </div>
  );
};
