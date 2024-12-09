import { SerializedPage } from "@lidojs/design-core";
import { getUsedFonts, GlobalStyle } from "@lidojs/design-layers";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { renderPages } from "../utils";
import PageRender from "./PageRender";

export interface FrameProps {
  width: number;
  height: number;
  data: SerializedPage[];
  zoomable?: boolean;
}

export const Frame: FC<FrameProps> = ({
  width,
  height,
  data,
  zoomable = false,
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement[]>([]);
  const fonts = getUsedFonts(data);
  const pages = useMemo(() => renderPages(data), [width, height, data]);

  if (!zoomable) {
    return (
      <div
        className="bg-backgroundColor-main"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <GlobalStyle fonts={fonts} />
        <div className="flex flex-col gap-8 ">
          {pages.map((page, idx) => (
            <div
              key={idx}
              data-page={idx + 1}
              style={{
                width: width,
                height: height,
                transition: "opacity .5s ease-in-out",
              }}
            >
              <PageRender
                ref={(el) => {
                  el ? (pageRef.current[idx] = el) : null;
                }}
                boxSize={{ width, height }}
                scale={1}
              >
                {page}
              </PageRender>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleZoomDesktop = (e: WheelEvent) => {
      if (e.ctrlKey) {
        const s = Math.exp(-e.deltaY / 600);
        const newScale = Math.min(Math.max(scale * s, 0.1), 5);
        setScale(newScale);
        e.preventDefault();
        e.stopPropagation();
      }
    };

    frameRef.current?.addEventListener("wheel", handleZoomDesktop, {
      passive: false,
    });
    return () => {
      frameRef.current?.removeEventListener("wheel", handleZoomDesktop);
    };
  }, [frameRef, scale]);

  return (
    <div
      ref={frameRef}
      className="relative flex h-full overflow-scroll"
      tabIndex={0}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          minWidth: "100%",
          minHeight: "100%",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexGrow: 1,
            touchAction: "pinch-zoom",
          }}
        >
          <div
            ref={pageContainerRef}
            className="max-[900px]:transition-transform max-[900px]:ease-linear max-[900px]:duration-250 max-[900px]:delay-0"
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "row",
              justifyContent: "center",
              margin: "auto",
            }}
          >
            <div
              className="max-[900px]:flex max-[900px]:ml-0]"
              style={{
                marginLeft: 56,
              }}
            >
              <GlobalStyle fonts={fonts} />
              <div className="flex flex-col gap-8 ">
                {pages.map((page, idx) => (
                  <div
                    key={idx}
                    data-page={idx + 1}
                    style={{
                      width: width,
                      height: height,
                      transition: "opacity .5s ease-in-out",
                    }}
                  >
                    <PageRender
                      ref={(el) => {
                        el ? (pageRef.current[idx] = el) : null;
                      }}
                      boxSize={{ width, height }}
                      scale={scale}
                    >
                      {page}
                    </PageRender>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
