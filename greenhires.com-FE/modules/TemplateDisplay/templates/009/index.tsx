import Image from "next/image";
import { ResumeData } from "@/interfaces/builder/resume";
import { ContactSection9 } from "../../sections/contact";
import { EducationSection9 } from "../../sections/educations";
import { SkillsSection9 } from "../../sections/skills";
import { ProfileSection9 } from "../../sections/profile";
import { ProfileSummary9 } from "../../sections/aboutme";
import { ExperienceSection9 } from "../../sections/experiences";
import { ReferencesSection9 } from "../../sections/references/ReferencesSection9";

const SWAPPABLE = ["experience", "references"];

export const Template9 = ({ data }: { data: ResumeData }) => {
  const orderedSection = data.metadata.section_order.filter((section) =>
    SWAPPABLE.includes(section)
  );
  return (
    <div className="w-full h-full flex flex-col pt-16 px-10">
      <div className="flex">
        {data.basics.picture !== "" && <div className="relative w-52 mr-20 aspect-square rounded-xl overflow-hidden not-prose">
          <Image src={data.basics.picture} alt="Profile Picture" fill />
        </div>}

        <div className="flex-1">
          <ProfileSection9 content={data.basics} />
        </div>
      </div>

      <div className="flex">
        <div className="w-72 flex flex-col gap-4">
          <ContactSection9
            phone={data.basics.phone}
            email={data.basics.email}
            address={data.basics.address}
          />

          <EducationSection9 content={data.sections.education} />
          <SkillsSection9 content={data.sections.skills} />
        </div>

        <div className="px-6 flex-1 flex flex-col gap-4">
          <ProfileSummary9 content={data.sections.aboutme} />
          <ExperienceSection9 content={data.sections.experience} />

          <ReferencesSection9 content={data.sections.references} />
        </div>
      </div>
    </div>
  );
};
