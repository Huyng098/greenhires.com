import { ResumeData } from "@/interfaces/builder/resume";

export const EducationSection7 = ({
  content,
}: {
  content: ResumeData["sections"]["education"];
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div className="flex flex-col gap-1">
      <div
        className="text-primary text-xl font-bold prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col">
        {content &&
          content.items.map((item) => {
            return (
              <div key={item.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-1 text-sm">
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.school,
                    }}
                  />
                  ,
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.yearGraduation as string,
                    }}
                  />
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
