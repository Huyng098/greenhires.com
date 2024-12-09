import React, { useEffect, useMemo } from "react";
import { useEditor } from "../../hooks";

const FontStyle = () => {
  const { fontList } = useEditor((state) => ({ fontList: state.fontList }));
  const fontFaceString = useMemo(() => {
    const fontFaceCss: string[] = [];
    fontList.forEach((font) => {
      const cur = font.fonts.find(
        (i) => !i.style || i.style.toLowerCase().includes("regular")
      );
      if (cur) {
        fontFaceCss.push(`
          @font-face {
            font-family: '${font.name}';
            src: url(/${cur.urls.join(",")}) format('woff2');
            font-display: block;
          }
        `);
      }
    });
    return fontFaceCss.join("\n");
  }, [fontList]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = fontFaceString;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [fontFaceString]);

  return null; // Since the styles are injected directly, we don't need to render anything
};

export default React.memo(FontStyle);
