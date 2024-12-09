import { forwardRef, ForwardRefRenderFunction } from "react";
import PageProvider from "../layers/core/PageContext";
import PageElement from "../layers/core/PageElement";

export interface PageProps {
  pageIndex: number;
  isActive: boolean;
  width: number;
  height: number;
  scale: number;
}

const Page: ForwardRefRenderFunction<HTMLDivElement, PageProps> = (
  { pageIndex, width, height, scale, isActive },
  ref
) => {
  return (
    <PageProvider pageIndex={pageIndex}>
      <div
        ref={ref}
        style={{
          width: width * scale,
          height: height * scale,
          zIndex: 0,
          margin: 0,
          visibility: isActive ? "visible" : "hidden",
          opacity: isActive ? 1 : 0,
        }}
      >
        <div
          style={{
            width: width,
            height: height,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
            userSelect: "none",
            background: "white",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: width * scale,
              height: height * scale,
            }}
          >
            <PageElement />
          </div>
        </div>
      </div>
    </PageProvider>
  );
};

export default forwardRef<HTMLDivElement, PageProps>(Page);
