import { ProfileSection } from "../../sections/profile";
import { GridShortEducationSection } from "../../sections/educations/GridShortEducationSection";
import { ExperienceSection } from "../../sections/experiences";
import { ReferencesSection } from "../../sections/references";
import { JoinedSkillCircleSection } from "../../sections/skills";
import { ResumeData } from "@/interfaces/builder/resume";

const SWAPPABLE = ["experience", "references"];

export const Template8 = ({ data }: { data: ResumeData }) => {
  const orderedSection = data.metadata.section_order.filter((section) =>
    SWAPPABLE.includes(section)
  );
  return (
    <div className="w-full h-full flex flex-col px-10">
      <ProfileSection content={data.basics} />

      {data.basics.firstname !== "" && data.basics.firstname !== "<p></p>" && (
        <div className="min-h-[1px] w-full bg-black my-4" />
      )}

      <div className="flex gap-8">
        <div className="w-72">
          <JoinedSkillCircleSection content={data.sections.skills} />
        </div>

        <div className="flex-1 flex flex-col gap-8">
          {orderedSection.map((section) => {
            if (section === "experience") {
              return <ExperienceSection content={data.sections.experience} />;
            }

            if (section === "references") {
              return <ReferencesSection content={data.sections.references} />;
            }

            return null;
          })}
        </div>
      </div>

      <GridShortEducationSection content={data.sections.education} />
    </div>
  );
};
