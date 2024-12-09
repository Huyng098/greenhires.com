import { Basics } from "@/interfaces/builder";

export const ProfileSection = ({ content }: { content: Basics }) => {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-4">
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

      <div className="flex flex-col justify-between">
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: content.phone,
          }}
        />
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: content.email,
          }}
        />
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: content.address,
          }}
        />
      </div>
    </div>
  );
};
