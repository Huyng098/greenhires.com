import { ResumeData } from "@/interfaces/builder/resume";
import { getStyle } from "../layouts";

export const AwardsSection = ({
  content,
  parsedCss,
}: {
  content: ResumeData["sections"]["awards"];
  parsedCss: unknown;
}) => {
  if (!content || !content.items.length) return null;
  return (
    <div style={getStyle(parsedCss, "awards")} className="flex flex-col gap-2">
      <div
        className="text-xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="text-xs font-light">
        {content.items.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            <div className="flex items-center gap-1">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: item.date as string }}
              />{" "}
              -{" "}
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: item.awarder }}
              />
            </div>
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
