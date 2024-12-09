import { Basics } from "@/interfaces/builder";

export const ProfileSection1 = ({ content }: { content?: Basics }) => {
  if (!content) return null;
  return (
    <div className="min-h-56 flex flex-col justify-end items-start">
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
  );
};
