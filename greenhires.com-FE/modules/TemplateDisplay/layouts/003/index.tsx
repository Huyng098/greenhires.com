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
import { CustomSectionGroup } from "@/interfaces/builder/baseSection";
import { LinksSection } from "../sections/LinksSection";
import { AwardsSection } from "../../sections/AwardsSection";

const SWAPPABLE = [
  "education",
  "experience",
  "skills",
  "certifications",
  "awards",
  "languages",
  "references",
  "courses",
  "hobbies",
  "links",
];

export const Layout3 = ({ data }: { data: ResumeData }) => {
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
    <div className="w-full h-full flex flex-col px-3 pt-16 gap-4">
      <div
        style={getStyle(parsedCss, "section1")}
        className="flex flex-col gap-2 h-fit"
      >
        <ProfileSection content={data.basics} parsedCss={parsedCss} />
        <AboutMeSection content={data.sections.aboutme} parsedCss={parsedCss} />
      </div>
      <div
        style={getStyle(parsedCss, "section2")}
        className="flex flex-col gap-2 h-fit"
      >
        {orderedSection.map((section) => {
          if (section === "education") {
            return (
              <EducationSection
                key={section}
                content={data.sections.education}
                parsedCss={parsedCss}
              />
            );
          }
          if (section === "experience") {
            return (
              <ExperienceSection
                key={section}
                content={data.sections.experience}
                parsedCss={parsedCss}
              />
            );
          }
          if (section === "skills") {
            return (
              <SkillsSection
                key={section}
                content={data.sections.skills}
                parsedCss={parsedCss}
              />
            );
          }
          if (section === "certifications") {
            return (
              <CertificationsSection
                key={section}
                content={data.sections.certifications}
                parsedCss={parsedCss}
              />
            );
          }
          if (section === "courses") {
            return (
              <CoursesSection
                key={section}
                content={data.sections.courses}
                parsedCss={parsedCss}
              />
            );
          }
          if (section === "hobbies") {
            return (
              <HobbiesSection
                key={section}
                content={data.sections.hobbies}
                parsedCss={parsedCss}
              />
            );
          }
          if (section === "languages") {
            return (
              <LanguagesSection
                key={section}
                content={data.sections.languages}
                parsedCss={parsedCss}
              />
            );
          }
          if (section === "links") {
            return (
              <LinksSection
                key={section}
                content={data.sections.links}
                parsedCss={parsedCss}
              />
            );
          }
          if (section === "awards") {
            return (
              <AwardsSection
                key={section}
                content={data.sections.awards}
                parsedCss={parsedCss}
              />
            );
          }
          if (section === "references") {
            return (
              <ReferencesSection
                key={section}
                content={data.sections.references}
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
