import { ResumeData } from "@/interfaces/builder/resume";
import { getStyle } from "..";

export const HobbiesSection = ({
  content,
  parsedCss,
}: {
  content: ResumeData["sections"]["hobbies"];
  parsedCss: unknown;
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className=" flex flex-col" style={getStyle(parsedCss, "hobbies")}>
      <div
        className="text-xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-2 mt-2">
        {content &&
          content.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div
                className="text-sm font-bold prose"
                dangerouslySetInnerHTML={{ __html: item.name }}
              />
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: item.summary }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
