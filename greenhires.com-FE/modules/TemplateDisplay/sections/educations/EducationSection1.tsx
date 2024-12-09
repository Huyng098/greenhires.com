import { ResumeData } from "@/interfaces/builder/resume";

export const EducationSection1 = ({
  content,
}: {
  content: ResumeData["sections"]["education"];
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div className="flex flex-col">
      <div
        className="text-xl font-bold border-b-2 border-td-primary/70 prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-2 mt-2">
        {content.items.map((item) => {
          return (
            <div key={item.id} className="flex flex-col ">
              <div
                className="prose text-sm font-bold"
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
