import { ResumeData } from "@/interfaces/builder/resume";

export const HobbiesSection1 = ({
  content,
}: {
  content: ResumeData["sections"]["hobbies"];
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div
        className="text-2xl font-bold text-td-primary"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <ul className="list-disc list-inside not-prose">
        {content.items.map((item) => (
          <li key={item.id} className="text-xs font-light">
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: item.name,
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
