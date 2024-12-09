"use client";
import CustomStyle from "@/components/CustomStyle";
import { LAYOUT_SECTIONS } from "@/modules/Template/layoutList";
import { useResumeStore } from "@/stores/resume";
import { Typography } from "@mui/material";
import Image from "next/image";
import React, { FC } from "react";

const LayoutSectionStyle: FC = () => {
  const layout = useResumeStore()((state) => state.resume.resume_data);
  const setValue = useResumeStore()((state) => state.setResume);

  const renderSection = () => {
    const layoutProps = LAYOUT_SECTIONS[layout?.metadata?.template];
    const sections = Array.from(
      {
        length: layoutProps?.numOfSection || 0,
      },
      (_, index) => (
        <div key={index} className="m-2">
          <Typography>Section {index + 1}</Typography>
          <div className="flex gap-2 items-center">
            <Image
              src={`${layoutProps.imagePath}section-${index + 1}.png`}
              alt={`section${index + 1}`}
              width={158}
              height={224}
            />
            <div className="self-center">
              <CustomStyle
                identifier={`section${index + 1}`}
                setValue={setValue}
              />
            </div>
          </div>
        </div>
      )
    );
    return sections;
  };

  return (
    <div className="m-3">
      <Typography fontWeight="500">Layout Section Style</Typography>
      <div className="flex flex-col items-center">{renderSection()}</div>
    </div>
  );
};

export default LayoutSectionStyle;
