import React, { FC } from 'react';

type Props = {
  type: 'start' | 'end';
  weight: number;
  width: number;
  fillNone: boolean;
};
const ArrowDiamond: FC<Props> = ({ type, weight, width, fillNone }) => {
  const isStart = type === 'start';
  const offset = weight / 2;
  const size = weight * 3;
  return (
    <path
      d={`M${isStart ? offset : width - offset},${offset}L${
        isStart ? weight * 2 : width - weight * 2
      },-${weight}L${
        isStart ? size + offset : width - size - offset
      },${offset}L${isStart ? weight * 2 : width - weight * 2},${weight * 2}Z`}
      fill={fillNone ? 'none' : 'inherit'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={weight}
    />
  );
};

export default ArrowDiamond;
