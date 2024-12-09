// @ts-ignore
import { ResumeData } from "@/interfaces/builder/resume";
import { templateList } from "@/modules/Template/templateList";
import Image from "next/image";
import { FC, useMemo } from "react";
export interface FrameProps {
  width: number;
  height: number;
  scale?: number;
  data: ResumeData;
  template: string;
}

export const SampleIframePreview: FC<FrameProps> = ({
  width,
  height,
  scale,
  data,
  template,
}) => {
  const url_image = useMemo(() => {
    const templateSample = templateList.find((t) => template === t.name);
    return templateSample?.previews[0];
  }, [template]);
  return (
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
      <Image
        src={url_image || "/images/templates/1.png"}
        width={width}
        height={height}
        alt="template"
      />
    </div>
  );
};
