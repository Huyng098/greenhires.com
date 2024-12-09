import { normalizeNumber } from '@lidojs/design-core';
import React, { FC } from 'react';

type Props = {
  type: 'start' | 'end';
  weight: number;
  width: number;
  fillNone: boolean;
};
const ArrowCircle: FC<Props> = ({ type, weight, width, fillNone }) => {
  const isStart = type === 'start';
  const offset = weight / 2;
  const size = weight * 3;
  const roundedValue = size / 2;
  const d = (4 * (Math.sqrt(2) - 1)) / 3;
  const clipValue = normalizeNumber(roundedValue * (1 - d));
  if (isStart) {
    return (
      <path
        d={`M${offset},${offset}C${offset},${
          clipValue - roundedValue + offset
        } ${offset + clipValue},-${weight} ${weight * 2},-${weight}C${
          size + offset - clipValue
        },-${weight} ${size + offset},${clipValue - roundedValue + offset} ${
          size + offset
        },${offset}C${size + offset},${weight * 2 - clipValue} ${
          size + offset - clipValue
        },${weight * 2} ${weight * 2},${weight * 2}C${offset + clipValue},${
          weight * 2
        } ${offset},${weight * 2 - clipValue} ${offset},${offset}`}
        fill={fillNone ? 'none' : 'inherit'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={weight}
      />
    );
  } else {
    return (
      <path
        d={`M${width - offset},${offset}C${width - offset},${
          roundedValue + offset - clipValue
        } ${width - offset - clipValue},${weight * 2} ${width - weight * 2},${
          weight * 2
        }C${width + clipValue - offset - size},${weight * 2} ${
          width - size - offset
        },${roundedValue + offset - clipValue} ${
          width - size - offset
        },${offset}C${width - size - offset},${
          clipValue - roundedValue + offset
        } ${width + clipValue - offset - size},-${weight} ${
          width - weight * 2
        },-${weight}C${width - clipValue - offset},-${weight} ${
          width - offset
        },${clipValue - roundedValue + offset} ${width - offset},${offset}`}
        fill={fillNone ? 'none' : 'inherit'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={weight}
      />
    );
  }
};

export default ArrowCircle;
