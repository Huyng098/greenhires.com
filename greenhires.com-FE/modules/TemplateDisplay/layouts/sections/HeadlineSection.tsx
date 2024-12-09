import { Basics } from "@/interfaces/builder";
import { getStyle } from "..";

export const HeadlineSection = ({
  content,
  parsedCss,
}: {
  content: Basics;
  parsedCss?: unknown;
}) => {
  if (!content) return null;
  if (!content.headline) return null;
  return (
    <div
      className="prose"
      style={getStyle(parsedCss, "basics")}
      dangerouslySetInnerHTML={{
        __html: content.headline,
      }}
    />
  );
};
