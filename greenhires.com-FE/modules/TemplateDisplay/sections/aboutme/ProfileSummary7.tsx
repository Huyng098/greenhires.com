import { ResumeData } from "@/interfaces/builder/resume";

export const ProfileSummary7 = ({
  content,
}: {
  content: ResumeData["sections"]["aboutme"];
}) => {
  if (!content.content || content.content === "") return null;
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="grid grid-cols-3 items-center">
        <div className="h-1 bg-[#bf9368]" />
        <div className="bg-[#303947] text-center p-2">
          <div
            className="text-white text-xl font-bold prose"
            dangerouslySetInnerHTML={{
              __html: content.name,
            }}
          />
        </div>
        <div className="h-1 bg-[#bf9368]" />
      </div>

      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: content.content,
        }}
      />
    </div>
  );
};
