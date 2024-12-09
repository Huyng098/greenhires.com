import { Basics } from "@/interfaces/builder";
import { EnvelopeOpen, MapTrifold, Phone } from "@phosphor-icons/react";
import Image from "next/image";

export const ProfileSection4 = ({ content }: { content: Basics }) => {
  return (
    <div className="min-h-64 flex">
      <div className="flex-1 flex flex-col p-2">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: `${content.firstname} ${content.lastname}`,
            }}
          />

          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: `${content.headline}`,
            }}
          />
        </div>

        <div className="flex flex-col gap-2 pb-4">
          {content.address !== "" && content.address !== "<p></p>" && (
            <div className="flex items-center col-span-2">
              <MapTrifold className="mr-2" size={30} />
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: content.address,
                }}
              />
            </div>
          )}
          <div className="flex gap-4">
            {content.phone !== "" && content.phone !== "<p></p>" && (
              <div className="flex items-center">
                <Phone className="mr-2" size={30} />
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: content.phone,
                  }}
                />
              </div>
            )}

            {content.email !== "" && content.email !== "<p></p>" && (
              <div className="flex items-center">
                <EnvelopeOpen className="mr-2" size={30} />
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: content.email,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-full w-[210px] pt-5">
        {content.picture !== "" && (
          <div className="relative h-44 w-44 rounded-full overflow-hidden not-prose">
            <Image src={content.picture} alt="Profile Picture" fill />
          </div>
        )}
      </div>
    </div>
  );
};
