import { ResumeData } from "@/interfaces/builder/resume";

export const AboutMeSection = ({
  content,
}: {
  content: ResumeData["sections"]["aboutme"];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-td-primary">PROFILE</h1>
      {content && (
        <div
          className="prose"
        dangerouslySetInnerHTML={{ __html: content.content }}
        />
      )}
    </div>
  );
};
