import { ResumeData } from "@/interfaces/builder/resume";

export const ReferencesSection13 = ({
  content,
}: {
  content: ResumeData["sections"]["references"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-primary text-xl font-bold prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />

      <div className="flex flex-col w-full mt-2">
        {content &&
          content.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-3">
              <div
                className="text-sm font-bold prose"
                dangerouslySetInnerHTML={{ __html: item.name }}
              />
              <ul className="list-disc list-inside not-prose">
                <li>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: item.position }}
                  />
                </li>
                <li>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: item.phone }}
                  />
                </li>
                <li>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: item.email }}
                  />
                </li>
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};