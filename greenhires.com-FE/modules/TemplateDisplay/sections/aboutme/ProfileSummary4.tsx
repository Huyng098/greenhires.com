import { ResumeData } from "@/interfaces/builder/resume";

export const ProfileSummary4 = ({
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
    <div id="aboutme4" className="w-full flex flex-col gap-2">
      <div className="relative flex justify-end">
        <div
          className="text-td-primary text-xl font-bold prose"
          dangerouslySetInnerHTML={{
            __html: content.name,
          }}
        />
        <div className="absolute h-[2px] w-[360px] left-0 bottom-0 bg-td-primary" />
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
