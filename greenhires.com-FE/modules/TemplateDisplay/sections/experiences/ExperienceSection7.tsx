import { ResumeData } from "@/interfaces/builder/resume";

export const ExperienceSection7 = ({
  content,
}: {
  content: ResumeData["sections"]["experience"];
}) => {
  if (!content || content.items.length <= 0) return null;
  console.log(content);
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 items-center">
        <div className="bg-[#303947] text-center p-2">
          <div
            className="text-white text-xl font-bold prose"
            dangerouslySetInnerHTML={{ __html: content.name }}
          />
        </div>
        <div className="h-1 bg-[#bf9368]" />
      </div>
      <div className="flex flex-col pl-4 gap-4">
        {content &&
          content.items.map((item) => {
            return (
              <div key={item.id} className="flex flex-col gap-1">
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
                <div className="flex items-center gap-1">
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.company as string,
                    }}
                  />{" "}
                  |
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.position as string,
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
