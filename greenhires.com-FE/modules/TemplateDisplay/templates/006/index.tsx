import { ResumeData } from "@/interfaces/builder/resume";
import { ProfileSection6 } from "../../sections/profile";
import { ExperienceSection6 } from "../../sections/experiences";
import { EducationSection6 } from "../../sections/educations";
import { SkillsSection6 } from "../../sections/skills";

const SWAPPABLE = ["experience", "education"];

export const Template6 = ({ data }: { data: ResumeData }) => {
  const orderedSection = data.metadata.section_order.filter((section) =>
    SWAPPABLE.includes(section)
  );
  return (
    <div className="w-full h-full flex flex-col px-10">
      <ProfileSection6 content={data.basics} aboutme={data.sections.aboutme} />

      {orderedSection.map((section) => {
        if (section === "experience") {
          return <ExperienceSection6 content={data.sections.experience} />;
        }

        if (section === "education") {
          return <EducationSection6 content={data.sections.education} />;
        }

        return null;
      })}

      <div className="grid grid-cols-2">
        <SkillsSection6 content={data.sections.skills} />
      </div>
    </div>
  );
};
