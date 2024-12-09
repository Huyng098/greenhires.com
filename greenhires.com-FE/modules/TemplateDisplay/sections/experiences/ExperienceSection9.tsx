import { ResumeData } from "@/interfaces/builder/resume";

export const ExperienceSection9 = ({
  content,
}: {
  content: ResumeData["sections"]["experience"];
}) => {
  console.log(content);
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-primary text-xl font-bold prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />

      <div className="min-h-1 bg-[#FFDE32]" />

      <div className="flex flex-col gap-4">
        {content &&
          content.items.map((item) => {
            return (
              <div key={item.id} className="flex">
                <div className="h-2 w-2 rounded-full bg-[#FFDE32] m-2" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex">
                    <div className="flex flex-col">
                      <div
                        className="font-bold prose"
                        dangerouslySetInnerHTML={{ __html: item.company }}
                      />
                      <div
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: item.position }}
                      />
                    </div>
                    <div className="flex-1 text-end">
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
                    </div>
                  </div>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.summary,
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
