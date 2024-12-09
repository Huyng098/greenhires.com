import { ResumeData } from "@/interfaces/builder/resume";

export const SkillsSection3 = ({
  content,
}: {
  content: ResumeData["sections"]["skills"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <div
        className="text-lg text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col">
        {content.items.map((item, index) => {
          if (index < 4) {
            return (
              <div key={item.id} className="flex items-center">
                <div className={`min-w-2 min-h-2 mr-2 bg-td-primary`} />
                <div
                  className="flex justify-end prose"
                  dangerouslySetInnerHTML={{ __html: item.name }}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
