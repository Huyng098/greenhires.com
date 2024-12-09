import { ResumeData } from "@/interfaces/builder/resume";

export const EducationSection9 = ({
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
              <div key={item.id} className="flex flex-col">
                <div
                  className="prose font-bold"
                  dangerouslySetInnerHTML={{
                    __html: item.yearGraduation as string,
                  }}
                />
                <div
                  className="prose font-bold"
                  dangerouslySetInnerHTML={{
                    __html: item.school,
                  }}
                />
                <ul className="list-disc list-inside not-prose">
                  <li>
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: item.typeOfStudy,
                      }}
                    />
                  </li>
                  <li>
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: item.major,
                      }}
                    />
                  </li>
                  <li>
                    <div className="flex items-center gap-1">
                      Score:{" "}
                      <div
                        className="prose"
                        dangerouslySetInnerHTML={{
                          __html: item.score,
                        }}
                      />
                    </div>
                  </li>
                </ul>

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
