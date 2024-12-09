import { ResumeData } from "@/interfaces/builder/resume";

export const EducationSection6 = ({
  content,
}: {
  content: ResumeData["sections"]["education"];
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-primary text-xl font-bold prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col mt-2">
        {content &&
          content.items.map((item) => {
            return (
              <div key={item.id} className="flex items-stretch gap-8">
                <div
                  className="min-w-24 text-primary"
                  dangerouslySetInnerHTML={{
                    __html: item.yearGraduation as string,
                  }}
                />

                <div className="min-w-1 bg-[#af2e18] relative">
                  <div className="w-5 h-5 absolute top-0 left-1/2 -translate-x-1/2 bg-[#fdf9f1] border-4 border-[#af2e18] rounded-full" />
                </div>

                <div className="flex flex-col pb-2">
                  <div className="flex items-center gap-1 text-lg font-bold text-primary uppercase">
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: item.typeOfStudy,
                      }}
                    />
                    of{" "}
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: item.major,
                      }}
                    />
                    ,{" "}
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: item.school,
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
