import { ResumeData } from "@/interfaces/builder/resume";
import { Briefcase } from "@phosphor-icons/react";

export const ExperienceSection5 = ({
  content,
}: {
  content: ResumeData["sections"]["experience"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <Briefcase
          size={30}
          weight="fill"
          className="fill-td-primary text-td-primary mr-2"
        />
        <div
          className="text-xl font-bold prose"
          dangerouslySetInnerHTML={{ __html: content.name }}
        />
      </div>
      <div className="flex flex-col gap-8 mt-2">
        {content &&
          content.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-sm font-bold">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.company,
                  }}
                />{" "}
                |
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.position,
                  }}
                />
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.startDate as string,
                  }}
                />{" "}
                -
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.endDate as string,
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: item.summary }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
