import Image from "next/image";
import { ResumeData } from "@/interfaces/builder/resume";
import { ProfileSection13 } from "../../sections/profile";
import { ContactSection13 } from "../../sections/contact";
import { EducationSection13 } from "../../sections/educations";
import { SkillsSection13 } from "../../sections/skills";
import { ProfileSummary13 } from "../../sections/aboutme";
import { ExperienceSection13 } from "../../sections/experiences";
import { ReferencesSection13 } from "../../sections/references";
import { LanguagesSection13 } from "../../sections/language";

const SWAPPABLE = ["skills", "education", "languages", "references"];
export const Template13 = ({ data }: { data: ResumeData }) => {
  const orderedSection = data.metadata.section_order.filter((section) =>
    SWAPPABLE.includes(section)
  );

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex items-center">
        <div className="relative w-52 mr-20 aspect-square rounded-full overflow-hidden not-prose">
          <Image src={data.basics.picture} alt="Profile Picture" fill />
        </div>

        <div className="flex-1">
          <ProfileSection13 content={data.basics} />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <ContactSection13
            phone={data.basics.phone}
            email={data.basics.email}
            address={data.basics.address}
          />
          <ExperienceSection13 content={data.sections.experience} />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <ProfileSummary13 content={data.sections.aboutme} />
          {orderedSection.map((section) => {
            switch (section) {
              case "skills":
                return <SkillsSection13 content={data.sections.skills} />;
              case "education":
                return <EducationSection13 content={data.sections.education} />;
              case "languages":
                return <LanguagesSection13 content={data.sections.languages} />;
              case "references":
                return (
                  <ReferencesSection13 content={data.sections.references} />
                );
            }
          })}
        </div>
      </div>
    </div>
  );
};
