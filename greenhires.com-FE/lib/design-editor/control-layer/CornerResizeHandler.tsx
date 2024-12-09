"use client";
import React, { FC, useContext } from "react";
import { EditorContext } from "../editor/EditorContext";
import { CornerDirection, Direction } from "../types";

export const HANDLER_CORNER_SIZE = 16;

interface CornerResizeHandlerProps {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  isActive: boolean;
  direction: CornerDirection;
  rotate: number;
  onResizeStart: (e: TouchEvent | MouseEvent, direction: Direction) => void;
}

const CornerResizeHandler: FC<CornerResizeHandlerProps> = ({
  isActive,
  top,
  left,
  bottom,
  right,
  direction,
  rotate,
  onResizeStart,
}) => {
  const {
    config: { assetPath },
  } = useContext(EditorContext);
  const rd = {
    bottomLeft: 45,
    topLeft: 135,
    topRight: 225,
    bottomRight: 315,
  };
  const file = Math.round(((rotate + rd[direction] + 90) % 180) / 10);
  const handleResizeStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    onResizeStart(e.nativeEvent, direction);
  };
  return (
    <div
      style={{
        top,
        left,
        bottom,
        right,
        position: "absolute",
        width: 32,
        height: 32,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className={`hover-cursor-[url('${assetPath}/cursors/resize/${file}.png') 12 12, auto]`}
        style={{
          width: HANDLER_CORNER_SIZE,
          height: HANDLER_CORNER_SIZE,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: `url('${assetPath}/cursors/resize/${file}.png') 12 12, auto`,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleResizeStart(e);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          handleResizeStart(e);
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

export default CornerResizeHandler;
