import { ResumeData } from "@/interfaces/builder/resume";

export const ProfileSummary2 = ({
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
    <div className="flex flex-col">
      <div className="w-40 h-2 bg-td-primary mb-4" />
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
    </div>
  );
};
