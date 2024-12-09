import { Basics } from "@/interfaces/builder";
import { ResumeData } from "@/interfaces/builder/resume";
import Image from "next/image";

export const ProfileSection6 = ({
  content,
  aboutme,
}: {
  content: Basics;
  aboutme: ResumeData["sections"]["aboutme"];
}) => {
  return (
    <div className="min-h-60 flex gap-2 items-center">
      {content.picture !== "" && (
        <div className="relative h-40 w-40 rounded-full border-4 border-[#af2e18] overflow-hidden">
          <Image src={content.picture} alt="Profile Picture" fill />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: `${content.firstname} ${content.lastname}`,
          }}
        />
        <div className="flex w-full gap-2 items-center">
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: content.address,
            }}
          />
          {content.phone !== "" && content.phone !== "<p></p>" && (
            <div className="w-[1px] h-4 bg-[#af2e18]" />
          )}
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: content.phone,
            }}
          />
          {content.email !== "" && content.email !== "<p></p>" && (
            <div className="w-[1px] h-4 bg-[#af2e18]" />
          )}
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: content.email,
            }}
          />
        </div>

        <div>
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: aboutme.content,
            }}
          />
        </div>
      </div>
    </div>
  );
};
