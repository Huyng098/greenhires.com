import React, { FC } from "react";

const Line: FC = () => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x2="24"
        y1="50%"
        y2="50%"
        stroke="currentColor"
        strokeWidth="2"
      ></line>
    </svg>
  );
};

export default Line;