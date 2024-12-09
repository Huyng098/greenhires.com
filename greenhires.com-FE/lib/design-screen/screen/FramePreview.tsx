import { SerializedPage } from "@lidojs/design-core";
import { getUsedFonts, GlobalStyle } from "@lidojs/design-layers";
// @ts-ignore
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { FC, useMemo, useRef, useState } from "react";
import { renderPages } from "../utils";
import PageRender from "./PageRender";
import PageRenderPreview from "./PageRenderPreview";

export interface FrameProps {
  width: number;
  height: number;
  scale?: number;
  data: SerializedPage[];
}

export const FramePreview: FC<FrameProps> = ({
  width,
  height,
  scale,
  data,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const pageRef = useRef<HTMLDivElement[]>([]);
  const fonts = getUsedFonts(data);
  const pages = useMemo(() => renderPages(data), [width, height, data]);
  const page = pages[0];
  return (
    <>
      <GlobalStyle fonts={fonts} />
      <div
        key={0}
        data-page={0 + 1}
        className="hover:cursor-pointer"
        onClick={() => setOpen(!open)}
        style={{
          width: width * 0.125,
          height: height * 0.125,
          transition: "opacity .5s ease-in-out",
          transform: "scale(0.125)",
          transformOrigin: "0 0",
        }}
      >
        <PageRenderPreview
          ref={(el) => {
            el ? (pageRef.current[0] = el) : null;
          }}
          boxSize={{ width, height }}
          scale={scale || 1}
        >
          {page}
        </PageRenderPreview>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="z-[3000]" />
          <DialogContent className="z-[3001] flex flex-col gap-4 bg-opacity-0 w-fit px-0 max-w-max border-none overflow-y-auto max-h-screen py-10">
            {pages.map((page, idx) => (
              <div
                key={idx}
                data-page={idx + 1}
                style={{
                  minHeight: height,
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
                  scale={scale || 1}
                >
                  {page}
                </PageRender>
              </div>
            ))}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};
