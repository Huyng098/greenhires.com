import { ResumeData } from "@/interfaces/builder/resume";
import { getStyle } from "..";

export const CoursesSection = ({
  content,
  parsedCss,
}: {
  content: ResumeData["sections"]["courses"];
  parsedCss: unknown;
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className=" flex flex-col" style={getStyle(parsedCss, "courses")}>
      <div
        className="text-xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-2 mt-2">
        {content &&
          content.items.map((item) => (
            <div key={item.id} className="flex flex-col ">
              <div className="flex items-center gap-1">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: item.name as string }}
                />{" "}
                -{" "}
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.institution as string,
                  }}
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
            </div>
          ))}
      </div>
    </div>
  );
};
