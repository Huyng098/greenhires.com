import { ResumeData } from "@/interfaces/builder/resume";

export const LanguagesSection = ({
  content,
}: {
  content: ResumeData["sections"]["languages"];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-td-primary">LANGUAGES</h1>
      <div className="text-xs font-light">
        {content && (
          <div>
            {content &&
              content.items.map((language, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div>{language.name}</div>
                    <div>{language.level}</div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
