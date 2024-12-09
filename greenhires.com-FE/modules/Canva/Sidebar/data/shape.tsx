import ArrowBottomIcon from "@duyank/icons/shape/ArrowBottom";
import ArrowLeftIcon from "@duyank/icons/shape/ArrowLeft";
import ArrowPentagonIcon from "@duyank/icons/shape/ArrowPentagon";
import ArrowRightIcon from "@duyank/icons/shape/ArrowRight";
import ArrowTopIcon from "@duyank/icons/shape/ArrowTop";
import ChevronIcon from "@duyank/icons/shape/Chevron";
import CircleIcon from "@duyank/icons/shape/Circle";
import CrossIcon from "@duyank/icons/shape/Cross";
import HexagonIcon from "@duyank/icons/shape/Hexagon";
import OctagonIcon from "@duyank/icons/shape/Octagon";
import ParallelogramIcon from "@duyank/icons/shape/Parallelogram";
import PentagonIcon from "@duyank/icons/shape/Pentagon";
import RectangleIcon from "@duyank/icons/shape/Rectangle";
import RhombusIcon from "@duyank/icons/shape/Rhombus";
import TrapezoidIcon from "@duyank/icons/shape/Trapezoid";
import TriangleIcon from "@duyank/icons/shape/Triangle";
import { ShapeType } from "@lidojs/design-core";
import { CSSProperties, FC, PropsWithChildren, ReactElement } from "react";

export type Shape = {
  type: ShapeType;
  width: number;
  height: number;
  icon: ReactElement;
};

const IconBox: FC<PropsWithChildren<{ extraCss?: CSSProperties }>> = ({
  children,
  extraCss = {},
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        ...extraCss,
      }}
    >
      {children}
    </div>
  );
};
export const shapes: Shape[] = [
  {
    type: "rectangle",
    width: 64,
    height: 64,
    icon: (
      <IconBox>
        <RectangleIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "circle",
    width: 64,
    height: 64,
    icon: (
      <IconBox>
        <CircleIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "triangle",
    width: 64,
    height: 56,
    icon: (
      <IconBox>
        <TriangleIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "triangleUpsideDown",
    width: 64,
    height: 56,
    icon: (
      <IconBox extraCss={{ transform: "rotate(180deg)" }}>
        <TriangleIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "rhombus",
    width: 64,
    height: 64,
    icon: (
      <IconBox>
        <RhombusIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "arrowRight",
    width: 64,
    height: 64,
    icon: (
      <IconBox>
        <ArrowRightIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "arrowLeft",
    width: 64,
    height: 64,
    icon: (
      <IconBox>
        <ArrowLeftIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "arrowTop",
    width: 64,
    height: 64,
    icon: (
      <IconBox>
        <ArrowTopIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "arrowBottom",
    width: 64,
    height: 64,
    icon: (
      <IconBox>
        <ArrowBottomIcon
          height={"100%"}
          width={"100%"}
          className="text-white"
        />
      </IconBox>
    ),
  },
  {
    type: "arrowPentagon",
    width: 64,
    height: 32,
    icon: (
      <IconBox>
        <ArrowPentagonIcon
          height={"100%"}
          width={"100%"}
          className="text-white"
        />
      </IconBox>
    ),
  },
  {
    type: "chevron",
    width: 64,
    height: 32,
    icon: (
      <IconBox>
        <ChevronIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "cross",
    width: 64,
    height: 64,
    icon: (
      <IconBox>
        <CrossIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "parallelogram",
    width: 64,
    height: 48,
    icon: (
      <IconBox>
        <ParallelogramIcon
          height={"100%"}
          width={"100%"}
          className="text-white"
        />
      </IconBox>
    ),
  },
  {
    type: "parallelogramUpsideDown",
    width: 64,
    height: 48,
    icon: (
      <IconBox extraCss={{ transform: "scaleY(-1)" }}>
        <ParallelogramIcon
          height={"100%"}
          width={"100%"}
          className="text-white"
        />
      </IconBox>
    ),
  },
  {
    type: "trapezoid",
    width: 64,
    height: 48,
    icon: (
      <IconBox>
        <TrapezoidIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "trapezoidUpsideDown",
    width: 64,
    height: 48,
    icon: (
      <IconBox extraCss={{ transform: "rotate(180deg)" }}>
        <TrapezoidIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "pentagon",
    width: 64,
    height: 64,
    icon: (
      <IconBox>
        <PentagonIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "hexagonVertical",
    width: 55,
    height: 64,
    icon: (
      <IconBox extraCss={{ transform: "rotate(90deg)" }}>
        <HexagonIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "hexagonHorizontal",
    width: 64,
    height: 55,
    icon: (
      <IconBox>
        <HexagonIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
  {
    type: "octagon",
    width: 64,
    height: 64,
    icon: (
      <IconBox>
        <OctagonIcon height={"100%"} width={"100%"} className="text-white" />
      </IconBox>
    ),
  },
];
