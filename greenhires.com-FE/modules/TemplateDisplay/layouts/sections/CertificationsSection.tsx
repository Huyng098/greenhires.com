import { ResumeData } from "@/interfaces/builder/resume";
import { getStyle } from "..";

export const CertificationsSection = ({
  content,
  parsedCss,
}: {
  content: ResumeData["sections"]["certifications"];
  parsedCss: unknown;
}) => {
  if (!content || content.items.length <= 0) return null;

  return (
    <div
      className=" flex flex-col"
      style={getStyle(parsedCss, "certifications")}
    >
      <div
        className="text-xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-2 mt-2">
        {content &&
          content.items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
              <div className="flex items-center gap-1">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: item.date as string }}
                />{" "}
                -{" "}
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: item.issuer }}
                />
              </div>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: item.summary }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
