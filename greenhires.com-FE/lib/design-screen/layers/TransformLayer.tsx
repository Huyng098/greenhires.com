import { getTransformStyle, LayerComponentProps } from "@lidojs/design-core";
import { forwardRef, ForwardRefRenderFunction, PropsWithChildren } from "react";

const TransformLayer: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<LayerComponentProps>
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
  PropsWithChildren<LayerComponentProps>
>(TransformLayer);
