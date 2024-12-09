import { ResumeData } from "@/interfaces/builder/resume";

export const TwoLineEducationSection = ({
  content,
}: {
  content: ResumeData["sections"]["education"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col">
      <div
        className="text-td-primary text-xl font-bold prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-2 mt-2">
        {content &&
          content.items.map((item) => {
            return (
              <div key={item.id} className="flex flex-col ">
                <div className="flex">
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: `${item.typeOfStudy} ${item.major}`,
                    }}
                  />
                  {item.yearGraduation && <span className="mx-1">,</span>}
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: item.yearGraduation as string,
                    }}
                  />
                </div>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: `${item.school}`,
                  }}
                />
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: `Score: ${item.score}`,
                  }}
                />
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: `${item.summary}`,
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};
