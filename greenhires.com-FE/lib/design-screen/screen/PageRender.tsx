import { BoxSize, getTransformStyle } from "@lidojs/design-core";
import { forwardRef, ForwardRefRenderFunction, PropsWithChildren } from "react";

const PageRender: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<{ boxSize: BoxSize; scale: number }>
> = ({ boxSize, scale, children }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: boxSize.width,
        height: boxSize.height,
        position: "absolute",
        transformOrigin: "0px 0px",
        overflow: "hidden",
        transform: getTransformStyle({ scale }),
      }}
    >
      {children}
    </div>
  );
};
export default forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ boxSize: BoxSize; scale: number }>
>(PageRender);
