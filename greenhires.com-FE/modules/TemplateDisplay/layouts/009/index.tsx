import { ResumeData } from "@/interfaces/builder/resume";

import {
  AboutMeSection,
  AvatarSection,
  CertificationsSection,
  ContactSection,
  CoursesSection,
  EducationSection,
  ExperienceSection,
  HobbiesSection,
  LanguagesSection,
  ReferencesSection,
  SkillsSection,
  FullNameSection,
  HeadlineSection,
  LayoutCustomSection,
} from "../sections";
import { getSectionOrder } from "@/lib/utils";
import { useMemo } from "react";
import { getStyle } from "..";
import { AwardsSection } from "../../sections/AwardsSection";
import { LinksSection } from "../sections/LinksSection";
import { CustomSectionGroup } from "@/interfaces/builder/baseSection";

const SWAPPABLE_1 = ["skills", "languages", "education"];
const SWAPPABLE_2 = [
  "experience",
  "certifications",
  "courses",
  "hobbies",
  "references",
  "awards",
  "links",
];

export const Layout9 = ({ data }: { data: ResumeData }) => {
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
    <div className="w-full h-full flex flex-col px-2 pt-16 gap-4">
      <div
        className="w-full flex justify-center"
        style={getStyle(parsedCss, "section1")}
      >
        <FullNameSection content={data.basics} />
      </div>

      <div className="flex gap-3 h-fit">
        <div style={getStyle(parsedCss, "section2")} className="max-w-60">
          <AboutMeSection
            content={data.sections.aboutme}
            parsedCss={parsedCss}
          />
        </div>

        <div
          className="p-2 flex flex-col gap-2 h-fit max-w-60"
          style={getStyle(parsedCss, "section3")}
        >
          <AvatarSection
            src={data.basics.picture}
            height="12rem"
            parsedCss={parsedCss}
            width="8rem"
          />
          <HeadlineSection content={data.basics} />
          <ContactSection content={data.basics} />
        </div>

        <div
          className="p-2 flex flex-col gap-2 h-fit"
          style={getStyle(parsedCss, "section4")}
        >
          {orderedSection1.map((section) => {
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
                  <div className="max-w-60">
                    <EducationSection
                      key={section}
                      content={data.sections.education}
                      parsedCss={parsedCss}
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>

      <div
        className="flex flex-col gap-2 h-fit"
        style={getStyle(parsedCss, "section5")}
      >
        {orderedSection2.map((section) => {
          switch (section) {
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
                  parsedCss={parsedCss}
                  key={section}
                  content={data.sections.certifications}
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
            case "references":
              return (
                <ReferencesSection
                  key={section}
                  content={data.sections.references}
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
  );
};
