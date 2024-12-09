import { ShapeType } from '@lidojs/design-core';
import {
  getArrowBottomPath,
  getArrowLeftPath,
  getArrowPath,
  getArrowPentagonPath,
  getArrowTopPath,
  getChevronPath,
} from './getArrowPath';
import { getCirclePath } from './getCirclePath';
import { getCrossPath } from './getCrossPath';
import {
  getHexagonHorizontalPath,
  getHexagonVerticalPath,
} from './getHexagonPath';
import { getOctagonPath } from './getOctagonPath';
import {
  getParallelogramPath,
  getParallelogramUpsideDownPath,
} from './getParallelogramPath';
import { getPentagonPath } from './getPentagonPath';
import { getRectanglePath } from './getRectanglePath';
import { getRhombusPath } from './getRhombusPath';
import {
  getTrapezoidPath,
  getTrapezoidUpsideDownPath,
} from './getTrapezoidPath';
import { getTrianglePath, getTriangleUpsideDownPath } from './getTrianglePath';

export const getShapePath = (
  shape: ShapeType,
  settings: { width: number; height: number; roundedCorners: number }
) => {
  switch (shape) {
    case 'circle':
      return getCirclePath(settings);
    case 'rectangle':
      return getRectanglePath(settings);
    case 'triangle':
      return getTrianglePath(settings);
    case 'triangleUpsideDown':
      return getTriangleUpsideDownPath(settings);
    case 'cross':
      return getCrossPath(settings);
    case 'parallelogram':
      return getParallelogramPath(settings);
    case 'parallelogramUpsideDown':
      return getParallelogramUpsideDownPath(settings);
    case 'trapezoid':
      return getTrapezoidPath(settings);
    case 'trapezoidUpsideDown':
      return getTrapezoidUpsideDownPath(settings);
    case 'arrowRight':
      return getArrowPath(settings);
    case 'arrowLeft':
      return getArrowLeftPath(settings);
    case 'arrowTop':
      return getArrowTopPath(settings);
    case 'arrowBottom':
      return getArrowBottomPath(settings);
    case 'rhombus':
      return getRhombusPath(settings);
    case 'chevron':
      return getChevronPath(settings);
    case 'arrowPentagon':
      return getArrowPentagonPath(settings);
    case 'pentagon':
      return getPentagonPath(settings);
    case 'hexagonVertical':
      return getHexagonVerticalPath(settings);
    case 'hexagonHorizontal':
      return getHexagonHorizontalPath(settings);
    case 'octagon':
      return getOctagonPath(settings);
  }
};
