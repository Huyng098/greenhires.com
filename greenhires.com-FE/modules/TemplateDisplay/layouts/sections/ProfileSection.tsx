import { Basics } from "@/interfaces/builder";
import { FullNameSection } from "./FullNameSection";
import { HeadlineSection } from "./HeadlineSection";
import { getStyle } from "..";

export const ProfileSection = ({
  content,
  parsedCss,
}: {
  content: Basics;
  parsedCss: unknown;
}) => {
  return (
    <div
      className="flex gap-2 justify-between"
      style={getStyle(parsedCss, "basics")}
    >
      <div className="flex flex-col gap-2">
        <FullNameSection content={content} />
        <HeadlineSection content={content} />
        <div className="flex gap-4">
          {content.phone && content.phone !== "<p></p>" && (
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: content.phone,
              }}
            />
          )}
          {content.email && content.email !== "<p></p>" && (
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: content.email,
              }}
            />
          )}
        </div>
        <div className="flex gap-4">
          {content.country && content.country !== "<p></p>" && (
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: content.country,
              }}
            />
          )}
          {content.city && content.city !== "<p></p>" && (
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: content.city,
              }}
            />
          )}
        </div>
        {content.address && content.address !== "<p></p>" && (
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: content.address,
            }}
          />
        )}
      </div>
    </div>
  );
};
