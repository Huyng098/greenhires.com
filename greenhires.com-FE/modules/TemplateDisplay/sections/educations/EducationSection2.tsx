import { ResumeData } from "@/interfaces/builder/resume";

export const EducationSection2 = ({
  content,
}: {
  content: ResumeData["sections"]["education"];
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div className="flex flex-col text-xs">
      <div className="w-28 h-2 bg-black mb-4" />

      <div className="flex flex-col gap-4">
        {content.items.map((item) => {
          return (
            <div key={item.id} className="flex flex-col">
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: item.yearGraduation as string,
                }}
              />

              <div className="flex items-center gap-1 text-td-primary font-bold text-sm">
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
                dangerouslySetInnerHTML={{
                  __html: item.school,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
