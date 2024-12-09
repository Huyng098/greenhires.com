import { ResumeData } from "@/interfaces/builder/resume";
import { School } from "@mui/icons-material";

export const EducationSection5 = ({
  content,
}: {
  content: ResumeData["sections"]["education"];
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <School
          className="fill-td-primary text-td-primary mr-2"
          fontSize="large"
        />
        <div
          className="text-xl font-bold prose"
          dangerouslySetInnerHTML={{ __html: content.name }}
        />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {content.items.map((item) => {
          return (
            <div key={item.id} className="flex flex-col ">
              <div className="flex items-center gap-1 text-sm font-bold">
                <div dangerouslySetInnerHTML={{ __html: item.school }} />
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.yearGraduation as string,
                  }}
                />
              </div>
              <div className="flex items-center gap-1 text-sm font-light">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.typeOfStudy,
                  }}
                />
                in{" "}
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.major,
                  }}
                />
              </div>
              <div className="flex gap-1 items-center text-sm font-light">
                Score:{" "}
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: item.score,
                  }}
                />
              </div>
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: item.summary,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
