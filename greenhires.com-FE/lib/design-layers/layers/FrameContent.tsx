import {
  BoxSize,
  Delta,
  getGradientBackground,
  getTransformStyle,
  GradientStyle,
  LayerComponentProps,
} from "@lidojs/design-core";
import Image from "next/image";
import { FC } from "react";
export interface FrameContentProps extends LayerComponentProps {
  clipPath: string;
  scale: number;
  color: string | null;
  gradientBackground: {
    colors: string[];
    style: GradientStyle;
  } | null;
  image: {
    url: string;
    position: Delta;
    rotate: number;
    boxSize: BoxSize;
  } | null;
  usingMainColor?: boolean;
}

export const FrameContent: FC<FrameContentProps> = ({
  clipPath,
  image,
  color,
  gradientBackground,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        clipPath: `path("${clipPath}")`,
        background: gradientBackground
          ? getGradientBackground(
              gradientBackground.colors,
              gradientBackground.style
            )
          : color ?? undefined,
      }}
    >
      {image && (
        <div
          style={{
            width: image.boxSize.width,
            height: image.boxSize.height,
            transform: getTransformStyle({
              position: image.position,
              rotate: image.rotate,
            }),
            position: "relative",
            userSelect: "none",
          }}
        >
          <Image
            alt={image.url}
            style={{
              objectFit: "fill",
              width: "100%",
              height: "100%",
              position: "absolute",
              pointerEvents: "none",
            }}
            fill
            src={image.url}
          />
        </div>
      )}
    </div>
  );
};
