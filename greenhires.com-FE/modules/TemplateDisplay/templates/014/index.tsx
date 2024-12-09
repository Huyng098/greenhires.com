import Image from "next/image";
import { ResumeData } from "@/interfaces/builder/resume";
import { ProfileSection14 } from "../../sections/profile";
import { ContactSection14 } from "../../sections/contact";
import { EducationSection14 } from "../../sections/educations";
import { SkillsSection14 } from "../../sections/skills";
import { ProfileSummary14 } from "../../sections/aboutme";
import { ExperienceSection14 } from "../../sections/experiences";
import { ReferencesSection14 } from "../../sections/references";
import { LanguagesSection14 } from "../../sections/language";

const SWAPPABLE = ["skills", "education", "languages", "references"];
export const Template14 = ({ data }: { data: ResumeData }) => {
  const orderedSection = data.metadata.section_order.filter((section) =>
    SWAPPABLE.includes(section)
  );

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex items-center">
        <div className="relative w-52 mr-20 aspect-square rounded-full overflow-hidden not-prose">
          {data.basics.picture !== "" && (
            <Image src={data.basics.picture} alt="Profile Picture" fill />
          )}
        </div>

        <div className="flex-1">
          <ProfileSection14 content={data.basics} />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <ContactSection14
            phone={data.basics.phone}
            email={data.basics.email}
            address={data.basics.address}
          />
          <ExperienceSection14 content={data.sections.experience} />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <ProfileSummary14 content={data.sections.aboutme} />
          {orderedSection.map((section) => {
            switch (section) {
              case "skills":
                return <SkillsSection14 content={data.sections.skills} />;
              case "education":
                return <EducationSection14 content={data.sections.education} />;
              case "languages":
                return <LanguagesSection14 content={data.sections.languages} />;
              case "references":
                return (
                  <ReferencesSection14 content={data.sections.references} />
                );
            }
          })}
        </div>
      </div>
    </div>
  );
};
