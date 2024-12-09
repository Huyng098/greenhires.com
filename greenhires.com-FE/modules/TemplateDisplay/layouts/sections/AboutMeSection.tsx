import { ResumeData } from "@/interfaces/builder/resume";
import { getStyle } from "..";

export const AboutMeSection = ({
  content,
  parsedCss,
}: {
  content: ResumeData["sections"]["aboutme"];
  parsedCss: unknown;
}) => {
  if (
    !content.content ||
    content.content === "" ||
    content.content === "<p></p>"
  )
    return null;
  return (
    <div
      className="w-full flex flex-col gap-2"
      style={getStyle(parsedCss, "aboutme")}
    >
      <div className="flex items-center">
        <div
          className="prose text-td-primary text-xl font-bold"
          dangerouslySetInnerHTML={{ __html: content.name }}
        />
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
