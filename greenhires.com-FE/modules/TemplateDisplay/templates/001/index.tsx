import { ResumeData } from "@/interfaces/builder/resume";
import Image from "next/image";
import { ProfileSummary1 } from "../../sections/aboutme";
import { ContactSection1 } from "../../sections/contact";
import { EducationSection1 } from "../../sections/educations";
import { ExperienceSection1 } from "../../sections/experiences";
import { HobbiesSection1 } from "../../sections/hoobies";
import { ProfileSection1 } from "../../sections/profile";
import { SkillsSection1 } from "../../sections/skills";

const SWAPPABLE = ["education", "experience", "skills"];

export const Template1 = ({ data }: { data: ResumeData }) => {
  const orderedSection = data.metadata.section_order.filter((section) =>
    SWAPPABLE.includes(section)
  );

  return (
    <div className="w-full h-full flex px-3 pt-16">
      {/* Side content */}
      <div className="w-[260px] px-4 flex flex-col items-center gap-4">
        {data.basics.picture !== "" && (
          <div className="w-56 min-h-56 rounded-full p-2 bg-td-primary/70">
            <div className="relative h-full w-full rounded-full overflow-hidden">
              <Image src={data.basics.picture} alt="Profile Picture" fill />
            </div>
          </div>
        )}

        <div className="w-full">
          <ProfileSummary1 content={data.sections.aboutme} />
        </div>

        <ContactSection1
          phone={data.basics.phone}
          address={data.basics.address}
          email={data.basics.email}
        />

        <HobbiesSection1 content={data.sections.hobbies} />
      </div>

      {/* Main content */}
      <div className="px-6 flex-1 flex flex-col gap-4">
        <ProfileSection1 content={data.basics} />

        {orderedSection.map((section) => {
          if (section === "education") {
            return (
              <EducationSection1
                key={section}
                content={data.sections.education}
              />
            );
          }

          if (section === "experience") {
            return (
              <ExperienceSection1
                key={section}
                content={data.sections.experience}
              />
            );
          }

          if (section === "skills") {
            return (
              <SkillsSection1 key={section} content={data.sections.skills} />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
