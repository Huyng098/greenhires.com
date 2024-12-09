import { FontData } from "@lidojs/design-core";
import React, { FC, useEffect, useMemo } from "react";

export interface FontStyleProps {
  font: FontData;
}

const FontStyle: FC<FontStyleProps> = ({ font }) => {
  const fontFaceString = useMemo(() => {
    const fontFaceCss: string[] = [];
    font.fonts?.forEach((cur) => {
      fontFaceCss.push(`
                @font-face {
                  font-family: '${font.name}';
                  font-weight: ${cur.style?.toLowerCase().includes("bold") ? "bold" : "normal"};
                  ${
                    cur.style?.toLowerCase().includes("italic")
                      ? "font-style: italic;\n"
                      : "font-style: normal;\n"
                  }
                  src: url(/${cur.urls.join(",")}) format('woff2');
                  font-display: block;
                }
            `);
    });
    return fontFaceCss.join("\n");
  }, [font]);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = fontFaceString;
    document.head.appendChild(styleTag);

    // Cleanup
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [fontFaceString]);

  return null; // We don't need to render anything in the component
};

export default React.memo(FontStyle);
