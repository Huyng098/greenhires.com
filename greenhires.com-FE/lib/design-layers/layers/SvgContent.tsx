import { LayerComponentProps } from "@lidojs/design-core";
import { Color, fetchSvgContent } from "@lidojs/design-utils";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
export interface SvgContentProps extends LayerComponentProps {
  image: string;
  colors: string[];
  usingMainColor?: boolean;
}

export const SvgContent: FC<SvgContentProps> = ({ image, boxSize, colors }) => {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    let isMounted = true;

    const processSvg = async () => {
      try {
        const ele = await fetchSvgContent(image);
        ele.style.fill = "";
        ele.style.stroke = "";
        const originalColorList: string[] = [];
        const paths = ele.querySelectorAll(
          "path, circle, ellipse,line, rect, polygon,polyline, text"
        ) as unknown as NodeListOf<HTMLElement>;

        for (let j = 0; j < paths.length; j++) {
          const style = paths[j].getAttribute("style");
          let stroke = paths[j].getAttribute("stroke") || "none";
          let fill = paths[j].getAttribute("fill") || "#000000";
          const styleObj: Record<string, string> = {};

          if (style) {
            const styleList = style.split(";").filter((s) => !!s);
            styleList.forEach((attr) => {
              const [key, value] = attr.split(":");
              styleObj[key.trim()] = value.trim();
            });
          }

          if (styleObj.stroke) {
            stroke = styleObj.stroke;
          }
          if (styleObj.fill) {
            fill = styleObj.fill;
          }

          if (
            stroke &&
            !["none", "currentcolor"].includes(stroke.toLowerCase()) &&
            !/url\((.*?)\)/.test(stroke)
          ) {
            if (!originalColorList.includes(new Color(stroke).toRgbString())) {
              originalColorList.push(new Color(stroke).toRgbString());
            }
            paths[j].style.fill = "";
            paths[j].style.stroke = "";
            paths[j].setAttribute(
              "stroke",
              colors[
                originalColorList.indexOf(new Color(stroke).toRgbString())
              ] || "#000000"
            );
          } else if (
            fill &&
            !["none", "currentcolor"].includes(fill.toLowerCase()) &&
            !/url\((.*?)\)/.test(fill)
          ) {
            if (!originalColorList.includes(new Color(fill).toRgbString())) {
              originalColorList.push(new Color(fill).toRgbString());
            }
            paths[j].style.fill = "";
            paths[j].style.stroke = "";
            paths[j].setAttribute(
              "fill",
              colors[
                originalColorList.indexOf(new Color(fill).toRgbString())
              ] || "#000000"
            );
          }
        }

        const svgBlob = new Blob([ele.outerHTML], {
          type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        if (isMounted) {
          setUrl(svgUrl);
        }
      } catch (error) {
        console.error("Error processing SVG:", error);
      }
    };

    processSvg();

    return () => {
      isMounted = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [image, colors]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {image && (
        <div
          style={{
            width: boxSize.width,
            height: boxSize.height,
            position: "relative",
            userSelect: "none",
          }}
        >
          {url && (
            <Image
              priority
              alt={url}
              crossOrigin={"anonymous"}
              style={{
                objectFit: "fill",
                width: "100%",
                height: "100%",
                position: "absolute",
                pointerEvents: "none",
              }}
              fill
              src={url}
            />
          )}
        </div>
      )}
    </div>
  );
};
