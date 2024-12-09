import { ResumeData } from "@/interfaces/builder/resume";

import {
  AboutMeSection,
  AvatarSection,
  CertificationsSection,
  ContactSection,
  CoursesSection,
  EducationSection,
  ExperienceSection,
  FullNameSection,
  HeadlineSection,
  HobbiesSection,
  LanguagesSection,
  LayoutCustomSection,
  ReferencesSection,
  SkillsSection,
} from "../sections";
import { getSectionOrder } from "@/lib/utils";
import { useMemo } from "react";
import { getStyle } from "..";
import { CustomSectionGroup } from "@/interfaces/builder/baseSection";
import { AwardsSection } from "../../sections/AwardsSection";
import { LinksSection } from "../sections/LinksSection";

const SWAPPABLE = [
  "skills",
  "languages",
  "education",
  "experience",
  "certifications",
  "references",
  "courses",
  "hobbies",
  "awards",
  "links",
];

export const Layout7 = ({ data }: { data: ResumeData }) => {
  const parsedCss = useMemo(
    () => (data.css ? JSON.parse(data.css) : {}),
    [data.css]
  );
  const orderedSection = getSectionOrder(
    data.metadata.section_order,
    SWAPPABLE,
    true
  );

  const renderCustomSection = (data: Record<string, CustomSectionGroup>) =>
    data &&
    Object.entries(data).map(([key, value]) => (
      <div className="flex flex-col gap-2" key={key}>
        <LayoutCustomSection content={value} />
      </div>
    ));

  return (
    <div className="w-full h-full px-3 pt-16 gap-4 flex">
      <div
        className="w-1/3 flex flex-col gap-2 h-fit"
        style={getStyle(parsedCss, "section1")}
      >
        <AvatarSection
          src={data.basics.picture}
          height="12rem"
          width="12rem"
          parsedCss={parsedCss}
        />
        <AboutMeSection content={data.sections.aboutme} parsedCss={parsedCss} />
        <ContactSection content={data.basics} parsedCss={parsedCss} />
      </div>

      <div className="w-2/3 flex flex-col gap-2 h-fit">
        <div style={getStyle(parsedCss, "section2")}>
          <div
            className="flex flex-col gap-2 h-fit"
            style={getStyle(parsedCss, "basics")}
          >
            <FullNameSection content={data.basics} />
            <HeadlineSection content={data.basics} />
          </div>
        </div>
        <div
          className="flex flex-col gap-2 h-fit"
          style={getStyle(parsedCss, "section3")}
        >
          {orderedSection.map((section) => {
            switch (section) {
              case "skills":
                return (
                  <SkillsSection
                    key={section}
                    content={data.sections.skills}
                    parsedCss={parsedCss}
                  />
                );
              case "languages":
                return (
                  <LanguagesSection
                    key={section}
                    content={data.sections.languages}
                    parsedCss={parsedCss}
                  />
                );
              case "education":
                return (
                  <EducationSection
                    key={section}
                    content={data.sections.education}
                    parsedCss={parsedCss}
                  />
                );
              case "experience":
                return (
                  <ExperienceSection
                    key={section}
                    content={data.sections.experience}
                    parsedCss={parsedCss}
                  />
                );
              case "certifications":
                return (
                  <CertificationsSection
                    key={section}
                    content={data.sections.certifications}
                    parsedCss={parsedCss}
                  />
                );
              case "references":
                return (
                  <ReferencesSection
                    key={section}
                    content={data.sections.references}
                    parsedCss={parsedCss}
                  />
                );
              case "courses":
                return (
                  <CoursesSection
                    key={section}
                    content={data.sections.courses}
                    parsedCss={parsedCss}
                  />
                );
              case "hobbies":
                return (
                  <HobbiesSection
                    key={section}
                    content={data.sections.hobbies}
                    parsedCss={parsedCss}
                  />
                );
              case "awards":
                return (
                  <AwardsSection
                    key={section}
                    content={data.sections.awards}
                    parsedCss={parsedCss}
                  />
                );
              case "links":
                return (
                  <LinksSection
                    key={section}
                    content={data.sections.links}
                    parsedCss={parsedCss}
                  />
                );
            }
          })}
          {renderCustomSection(data.sections.custom)}
        </div>
      </div>
    </div>
  );
};
