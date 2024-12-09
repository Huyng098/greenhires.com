import { ResumeData } from "@/interfaces/builder/resume";
import { ProfileSummary3 } from "../../sections/aboutme";
import { ContactSection3 } from "../../sections/contact";
import { EducationSection3 } from "../../sections/educations";
import { ExperienceSection3 } from "../../sections/experiences/ExperienceSection3";
import { ProfileSection3 } from "../../sections/profile";
import { SkillsSection3 } from "../../sections/skills";

const SWAPPABLE = ["education", "skills"];

export const Template3 = ({ data }: { data: ResumeData }) => {
  const orderedSection = data.metadata.section_order.filter((section) =>
    SWAPPABLE.includes(section)
  );
  return (
    <div className="w-full h-full flex flex-col">
      <ProfileSection3 content={data.basics} />

      <div className="flex flex-1 px-14 py-8">
        <div className="w-60 flex flex-col gap-4">
          <ProfileSummary3 content={data.sections.aboutme} />

          {orderedSection.map((section) => {
            if (section === "education") {
              return (
                <EducationSection3
                  key={section}
                  content={data.sections.education}
                />
              );
            }

            if (section === "skills") {
              return (
                <SkillsSection3 key={section} content={data.sections.skills} />
              );
            }

            return null;
          })}

          <ContactSection3
            phone={data.basics.phone}
            address={data.basics.address}
            email={data.basics.email}
          />
        </div>

        <div className="flex-1 pl-4">
          <ExperienceSection3 content={data.sections.experience} />
        </div>
      </div>
    </div>
  );
};
