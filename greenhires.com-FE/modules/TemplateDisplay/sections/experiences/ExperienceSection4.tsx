import { ResumeData } from "@/interfaces/builder/resume";
import { Work } from "@mui/icons-material";

export const ExperienceSection4 = ({
  content,
}: {
  content: ResumeData["sections"]["experience"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <Work className="fill-td-primary mr-2" fontSize="large" />
        <div
          className="text-xl font-bold text-td-primary prose"
          dangerouslySetInnerHTML={{ __html: content.name }}
        ></div>
        <div className="flex flex-col gap-8 mt-2">
          {content.items.map((item) => (
            <div key={item.id} className="flex gap-8">
              <div className="text-sm font-bold flex items-center gap-1">
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
                <div className="flex items-center gap1">
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

                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: item.summary }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
