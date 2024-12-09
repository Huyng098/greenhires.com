import { ResumeData } from "@/interfaces/builder/resume";

export const ExperienceSection2 = ({
  content,
}: {
  content: ResumeData["sections"]["experience"];
}) => {
  if (!content || content.items.length <= 0) return null;
  console.log(content);
  return (
    <div className="flex flex-col">
      <div className="w-40 h-2 bg-black mb-4" />
      <div className="flex flex-col gap-8">
        {content.items.map((item) => (
          <div key={item.id} className="flex flex-col">
            <div className="text-sm mb-1 flex items-center gap-1">
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
              className="text-td-primary font-bold prose"
              dangerouslySetInnerHTML={{
                __html: item.position,
              }}
            />
            <div
              className="font-bold mb-1 prose"
              dangerouslySetInnerHTML={{
                __html: item.company,
              }}
            />
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
