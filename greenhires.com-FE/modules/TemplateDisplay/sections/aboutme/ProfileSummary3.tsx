import { ResumeData } from "@/interfaces/builder/resume";

export const ProfileSummary3 = ({
  content,
}: {
  content: ResumeData["sections"]["aboutme"];
}) => {
  if (
    !content.content ||
    content.content === "" ||
    content.content === "<p></p>"
  )
    return null;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="text-lg text-td-primary"
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
