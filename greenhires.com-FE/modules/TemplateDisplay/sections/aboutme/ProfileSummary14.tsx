import { ResumeData } from "@/interfaces/builder/resume";

export const ProfileSummary14 = ({
  content,
}: {
  content: ResumeData["sections"]["aboutme"];
}) => {
  if (!content.content || content.content === "") return null;
  return (
    <div className="w-full flex flex-col gap-2">
      <div
        className="text-primary text-xl font-bold prose"
        dangerouslySetInnerHTML={{
          __html: content.name,
        }}
      />

      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: content.content,
        }}
      />
    </div>
  );
};
