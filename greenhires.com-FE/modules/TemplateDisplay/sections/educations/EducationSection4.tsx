import { ResumeData } from "@/interfaces/builder/resume";

export const EducationSection4 = ({
  content,
}: {
  content: ResumeData["sections"]["education"];
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div className="flex flex-col">
      <div className="relative flex justify-end">
        <div
          className="text-td-primary text-xl font-bold prose"
          dangerouslySetInnerHTML={{ __html: content.name }}
        />
        <div className="absolute h-[2px] w-[360px] left-0 bottom-0 bg-td-primary" />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {content.items.map((item) => {
          return (
            <div key={item.id} className="flex flex-col ">
              <div
                className="prose text-sm font-bold"
                dangerouslySetInnerHTML={{
                  __html: item.school,
                }}
              />
              <div
                className="text-sm font-bold prose"
                dangerouslySetInnerHTML={{
                  __html: item.yearGraduation as string,
                }}
              />
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
