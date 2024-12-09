import { ResumeData } from "@/interfaces/builder/resume";

export const LanguagesSection13 = ({
  content,
}: {
  content: ResumeData["sections"]["languages"];
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div className="flex flex-col">
      <div
        className="text-td-primary text-xl font-bold prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <ul className="mt-2 list-disc list-inside not-prose">
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
