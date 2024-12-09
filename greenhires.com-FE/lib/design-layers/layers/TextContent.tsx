"use client";
import {
  EffectSettings,
  FontData,
  LayerComponentProps,
} from "@lidojs/design-core";
import parse from "html-react-parser";
import { CSSProperties, FC } from "react";
import { getTextEffectStyle } from "./text";

export interface TextContentProps extends LayerComponentProps {
  text: string;
  scale: number;
  fonts: FontData[];
  colors: string[];
  fontSizes: number[];
  effect: {
    name: string;
    settings: EffectSettings;
  } | null;
  usingMainColor?: boolean;
}
interface CustomStyleProps extends CSSProperties {
  "&:before"?: CSSProperties;
}

export const TextContent: FC<TextContentProps> = ({
  text,
  colors,
  fontSizes,
  effect,
}) => {
  const customStyle: CustomStyleProps = {
    ...getTextEffectStyle(
      effect?.name || "none",
      effect?.settings as EffectSettings,
      colors[0],
      fontSizes[0]
    ),
    "&:before": {
      ...getTextEffectStyle(
        effect?.name || "none",
        effect?.settings as EffectSettings,
        colors[0],
        fontSizes[0]
      ),
    },
  };
  return (
    <div className={`lidojs-text`} style={{ ...customStyle }}>
      {parse(text)}
    </div>
  );
};
