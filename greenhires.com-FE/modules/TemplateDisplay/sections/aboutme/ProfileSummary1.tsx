import { ResumeData } from "@/interfaces/builder/resume";

export const ProfileSummary1 = ({
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
      <div
        className="text-2xl font-bold mb-4 text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
    </div>
  );
};
