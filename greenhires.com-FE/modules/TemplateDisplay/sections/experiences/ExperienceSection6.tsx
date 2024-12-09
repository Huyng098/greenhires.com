import { ResumeData } from "@/interfaces/builder/resume";

export const ExperienceSection6 = ({
  content,
}: {
  content: ResumeData["sections"]["experience"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-primary text-xl font-bold"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col mt-2">
        {content &&
          content.items.map((item) => {
            return (
              <div key={item.id} className="flex items-stretch gap-8">
                <div className="flex items-center gap-1 min-w-24 text-primary">
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

                <div className="min-w-1 bg-[#af2e18] relative">
                  <div className="w-5 h-5 absolute top-0 left-1/2 -translate-x-1/2 bg-[#fdf9f1] border-4 border-[#af2e18] rounded-full" />
                </div>

                <div className="flex flex-col pb-2">
                  <div className="text-lg font-bold text-primary uppercase flex items-center gap-1">
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: item.company,
                      }}
                    />{" "}
                    |
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: item.position,
                      }}
                    />
                  </div>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: item.summary }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
