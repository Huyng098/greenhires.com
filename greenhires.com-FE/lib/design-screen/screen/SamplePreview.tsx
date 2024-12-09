import { SerializedPage } from "@lidojs/design-core";
import { getUsedFonts, GlobalStyle } from "@lidojs/design-layers";
// @ts-ignore
import { FC, useMemo, useRef } from "react";
import { renderPages } from "../utils";
import PageRenderSamplePreview from "./PageRenderSamplePreview";

export interface FrameProps {
  width: number;
  height: number;
  scale?: number;
  data: SerializedPage[];
}

export const SamplePreview: FC<FrameProps> = ({
  width,
  height,
  scale,
  data,
}) => {
  const pageRef = useRef<HTMLDivElement[]>([]);
  const fonts = getUsedFonts(data);
  const pages = useMemo(() => renderPages(data), [width, height, data]);
  // const page = pages[0];

  return (
    <>
      <GlobalStyle fonts={fonts} />
      <div
        key={0}
        data-page={0 + 1}
        className="hover:cursor-pointer"
        style={{
          width: width * (scale || 1),
          height: height * (scale || 1),
          transition: "opacity .5s ease-in-out",
          transformOrigin: "0 0",
        }}
      >
        <PageRenderSamplePreview
          ref={(el) => {
            el ? (pageRef.current[0] = el) : null;
          }}
          boxSize={{ width, height }}
          scale={scale || 1}
        >
          {/* {page} */}
        </PageRenderSamplePreview>
      </div>
    </>
  );
};
