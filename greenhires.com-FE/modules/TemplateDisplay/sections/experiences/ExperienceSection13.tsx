import { ResumeData } from "@/interfaces/builder/resume";

export const ExperienceSection13 = ({
  content,
}: {
  content: ResumeData["sections"]["experience"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-primary text-xl font-bold prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />

      <div className="flex flex-col gap-4">
        {content &&
          content.items.map((item) => {
            return (
              <div key={item.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.position,
                    }}
                  />{" "}
                  at
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.company,
                    }}
                  />
                </div>

                <div className="flex items-center gap-1">
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.startDate as string,
                    }}
                  />{" "}
                  -
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.endDate as string,
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
