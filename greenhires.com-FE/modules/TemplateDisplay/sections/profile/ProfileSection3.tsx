import { Basics } from "@/interfaces/builder";
import Image from "next/image";

export const ProfileSection3 = ({ content }: { content?: Basics }) => {
  if (!content) return null;
  return (
    <div className="min-h-72 flex">
      <div className=" h-full w-60 relative">
        {content.picture !== "" && (
          <div className="absolute h-[215px] w-[215px] top-[10px] left-[2px]">
            <Image src={content.picture} alt="Profile Picture" fill />
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col px-10">
        <div className="flex-1 flex items-center">
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: `${content.firstname} ${content.lastname}`,
            }}
          />
        </div>
        {content.headline !== "" && content.headline !== "<p></p>" && (
          <div className="flex flex-col">
            <div className="w-20 h-2 bg-td-primary" />
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: content.headline,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
