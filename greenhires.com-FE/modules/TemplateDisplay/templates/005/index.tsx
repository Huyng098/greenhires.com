import { ProfileSection5 } from "../../sections/profile";
import { ProfileSummary } from "../../sections/aboutme";
import { ResumeData } from "@/interfaces/builder/resume";
import { EducationSection5 } from "../../sections/educations";
import { ReferencesSection5 } from "../../sections/references";
import { ExperienceSection5 } from "../../sections/experiences";
import { SkillsSection5 } from "../../sections/skills/SkillsSection5";

const SWAPPABLE_1 = ["education", "references"];
const SWAPPABLE_2 = ["experience", "skills"];

export const Template5 = ({ data }: { data: ResumeData }) => {
  const orderedSection1 = data.metadata.section_order.filter((section) =>
    SWAPPABLE_1.includes(section)
  );

  const orderedSection2 = data.metadata.section_order.filter((section) =>
    SWAPPABLE_2.includes(section)
  );

  return (
    <div className="w-full h-full flex flex-col px-10">
      <ProfileSection5 content={data.basics} />

      <div className="w-full flex gap-2">
        <div className="flex-1 flex flex-col gap-4">
          <ProfileSummary content={data.sections.aboutme} />
          {orderedSection1.map((section) => {
            if (section === "education") {
              return <EducationSection5 content={data.sections.education} />;
            }

            if (section === "references") {
              return <ReferencesSection5 content={data.sections.references} />;
            }

            return null;
          })}
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {orderedSection2.map((section) => {
            if (section === "experience") {
              return <ExperienceSection5 content={data.sections.experience} />;
            }

            if (section === "skills") {
              return <SkillsSection5 content={data.sections.skills} />;
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};
