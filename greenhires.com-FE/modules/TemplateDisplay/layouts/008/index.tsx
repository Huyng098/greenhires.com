import { ResumeData } from "@/interfaces/builder/resume";

import {
  AboutMeSection,
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
import { LinksSection } from "../sections/LinksSection";
import { AwardsSection } from "../../sections/AwardsSection";
import { CustomSectionGroup } from "@/interfaces/builder/baseSection";

const SWAPPABLE = [
  "skills",
  "languages",
  "education",
  "experience",
  "certifications",
  "references",
  "courses",
  "hobbies",
  "links",
  "awards",
];

export const Layout8 = ({ data }: { data: ResumeData }) => {
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
    <div className="w-full h-full px-3 pt-16 gap-2 flex flex-col">
      <div
        className="flex flex-col gap-2 h-fit"
        style={getStyle(parsedCss, "section1")}
      >
        <div
          className="flex flex-col gap-2"
          style={getStyle(parsedCss, "basics")}
        >
          <FullNameSection content={data.basics} />
          <HeadlineSection content={data.basics} />
        </div>
        <AboutMeSection content={data.sections.aboutme} parsedCss={parsedCss} />
        <ContactSection content={data.basics} parsedCss={parsedCss} />
      </div>
      <div
        className="flex flex-col gap-2 h-fit"
        style={getStyle(parsedCss, "section2")}
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
            case "links":
              return (
                <LinksSection
                  key={section}
                  content={data.sections.links}
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
          }
        })}
        {renderCustomSection(data.sections.custom)}
      </div>
    </div>
  );
};
