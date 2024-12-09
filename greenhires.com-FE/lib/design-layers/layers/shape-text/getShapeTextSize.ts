import { ShapeType } from "@lidojs/design-core";
import {
  getArrowBottomTextSize,
  getArrowLeftTextSize,
  getArrowTextSize,
  getArrowPentagonTextSize,
  getArrowTopTextSize,
  getChevronTextSize,
} from "./getArrowTextSize";
import { getCircleTextSize } from "./getCircleTextSize";
import { getCrossTextSize } from "./getCrossTextSize";
import {
  getHexagonHorizontalTextSize,
  getHexagonVerticalTextSize,
} from "./getHexagonTextSize";
import { getOctagonTextSize } from "./getOctagonTextSize";
import {
  getParallelogramTextSize,
  getParallelogramUpsideDownTextSize,
} from "./getParallelogramTextSize";
import { getPentagonTextSize } from "./getPentagonTextSize";
import { getRectangleTextSize } from "./getRectangleTextSize";
import { getRhombusTextSize } from "./getRhombusTextSize";
import {
  getTrapezoidTextSize,
  getTrapezoidUpsideDownTextSize,
} from "./getTrapezoidTextSize";
import {
  getTriangleTextSize,
  getTriangleUpsideDownTextSize,
} from "./getTriangleTextSize";

export const getShapeTextSize = (
  shape: ShapeType,
  settings: { width: number; height: number }
) => {
  console.log("shape", shape);
  switch (shape) {
    case "circle":
      return getCircleTextSize(settings);
    case "rectangle":
      return getRectangleTextSize(settings);
    case "triangle":
      return getTriangleTextSize(settings);
    case "triangleUpsideDown":
      return getTriangleUpsideDownTextSize(settings);
    case "cross":
      return getCrossTextSize(settings);
    case "parallelogram":
      return getParallelogramTextSize(settings);
    case "parallelogramUpsideDown":
      return getParallelogramUpsideDownTextSize(settings);
    case "trapezoid":
      return getTrapezoidTextSize(settings);
    case "trapezoidUpsideDown":
      return getTrapezoidUpsideDownTextSize(settings);
    case "arrowRight":
      return getArrowTextSize(settings);
    case "arrowLeft":
      return getArrowLeftTextSize(settings);
    case "arrowTop":
      return getArrowTopTextSize(settings);
    case "arrowBottom":
      return getArrowBottomTextSize(settings);
    case "rhombus":
      return getRhombusTextSize(settings);
    case "chevron":
      return getChevronTextSize(settings);
    case "arrowPentagon":
      return getArrowPentagonTextSize(settings);
    case "pentagon":
      return getPentagonTextSize(settings);
    case "hexagonVertical":
      return getHexagonVerticalTextSize(settings);
    case "hexagonHorizontal":
      return getHexagonHorizontalTextSize(settings);
    case "octagon":
      return getOctagonTextSize(settings);
    default:
      return {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      };
  }
};
