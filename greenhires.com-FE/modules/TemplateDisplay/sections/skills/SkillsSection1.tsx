import { ResumeData } from "@/interfaces/builder/resume";

export const SkillsSection1 = ({
  content,
}: {
  content: ResumeData["sections"]["skills"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col">
      <div
        className="text-xl font-bold border-b-2 border-td-primary/70 prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-2 mt-2">
        {content.items.map((item) => (
          <div key={item.id} className="flex item-center">
            <div
              className="text-sm font-light w-32 prose"
              dangerouslySetInnerHTML={{ __html: item.name }}
            />
            <div className="flex flex-1">
              <div
                className="h-5 bg-td-primary"
                style={{
                  width: `${item.level * 20}%`,
                }}
              >
                <div className="flex justify-center text-xs text-white font-light">{`${
                  item.level * 20
                }%`}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
