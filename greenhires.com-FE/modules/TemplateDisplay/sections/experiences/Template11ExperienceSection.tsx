import { Experience } from "@/interfaces/builder";
import { ResumeData } from "@/interfaces/builder/resume";

export const Template11ExperienceSection = ({
  content,
}: {
  content: ResumeData["sections"]["experience"];
}) => {
  if (!content || content.items.length <= 0) return null;

  let topContent: Experience[] = [];
  const limit = 3;
  if (content.items && content.items.length > limit) {
    topContent = content.items.slice(0, limit);
  } else {
    topContent = content.items || [];
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-td-primary text-3xl font-bold prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="relative flex flex-col gap-8 mt-6">
        {content &&
          content.items.map((item, index) => (
            <div
              key={item.id}
              className="absolute flex flex-col gap-3 w-[400px]"
              style={{
                top: `${index * 150}px`,
              }}
            >
              <div
                className="text-td-tertiary text-sm font-bold ml-10 prose"
                dangerouslySetInnerHTML={{ __html: item.position }}
              />
              <div className="text-td-tertiary w-full flex ml-10 items-center">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.company,
                  }}
                />

                <div className="text-sm font-light flex flex-1 justify-end">
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
                dangerouslySetInnerHTML={{ __html: item.summary }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
