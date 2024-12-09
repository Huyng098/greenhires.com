import { ResumeData } from "@/interfaces/builder/resume";
import { getStyle } from "..";

export const EducationSection = ({
  content,
  parsedCss,
}: {
  content: ResumeData["sections"]["education"];
  parsedCss: unknown;
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col" style={getStyle(parsedCss, "education")}>
      <div
        className="text-xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-2 mt-2">
        {content.items.map((item) => {
          return (
            <div key={item.id} className="flex flex-col ">
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: item.school,
                }}
              />
              <div className="text-sm font-light flex gap-2 items-center">
                Graduated in{" "}
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.yearGraduation as string,
                  }}
                />
              </div>
              <div className="flex items-center gap-1 text-sm font-light">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.typeOfStudy,
                  }}
                />
                in{" "}
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.major,
                  }}
                />
              </div>
              <div className="flex gap-1 items-center text-sm font-light">
                Score:{" "}
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.score,
                  }}
                />
              </div>
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: item.summary,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
