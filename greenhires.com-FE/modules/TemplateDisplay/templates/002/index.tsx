import { ResumeData } from "@/interfaces/builder/resume";
import { ProfileSummary2 } from "../../sections/aboutme";
import { EducationSection2 } from "../../sections/educations/EducationSection2";
import { ExperienceSection2 } from "../../sections/experiences/ExperienceSection2";
import { ProfileSection2 } from "../../sections/profile";
import { SkillsSection2 } from "../../sections/skills";

const SWAPPABLE = ["education", "skills"];

export const Template2 = ({ data }: { data: ResumeData }) => {
  const orderedSection = data.metadata.section_order.filter((section) =>
    SWAPPABLE.includes(section)
  );
  return (
    <div className="w-full h-full flex flex-col ">
      <ProfileSection2 content={data.basics} />

      <div className="flex">
        <div className="flex-1 flex flex-col pr-8 gap-4">
          <ProfileSummary2 content={data.sections.aboutme} />

          <div className="flex gap-6">
            {orderedSection.map((section) => {
              if (section === "education") {
                return (
                  <div key={section} className="flex-1 flex flex-col">
                    <EducationSection2 content={data.sections.education} />
                  </div>
                );
              }

              if (section === "skills") {
                return (
                  <div key={section} className="flex-1 flex flex-col">
                    <SkillsSection2 content={data.sections.skills} />
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>

        <div className="flex-1 ">
          <ExperienceSection2 content={data.sections.experience} />
        </div>
      </div>
    </div>
  );
};
