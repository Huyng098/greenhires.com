import { ResumeData } from "@/interfaces/builder/resume";
import { getStyle } from "..";

export const LanguagesSection = ({
  content,
  parsedCss,
}: {
  content: ResumeData["sections"]["languages"];
  parsedCss: unknown;
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div
      className=" flex flex-col gap-4"
      style={getStyle(parsedCss, "languages")}
    >
      <div
        className="text-xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="text-xs font-light">
        {content.items.map((language, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: language.name }}
              />
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: language.level }}
              />
            </div>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: language.summary }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
