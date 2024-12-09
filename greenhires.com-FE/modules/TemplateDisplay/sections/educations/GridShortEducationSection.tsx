import { ResumeData } from "@/interfaces/builder/resume";

export const GridShortEducationSection = ({
  content,
}: {
  content: ResumeData["sections"]["education"];
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div className="flex flex-col gap-2 break-inside-avoid-column">
      {content.name !== "" && content.name !== "<p></p>" && (
        <div className="min-h-[1px] w-full bg-black my-4" />
      )}
      <div
        className="text-3xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="grid grid-cols-3 gap-8 mt-2">
        {content &&
          content.items.map((item, index) => {
            return (
              <div
                key={item.id}
                className="flex flex-col gap-3"
                style={{
                  borderRight: index % 3 === 2 ? "none" : "1px solid #e5e7eb",
                }}
              >
                <div
                  className="text-lg font-bold prose"
                  dangerouslySetInnerHTML={{
                    __html: item.school,
                  }}
                />
                <div className="flex items-center gap-1 text-xs">
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.typeOfStudy,
                    }}
                  />
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.major,
                    }}
                  />
                </div>
                <div className="text-xs flex items-center gap-1">
                  Graduated in
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.yearGraduation as string,
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
