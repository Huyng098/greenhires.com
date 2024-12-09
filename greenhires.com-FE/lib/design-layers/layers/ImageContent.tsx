import {
  BoxSize,
  Delta,
  getTransformStyle,
  LayerComponentProps,
} from "@lidojs/design-core";
import Image from "next/image";
import { FC } from "react";
export interface ImageContentProps extends LayerComponentProps {
  image: {
    url: string;
    position: Delta;
    rotate: number;
    boxSize: BoxSize;
    transparency?: number;
  };
}

export const ImageContent: FC<ImageContentProps> = ({ image, boxSize }) => {
  return (
    <div
      style={{
        overflow: "hidden",
        pointerEvents: "auto",
        width: boxSize.width,
        height: boxSize.height,
      }}
    >
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
          opacity: image.transparency,
        }}
      >
        {image.url !== "" && (
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
        )}
      </div>
    </div>
  );
};
