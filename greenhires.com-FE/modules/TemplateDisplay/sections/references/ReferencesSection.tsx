import { ResumeData } from "@/interfaces/builder/resume";

export const ReferencesSection = ({
  content,
}: {
  content: ResumeData["sections"]["references"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-3xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-8 mt-2">
        {content &&
          content.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3">
              <div className="text-sm font-bold flex items-center gap-1">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.name,
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
                dangerouslySetInnerHTML={{ __html: item.phone }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
