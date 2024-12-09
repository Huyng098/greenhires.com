import { ResumeData } from "@/interfaces/builder/resume";

export const EducationSection3 = ({
  content,
}: {
  content: ResumeData["sections"]["education"];
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="text-lg text-td-primary"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      {content.items.map((item) => {
        return (
          <div key={item.id} className="flex">
            <div
              className="prose flex-1 font-bold"
              dangerouslySetInnerHTML={{
                __html: item.yearGraduation as string,
              }}
            />

            <div className="flex-1 flex flex-col">
              <div
                className="font-bold prose"
                dangerouslySetInnerHTML={{ __html: item.school }}
              />
              <div
                className="text-sm prose"
                dangerouslySetInnerHTML={{ __html: item.typeOfStudy }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
