import { ResumeData } from "@/interfaces/builder/resume";

export const ExperienceSection3 = ({
  content,
}: {
  content: ResumeData["sections"]["experience"];
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="text-lg text-td-primary prose"
        dangerouslySetInnerHTML={{
          __html: content.name,
        }}
      />

      {content.items.map((item) => (
        <div key={item.id} className="flex">
          <div className="font-bold w-28 flex items-center gap-1">
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

          <div className="flex-1 flex flex-col">
            <div
              className="font-bold mb-2 prose"
              dangerouslySetInnerHTML={{
                __html: item.position,
              }}
            />
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: item.summary,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
