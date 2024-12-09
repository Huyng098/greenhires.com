import { Basics } from "@/interfaces/builder";
import { EnvelopeOpen, MapTrifold, Phone } from "@phosphor-icons/react";

export const ProfileSection5 = ({ content }: { content: Basics }) => {
  console.log(content);
  return (
    <div className="min-h-80 flex flex-col justify-center">
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: `${content.firstname}`,
        }}
      />
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: `${content.lastname}`,
        }}
      />

      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: `${content.headline}`,
        }}
      />

      <div className="flex flex-col justify-between">
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

        {content.address !== "" && content.address !== "<p></p>" && <div className="flex items-center">
          <MapTrifold className="mr-2" size={30} />
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: content.address,
            }}
          />
        </div>}
      </div>
    </div>
  );
};
