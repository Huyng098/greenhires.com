import { ResumeData } from "@/interfaces/builder/resume";
import { ProfileSection7 } from "../../sections/profile";
import { ProfileSummary7 } from "../../sections/aboutme";
import { EducationSection7 } from "../../sections/educations";
import { SkillsSection7 } from "../../sections/skills";
import { ExperienceSection7 } from "../../sections/experiences";
import { ReferencesSection7 } from "../../sections/references";

const SWAPPABLE = ["education", "skills"];

export const Template7 = ({ data }: { data: ResumeData }) => {
  const orderedSection = data.metadata.section_order.filter((section) =>
    SWAPPABLE.includes(section)
  );
  console.log(orderedSection);
  return (
    <div className="w-full h-full flex flex-col px-10 gap-4">
      <ProfileSection7 content={data.basics} />
      <ProfileSummary7 content={data.sections.aboutme} />

      <div className="w-full flex">
        {orderedSection.length > 0 && (
          <div className=" p-2 flex flex-col gap-3 w-1/3">
            {orderedSection.map((section) => {
              if (section === "education") {
                return (
                  <EducationSection7
                    key={section}
                    content={data.sections.education}
                  />
                );
              }

              if (section === "skills") {
                return (
                  <SkillsSection7
                    key={section}
                    content={data.sections.skills}
                  />
                );
              }

              return null;
            })}
          </div>
        )}

        <div className="w-2/3">
          <ExperienceSection7 content={data.sections.experience} />
        </div>
      </div>

      <ReferencesSection7 content={data.sections.references} />
    </div>
  );
};
