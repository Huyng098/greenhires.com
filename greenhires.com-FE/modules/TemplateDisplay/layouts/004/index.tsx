import { ResumeData } from "@/interfaces/builder/resume";

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
import { getSectionOrder } from "@/lib/utils";
import { useMemo } from "react";
import { getStyle } from "..";
import { LinksSection } from "../sections/LinksSection";
import { CustomSectionGroup } from "@/interfaces/builder/baseSection";
import { AwardsSection } from "../../sections/AwardsSection";

const SWAPPABLE_1 = ["skills", "languages"];

const SWAPPABLE_2 = [
  "education",
  "experience",
  "skills",
  "certifications",
  "references",
  "awards",
  "courses",
  "hobbies",
  "links",
];

export const Layout4 = ({ data }: { data: ResumeData }) => {
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
        <div className="flex-1 flex flex-col gap-2">
          <ProfileSection content={data.basics} parsedCss={parsedCss} />
          <AboutMeSection
            content={data.sections.aboutme}
            parsedCss={parsedCss}
          />
        </div>
        <AvatarSection
          src={data.basics.picture}
          height="12rem"
          width="12rem"
          parsedCss={parsedCss}
        />
      </div>

      <div
        className="flex p-2 gap-2 h-fit"
        style={getStyle(parsedCss, "section2")}
      >
        {orderedSection1.map((section) => {
          if (section === "skills") {
            return (
              <div key={section} className="flex-1">
                <SkillsSection
                  content={data.sections.skills}
                  parsedCss={parsedCss}
                />
              </div>
            );
          }
          if (section === "languages") {
            return (
              <div key={section} className="flex-1">
                <LanguagesSection
                  content={data.sections.languages}
                  parsedCss={parsedCss}
                />
              </div>
            );
          }
        })}
      </div>

      <div
        className="flex flex-col gap-2 h-fit"
        style={getStyle(parsedCss, "section3")}
      >
        {orderedSection2.map((section) => {
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

          if (section === "certifications") {
            return (
              <CertificationsSection
                key={section}
                content={data.sections.certifications}
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
          if (section === "awards") {
            return (
              <AwardsSection
                key={section}
                content={data.sections.awards}
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
        })}
      </div>
      {renderCustomSection(data.sections.custom)}
    </div>
  );
};
