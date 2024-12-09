import { ResumeData } from "@/interfaces/builder/resume";

import {
  AboutMeSection,
  AvatarSection,
  CertificationsSection,
  CoursesSection,
  EducationSection,
  ExperienceSection,
  HeadlineSection,
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
import { CustomSectionGroup } from "@/interfaces/builder/baseSection";
import { LinksSection } from "../sections/LinksSection";
import { AwardsSection } from "../../sections/AwardsSection";

const SWAPPABLE_1 = ["skills", "languages", "education", "references"];
const SWAPPABLE_2 = [
  "experience",
  "certifications",
  "awards",
  "courses",
  "hobbies",
  "links",
];

export const Layout5 = ({ data }: { data: ResumeData }) => {
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
    <div className="w-full h-full flex flex-col px-2 pt-16">
      <div className="flex">
        <div className="w-1/3 flex flex-col gap-2 p-2 h-fit">
          <div style={{ ...getStyle(parsedCss, "section1"), padding: "20px" }}>
            <AvatarSection
              src={data.basics.picture}
              height="12rem"
              width="12rem"
              parsedCss={parsedCss}
            />
          </div>
          <div
            className="flex flex-col gap-2 h-fit"
            style={getStyle(parsedCss, "section3")}
          >
            {orderedSection1.map((section) => {
              if (section === "skills") {
                return (
                  <SkillsSection
                    key={section}
                    content={data.sections.skills}
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
              if (section === "education") {
                return (
                  <EducationSection
                    key={section}
                    content={data.sections.education}
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
          </div>
        </div>

        <div className="w-2/3 flex flex-col gap-2 p-2">
          <div
            className="flex flex-col gap-2 h-fit"
            style={getStyle(parsedCss, "section2")}
          >
            <HeadlineSection content={data.basics} parsedCss={parsedCss} />
            <AboutMeSection
              content={data.sections.aboutme}
              parsedCss={parsedCss}
            />
          </div>
          <div
            className="flex flex-col gap-2 h-fit"
            style={getStyle(parsedCss, "section4")}
          >
            {orderedSection2.map((section) => {
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
            {renderCustomSection(data.sections.custom)}
          </div>
        </div>
      </div>
      <div style={getStyle(parsedCss, "section5")}>
        <ProfileSection content={data.basics} parsedCss={parsedCss} />
      </div>
    </div>
  );
};
