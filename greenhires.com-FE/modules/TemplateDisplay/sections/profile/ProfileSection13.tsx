import { Basics } from "@/interfaces/builder";

export const ProfileSection13 = ({ content }: { content: Basics }) => {
  return (
    <div className="flex h-full flex-col gap-3">
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
