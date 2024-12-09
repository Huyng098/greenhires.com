"use client";
import { BoxSize, getTransformStyle } from "@lidojs/design-core";
import { Eye } from "@phosphor-icons/react";
import {
  forwardRef,
  ForwardRefRenderFunction,
  PropsWithChildren,
  useState,
} from "react";

const PageRenderPreview: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<{ boxSize: BoxSize; scale: number }>
> = ({ boxSize, scale, children }, ref) => {
  return (
    <>
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
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 ease-in-out z-10 bg-black bg-opacity-50">
          <Eye size={24} color="#ffffff" className="scale-[8]" />
        </div>
        {children}
      </div>
    </>
  );
};
export default forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ boxSize: BoxSize; scale: number }>
>(PageRenderPreview);
