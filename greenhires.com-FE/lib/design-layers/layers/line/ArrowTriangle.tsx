import React, { FC } from 'react';

type Props = {
  type: 'start' | 'end';
  weight: number;
  width: number;
  fillNone: boolean;
};
const ArrowTriangle: FC<Props> = ({ type, weight, width }) => {
  const isStart = type === 'start';

  return (
    <path
      d={`M${isStart ? weight * 2.5 : width - weight * 2.5},-${weight}L${
        isStart ? weight / 2 : width - weight / 2
      },${weight / 2}L${isStart ? weight * 2.5 : width - weight * 2.5},${
        weight * 2
      }Z`}
      fill="inherit"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={weight}
    />
  );
};

export default ArrowTriangle;
