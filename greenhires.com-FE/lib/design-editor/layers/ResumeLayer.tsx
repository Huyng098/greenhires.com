import { useResumeStore } from "@/stores/resume";
import { LayerComponentProps } from "@lidojs/design-core";
import { PropsWithChildren, useEffect, useRef } from "react";
import { LayerComponent } from "../types";

export interface ResumeLayerProps extends LayerComponentProps {
  pageNumber: number;
}
const ResumeLayer: LayerComponent<PropsWithChildren<ResumeLayerProps>> = ({
  pageNumber,
}) => {
  const pages = useResumeStore()((state) => state.pages);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && pages[pageNumber]) {
      containerRef.current.innerHTML = "";
      const clone = pages[pageNumber].cloneNode(true) as HTMLDivElement;
      Array.from(clone.attributes).forEach((attr) => {
        containerRef.current!.setAttribute(attr.name, attr.value);
      });
      while (clone.firstChild) {
        containerRef.current.appendChild(clone.firstChild);
      }
    }
  }, [pages, pageNumber]);

  if (pages.length === 0) return null;

  return <div ref={containerRef} />;
};

ResumeLayer.info = {
  name: "Resume",
  type: "Resume",
};

export default ResumeLayer;
