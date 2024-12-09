import { ResumeData } from "@/interfaces/builder/resume";

export const SkillsSection = ({
  content,
}: {
  content: ResumeData["sections"]["skills"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col">
      <div
        className="text-td-primary text-xl font-bold prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-2 mt-2">
        {content.items.map((item) => (
          <div key={item.id} className="flex flex-col ">
            <div
              className="text-sm font-bold prose"
              dangerouslySetInnerHTML={{ __html: item.name }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
