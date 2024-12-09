import { ResumeData } from "@/interfaces/builder/resume";

export const SkillsSection2 = ({
  content,
}: {
  content: ResumeData["sections"]["skills"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col">
      <div className="w-28 h-2 bg-black mb-4" />
      <ul className="w-full list-disc pl-2 not-prose">
        {content.items.map((item) => (
          <li key={item.id} className="text-xs font-light">
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: item.name }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
