import { ResumeData } from "@/interfaces/builder/resume";

import {
  ProfileSection,
  AboutMeSection,
  CertificationsSection,
  CoursesSection,
  EducationSection,
  ExperienceSection,
  HobbiesSection,
  LanguagesSection,
  ReferencesSection,
  SkillsSection,
  LayoutCustomSection,
} from "../sections";
import { getSectionOrder } from "@/lib/utils";
import { useMemo } from "react";
import { getStyle } from "..";
import { AwardsSection } from "../../sections/AwardsSection";
import { LinksSection } from "../sections/LinksSection";
import { CustomSectionGroup } from "@/interfaces/builder/baseSection";

const SWAPPABLE_1 = ["skills", "languages", "hobbies"];
const SWAPPABLE_2 = [
  "education",
  "experience",
  "certifications",
  "awards",
  "references",
  "courses",
  "links",
];

export const Layout2 = ({ data }: { data: ResumeData }) => {
  const parsedCss = useMemo(
    () => (data.css ? JSON.parse(data.css) : {}),
    [data.css]
  );

  const orderedSection1 = getSectionOrder(
    data.metadata.section_order,
    SWAPPABLE_1
  );

  const orderedSection2 = getSectionOrder(
    data.metadata.section_order,
    SWAPPABLE_2,
    true
  );

  const renderSection = (section: string) => {
    switch (section) {
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
      case "skills":
        return (
          <SkillsSection
            key={section}
            content={data.sections.skills}
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
      case "languages":
        return (
          <LanguagesSection
            key={section}
            content={data.sections.languages}
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
          <LinksSection content={data.sections.links} parsedCss={parsedCss} />
        );
    }
  };

  const renderCustomSection = (data: Record<string, CustomSectionGroup>) =>
    data &&
    Object.entries(data).map(([key, value]) => (
      <div className="flex flex-col gap-2" key={key}>
        <LayoutCustomSection content={value} />
      </div>
    ));

  return (
    <div className="w-full h-full flex px-2 pt-16 gap-3">
      <div className="w-1/3 flex flex-col gap-3 h-fit">
        <div style={getStyle(parsedCss, "section1")}>
          <ProfileSection content={data.basics} parsedCss={parsedCss} />
        </div>
        <div
          style={getStyle(parsedCss, "section3")}
          className="flex flex-col gap-2 h-fit"
        >
          {orderedSection1.map((section) => renderSection(section))}
        </div>
      </div>

      <div
        className="w-2/3 flex flex-col gap-2 p-2 h-fit"
        style={getStyle(parsedCss, "section2")}
      >
        <AboutMeSection content={data.sections.aboutme} parsedCss={parsedCss} />
        <div className="flex flex-col gap-2 h-fit">
          {orderedSection2.map((section) => renderSection(section))}
          {renderCustomSection(data.sections.custom)}
        </div>
      </div>
    </div>
  );
};
