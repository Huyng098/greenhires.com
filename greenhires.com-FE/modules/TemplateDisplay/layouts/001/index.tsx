import { ResumeData } from "@/interfaces/builder/resume";
import { getSectionOrder } from "@/lib/utils";
import {
  AboutMeSection,
  AvatarSection,
  CertificationsSection,
  CoursesSection,
  EducationSection,
  ExperienceSection,
  HobbiesSection,
  LanguagesSection,
  LayoutCustomSection,
  ProfileSection,
  ReferencesSection,
  SkillsSection,
} from "../sections";
import { useMemo } from "react";
import { AwardsSection } from "../../sections/AwardsSection";
import { getStyle } from "..";
import { CustomSectionGroup } from "@/interfaces/builder/baseSection";
import { LinksSection } from "../sections/LinksSection";

const SWAPPABLE_1 = ["experience", "education", "certifications", "awards"];
const SWAPPABLE_2 = [
  "skills",
  "languages",
  "references",
  "courses",
  "hobbies",
  "links",
];

export const Layout1 = ({ data }: { data: ResumeData }) => {
  const orderedSection1 = useMemo(
    () => getSectionOrder(data.metadata.section_order, SWAPPABLE_1, true),
    [data.metadata.section_order]
  );

  const orderedSection2 = useMemo(
    () => getSectionOrder(data.metadata.section_order, SWAPPABLE_2),
    [data.metadata.section_order]
  );

  const parsedCss = useMemo(
    () => (data.css ? JSON.parse(data.css) : {}),
    [data.css]
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
    <div className="w-full h-full flex flex-col px-3 pt-16 gap-4">
      <div className="flex gap-4 h-fit" style={getStyle(parsedCss, "section1")}>
        <AvatarSection
          src={data.basics.picture}
          height="12rem"
          width="8rem"
          parsedCss={parsedCss}
        />
        <div className="flex-1 flex flex-col gap-2 h-fit">
          <ProfileSection content={data.basics} parsedCss={parsedCss} />
          <AboutMeSection
            content={data.sections.aboutme}
            parsedCss={parsedCss}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div
          className="w-2/3 flex flex-col p-2 gap-2 h-fit"
          style={getStyle(parsedCss, "section2")}
        >
          {orderedSection1.map((section) => renderSection(section))}
        </div>
        <div
          className="w-1/3 flex flex-col p-2 gap-2"
          style={getStyle(parsedCss, "section3")}
        >
          {orderedSection2.map((section) => renderSection(section))}
          {renderCustomSection(data.sections.custom)}
        </div>
      </div>
    </div>
  );
};
