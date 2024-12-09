import { Basics } from "@/interfaces/builder";

export const ProfileSection7 = ({ content }: { content: Basics }) => {
  return (
    <div className="flex flex-col mt-10 gap-3">
      {((content.firstname !== "" && content.firstname !== "<p></p>") ||
        (content.lastname !== "" && content.lastname !== "<p></p>") ||
        (content.headline !== "" && content.headline !== "<p></p>")) && (
        <div className="min-h-28 w-full flex flex-col justify-center items-center bg-white border-4 border-[#bf9368]">
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: `${content.firstname} ${content.lastname}`,
            }}
          />
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: content.headline,
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-3">
        <div className="flex justify-center">
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: content.address,
            }}
          />
        </div>
        <div className="flex justify-center">
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: content.phone,
            }}
          />
        </div>
        <div className="flex justify-center">
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: content.email,
            }}
          />
        </div>
      </div>
    </div>
  );
};
