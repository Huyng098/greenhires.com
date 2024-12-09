import { Basics } from "@/interfaces/builder";

export const FullNameSection = ({ content }: { content: Basics }) => {
  if (!content) return null;
  if (!content.firstname && !content.lastname) return null;
  return (
    <div className="flex items-center gap-1">
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: content.firstname,
        }}
      />
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: content.lastname,
        }}
      />
    </div>
  );
};
