import { MuscleIcon } from "@/icons/MuscleIcon";
import { ResumeData } from "@/interfaces/builder/resume";

export const SkillsSection5 = ({
  content,
}: {
  content: ResumeData["sections"]["skills"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <MuscleIcon className="fill-td-primary mr-2 stroke-td-primary" />
        <div
          className="text-xl font-bold prose"
          dangerouslySetInnerHTML={{ __html: content.name }}
        />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {content.items.map((item) => (
          <div key={item.id} className="flex items-center w-full">
            <div
              className="text-xs font-bold w-28 prose"
              dangerouslySetInnerHTML={{ __html: item.name }}
            />
            <div className="flex-1">
              <div
                className="bg-td-primary"
                style={{
                  height: "15px",
                  width: `${item.level * 20}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
