"use client";
import { BoxSize, Delta, getTransformStyle } from "@lidojs/design-core";
import { useForwardedRef } from "@lidojs/design-utils";
import {
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  PropsWithChildren,
  useContext,
} from "react";
import { useEditor } from "../hooks";
import { PageContext } from "../layers/core/PageContext";
import { Direction, ResizeCallback } from "../types";
import CornerResizeHandler, {
  HANDLER_CORNER_SIZE,
} from "./CornerResizeHandler";
import ResizeHandler, { HANDLER_SIZE } from "./ResizeHandler";
import RotateHandle from "./RotateHandle";

interface ResizeBoxProps {
  boxSize: BoxSize;
  position: Delta;
  scale?: number;
  rotate: number;
  disabled: {
    vertical: boolean;
    horizontal: boolean;
    corners: boolean;
    rotate: boolean;
    scalable: boolean;
  };
  locked: boolean;
  onResizeStart?: ResizeCallback;
  onRouteStart: (e: TouchEvent | MouseEvent) => void;
}

const ControlBox: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<ResizeBoxProps>
> = (
  { boxSize, position, rotate, disabled, locked, onResizeStart, onRouteStart },
  ref
) => {
  const boxRef = useForwardedRef<HTMLDivElement>(ref);
  const { pageIndex } = useContext(PageContext);
  const {
    imageEditor,
    isRotating,
    isDragging,
    frameScale,
    selectState,
    isGroup,
    resizeDirection,
    isPageLocked,
  } = useEditor((state) => ({
    isGroup: state.selectedLayers[pageIndex].length > 1,
    imageEditor: state.imageEditor,
    isDragging: state.dragData.status,
    isRotating: state.rotateData.status,
    resizeDirection: state.resizeData.direction,
    frameScale: state.scale,
    selectState: state.selectData.status,
    isPageLocked: state.pages[pageIndex].layers.ROOT.data.locked,
  }));
  const handleResizeStart = (
    e: MouseEvent | TouchEvent,
    direction: Direction
  ) => {
    onResizeStart && onResizeStart(e, direction);
  };

  if (imageEditor) {
    return null;
  }

  return (
    <div
      ref={boxRef}
      style={{
        position: "absolute",
        transform: getTransformStyle({
          position: { x: position.x * frameScale, y: position.y * frameScale },
          rotate,
        }),
        width: boxSize.width * frameScale,
        height: boxSize.height * frameScale,
      }}
    >
      {!isDragging && !locked && !selectState && !isPageLocked && (
        <Fragment>
          {!disabled.corners && !isRotating && (
            <Fragment>
              {(!resizeDirection || resizeDirection === "topLeft") && (
                <CornerResizeHandler
                  direction={"topLeft"}
                  isActive={resizeDirection === "topLeft"}
                  left={-HANDLER_CORNER_SIZE}
                  rotate={rotate}
                  top={-HANDLER_CORNER_SIZE}
                  onResizeStart={handleResizeStart}
                />
              )}
              {(!resizeDirection || resizeDirection === "topRight") && (
                <CornerResizeHandler
                  direction={"topRight"}
                  isActive={resizeDirection === "topRight"}
                  right={-HANDLER_CORNER_SIZE}
                  rotate={rotate}
                  top={-HANDLER_CORNER_SIZE}
                  onResizeStart={handleResizeStart}
                />
              )}
              {(!resizeDirection || resizeDirection === "bottomLeft") && (
                <CornerResizeHandler
                  bottom={-HANDLER_CORNER_SIZE}
                  direction={"bottomLeft"}
                  isActive={resizeDirection === "bottomLeft"}
                  left={-HANDLER_CORNER_SIZE}
                  rotate={rotate}
                  onResizeStart={handleResizeStart}
                />
              )}
              {(!resizeDirection || resizeDirection === "bottomRight") && (
                <CornerResizeHandler
                  bottom={-HANDLER_CORNER_SIZE}
                  direction={"bottomRight"}
                  isActive={resizeDirection === "bottomRight"}
                  right={-HANDLER_CORNER_SIZE}
                  rotate={rotate}
                  onResizeStart={handleResizeStart}
                />
              )}
            </Fragment>
          )}
          {!isGroup && !isRotating && (
            <Fragment>
              {!disabled.vertical && (
                <Fragment>
                  {(!resizeDirection || resizeDirection === "top") && (
                    <ResizeHandler
                      boxSize={boxSize}
                      direction={"top"}
                      height={HANDLER_SIZE}
                      isActive={resizeDirection === "top"}
                      rotate={rotate}
                      top={-(HANDLER_SIZE / 2)}
                      width={"100%"}
                      onResizeStart={handleResizeStart}
                    />
                  )}
                  {(!resizeDirection || resizeDirection === "bottom") && (
                    <ResizeHandler
                      bottom={-(HANDLER_SIZE / 2)}
                      boxSize={boxSize}
                      direction={"bottom"}
                      height={HANDLER_SIZE}
                      isActive={resizeDirection === "bottom"}
                      rotate={rotate}
                      width={"100%"}
                      onResizeStart={handleResizeStart}
                    />
                  )}
                </Fragment>
              )}
              {!disabled.horizontal && !isRotating && (
                <Fragment>
                  {(!resizeDirection || resizeDirection === "left") && (
                    <ResizeHandler
                      boxSize={boxSize}
                      direction={"left"}
                      height={"100%"}
                      isActive={resizeDirection === "left"}
                      left={-(HANDLER_SIZE / 2)}
                      rotate={rotate}
                      width={HANDLER_SIZE}
                      onResizeStart={handleResizeStart}
                    />
                  )}
                  {(!resizeDirection || resizeDirection === "right") && (
                    <ResizeHandler
                      boxSize={boxSize}
                      direction={"right"}
                      height={"100%"}
                      isActive={resizeDirection === "right"}
                      right={-(HANDLER_SIZE / 2)}
                      rotate={rotate}
                      width={HANDLER_SIZE}
                      onResizeStart={handleResizeStart}
                    />
                  )}
                </Fragment>
              )}
            </Fragment>
          )}
          {!locked && !disabled.rotate && !resizeDirection && (
            <RotateHandle rotate={rotate} onRotateStart={onRouteStart} />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default forwardRef<HTMLDivElement, PropsWithChildren<ResizeBoxProps>>(
  ControlBox
);
