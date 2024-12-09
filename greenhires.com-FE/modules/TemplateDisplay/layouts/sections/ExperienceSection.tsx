import { ResumeData } from "@/interfaces/builder/resume";
import { getStyle } from "..";

export const ExperienceSection = ({
  content,
  parsedCss,
}: {
  content: ResumeData["sections"]["experience"];
  parsedCss: unknown;
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div
      className=" flex flex-col gap-2"
      style={getStyle(parsedCss, "experience")}
    >
      <div
        className="text-xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-8 mt-2">
        {content.items.map((item) => {
          return (
            <div key={item.id} className="flex flex-col gap-3">
              <div className="text-sm font-bold flex items-center gap-1">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: item.company }}
                />{" "}
                |{" "}
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: item.position }}
                />
              </div>
              <div className="text-sm font-light flex items-center gap-1">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: item.startDate as string }}
                />{" "}
                -{" "}
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: item.endDate as string }}
                />
              </div>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: item.summary }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
