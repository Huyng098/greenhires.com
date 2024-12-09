import React, { FC } from 'react';

type Props = {
  type: 'start' | 'end';
  weight: number;
  width: number;
  fillNone: boolean;
};
const ArrowSquare: FC<Props> = ({ type, weight, width, fillNone }) => {
  const isStart = type === 'start';
  const offset = weight / 2;
  const size = weight * 3;
  return (
    <path
      d={`M${isStart ? offset : width - offset},-${weight}L${
        isStart ? size + offset : width - size - offset
      },-${weight}L${isStart ? size + offset : width - size - offset},${
        weight * 2
      }L${isStart ? offset : width - offset},${weight * 2}Z`}
      fill={fillNone ? 'none' : 'inherit'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={weight}
    ></path>
  );
};

export default ArrowSquare;
