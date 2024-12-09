import { ResumeData } from "@/interfaces/builder/resume";
import { ProfileSummary4 } from "../../sections/aboutme";
import { EducationSection4 } from "../../sections/educations";
import { ExperienceSection5 } from "../../sections/experiences";
import { ProfileSection4 } from "../../sections/profile";
import { SkillsSection4 } from "../../sections/skills/SkillsSection4";

const SWAPPABLE = ["education", "skills"];

export const Template4 = ({ data }: { data: ResumeData }) => {
  const orderedSection = data.metadata.section_order.filter((section) =>
    SWAPPABLE.includes(section)
  );
  return (
    <div className="w-full h-full flex flex-col">
      <ProfileSection4 content={data.basics} />

      <div className="w-full flex gap-2">
        <div className="w-80 flex flex-col gap-4 px-2">
          <ProfileSummary4 content={data.sections.aboutme} />
          {orderedSection.map((section) => {
            if (section === "education") {
              return (
                <EducationSection4
                  key={section}
                  content={data.sections.education}
                />
              );
            }

            if (section === "skills") {
              return (
                <SkillsSection4 key={section} content={data.sections.skills} />
              );
            }

            return null;
          })}
        </div>

        <div className="flex-1 flex flex-col pl-16 pt-10">
          <ExperienceSection5 content={data.sections.experience} />
        </div>
      </div>
    </div>
  );
};
