import { ResumeData } from "@/interfaces/builder/resume";
import { getStyle } from "..";

export const LinksSection = ({
  content,
  parsedCss,
}: {
  content: ResumeData["sections"]["links"];
  parsedCss: unknown;
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className=" flex flex-col gap-2" style={getStyle(parsedCss, "links")}>
      <div
        className="text-xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-8 mt-2">
        {content &&
          content.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: item.label }}
              />
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: item.href }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
