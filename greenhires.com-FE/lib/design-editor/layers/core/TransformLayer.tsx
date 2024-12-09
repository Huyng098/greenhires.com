import { BoxSize, Delta, getTransformStyle } from "@lidojs/design-core";
import { forwardRef, ForwardRefRenderFunction, PropsWithChildren } from "react";

interface TransformLayerProps {
  boxSize: BoxSize;
  rotate: number;
  position: Delta;
  transparency?: number;
}

const TransformLayer: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<TransformLayerProps>
> = ({ boxSize, rotate, position, transparency, children }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        touchAction: "pan-x pan-y pinch-zoom",
        pointerEvents: "auto",
        position: "absolute",
        width: boxSize.width,
        height: boxSize.height,
        transform: getTransformStyle({ position, rotate }),
        opacity: transparency,
      }}
    >
      {children}
    </div>
  );
};

export default forwardRef<
  HTMLDivElement,
  PropsWithChildren<TransformLayerProps>
>(TransformLayer);
