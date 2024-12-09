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
import { ChangeLineCallback, LinePosition } from "../types";
import LineHandler from "./LineHandler";
import RotateHandle from "./RotateHandle";

interface LineControlProps {
  boxSize: BoxSize;
  position: Delta;
  scale?: number;
  rotate: number;
  locked: boolean;
  disabled: {
    rotate: boolean;
  };
  onChangeStart?: ChangeLineCallback;
  onRouteStart: (e: TouchEvent | MouseEvent) => void;
}

const LineControl: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<LineControlProps>
> = (
  { boxSize, disabled, position, rotate, locked, onChangeStart, onRouteStart },
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
    resizeDirection,
    isPageLocked,
    updateLineData,
  } = useEditor((state) => ({
    isGroup: state.selectedLayers[pageIndex].length > 1,
    imageEditor: state.imageEditor,
    isDragging: state.dragData.status,
    isRotating: state.rotateData.status,
    resizeDirection: state.resizeData.direction,
    frameScale: state.scale,
    selectState: state.selectData.status,
    isPageLocked: state.pages[pageIndex].layers.ROOT.data.locked,
    updateLineData: state.updateLineData,
  }));
  const handleStart = (e: MouseEvent | TouchEvent, position: LinePosition) => {
    onChangeStart && onChangeStart(e, position);
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
      {!isDragging &&
        !locked &&
        !selectState &&
        !isPageLocked &&
        !isRotating && (
          <Fragment>
            {!locked && (
              <Fragment>
                {(!updateLineData.status ||
                  updateLineData.linePosition === "start") && (
                  <div
                    style={{
                      left: 0,
                      top: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                    }}
                  >
                    <LineHandler
                      isActive={updateLineData.linePosition === "start"}
                      position={"start"}
                      onChange={handleStart}
                    />
                  </div>
                )}
                {(!updateLineData.status ||
                  updateLineData.linePosition === "end") && (
                  <div
                    style={{
                      left: "100%",
                      top: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                    }}
                  >
                    <LineHandler
                      isActive={updateLineData.linePosition === "end"}
                      position={"end"}
                      onChange={handleStart}
                    />
                  </div>
                )}
              </Fragment>
            )}
            {!locked &&
              !disabled.rotate &&
              !resizeDirection &&
              !updateLineData.status && (
                <RotateHandle rotate={rotate} onRotateStart={onRouteStart} />
              )}
          </Fragment>
        )}
    </div>
  );
};

export default forwardRef<HTMLDivElement, PropsWithChildren<LineControlProps>>(
  LineControl
);
