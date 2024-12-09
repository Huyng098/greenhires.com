import { ResumeData } from "@/interfaces/builder/resume";
import { getStyle } from "..";

export const SkillsSection = ({
  content,
  parsedCss,
}: {
  content: ResumeData["sections"]["skills"];
  parsedCss: unknown;
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className=" flex flex-col" style={getStyle(parsedCss, "skills")}>
      <div
        className="text-xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-2 mt-2">
        {content.items.map((item) => (
          <div key={item.id}>
            <div
              className="text-sm font-bold prose"
              dangerouslySetInnerHTML={{ __html: item.name }}
            />
            <div
              className="text-sm prose"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
