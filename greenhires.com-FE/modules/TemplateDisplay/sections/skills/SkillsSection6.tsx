import { ResumeData } from "@/interfaces/builder/resume";

export const SkillsSection6 = ({
  content,
}: {
  content: ResumeData["sections"]["skills"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col">
      <div
        className="text-primary text-xl font-bold prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <ul className="mt-2 list-disc list-inside marker:text-primary not-prose">
        {content.items.map((item) => (
          <li key={item.id}>
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
