import React, { FC } from "react";
import { LinePosition } from "../types";

export const HANDLER_CORNER_SIZE = 16;

interface LineHandlerProps {
  isActive?: boolean;
  position: LinePosition;
  onChange: (e: TouchEvent | MouseEvent, position: LinePosition) => void;
}

const LineHandler: FC<LineHandlerProps> = ({
  isActive = false,
  position,
  onChange,
}) => {
  const handleStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    onChange(e.nativeEvent, position);
  };
  return (
    <div
      style={{
        position: "absolute",
        width: 32,
        height: 32,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: HANDLER_CORNER_SIZE,
          height: HANDLER_CORNER_SIZE,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleStart(e);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          handleStart(e);
        }}
      >
        <div
          className="hover:bg-[#3d8eff]"
          style={{
            background: isActive ? "#3d8eff" : "white",
            width: 12,
            height: 12,
            position: "absolute",
            borderRadius: "50%",
            boxShadow:
              "0 0 4px 1px rgba(57,76,96,.15), 0 0 0 1px rgba(43,59,74,.3)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default LineHandler;
