"use client";

import {
  PAGE_HEIGHT,
  PAGE_PADDING_X,
  PAGE_PADDING_Y,
  PAGE_WIDTH,
} from "@/constants/general";
import { ResumeData } from "@/interfaces/builder/resume";
import { hex2rgb } from "@/lib/design-utils";
import { mockResumeData } from "@/modules/TemplateDisplay/mock-data";
import { getTemplate } from "@/modules/TemplateDisplay/templates";
import { getTemplatePadding } from "@/modules/TemplateDisplay/templates/template-padding";
import { forwardRef, useEffect, useMemo } from "react";

interface Props {
  resume_data: ResumeData;
}

export const PaginationLiveEdit = forwardRef<HTMLDivElement, Props>(
  ({ resume_data }, ref) => {
    const defaultMainColor = "#7CA655";
    const secondaryColor = "#FFD700";
    const tertiaryColor = "#FFD700";

    const {
      builder: Template,
      firstPageBg,
      secondPageBg,
      fixedPageNumber,
    } = useMemo(
      () =>
        getTemplate(
          resume_data.metadata.template,
          resume_data.metadata.variant
        ),
      [resume_data?.metadata?.template, resume_data?.metadata?.variant]
    );
    const { top, bottom, left, right } = getTemplatePadding(
      resume_data.metadata.template
    );
    useEffect(() => {
      if (typeof window === "undefined") return;

      const { r, g, b } = hex2rgb(defaultMainColor);
      document.documentElement.style.setProperty(
        "--color-primary",
        `${r} ${g} ${b}`
      );
    }, [resume_data.metadata.variant]);

    useEffect(() => {
      if (resume_data.basics.picture == "") return;
      if (typeof window === "undefined") return;
      document.documentElement.style.setProperty("--bg-page-1", firstPageBg);
      document.documentElement.style.setProperty("--bg-page-2", secondPageBg);
    }, [firstPageBg, secondPageBg]);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const { r, g, b } = hex2rgb(secondaryColor);
      document.documentElement.style.setProperty(
        "--color-secondary",
        `${r} ${g} ${b}`
      );
    }, [secondaryColor]);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const { r, g, b } = hex2rgb(secondaryColor);
      document.documentElement.style.setProperty(
        "--color-tertiary",
        `${r} ${g} ${b}`
      );
    }, [tertiaryColor]);

    return (
      <div
        className="absolute opacity-0 pointer-events-none"
        aria-hidden="true"
      >
        {fixedPageNumber ? (
          <div className="flex flex-col relative">
            <div ref={ref} className="overflow-auto">
              <Template data={resume_data} />
            </div>
          </div>
        ) : (
          <div className="flex-col relative">
            <div
              ref={ref}
              className="overflow-auto absolute invisible -z-10"
              style={{
                width: `${PAGE_WIDTH - (right + left)}px`,
                height: `${PAGE_HEIGHT - (top + bottom)}px`,
                columnFill: "auto",
                columnWidth: `${PAGE_WIDTH - (right + left)}px`,
                columnRule: "1px solid #000",
              }}
            >
              {/* <Template data={mockResumeData} /> */}
              <Template data={resume_data} />
            </div>
          </div>
        )}
      </div>
    );
  }
);
