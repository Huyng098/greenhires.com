"use client";

import { EditorContext } from "@/lib/design-editor/editor/EditorContext";
import { BoxSize, Delta } from "@lidojs/design-core";
import { ShapeContent, ShapeContentProps } from "@lidojs/design-layers";
import { FC, useContext, useEffect, useState } from "react";
import { FrameLayerProps } from "./FrameLayer";

export type ShapeLayerProps = ShapeContentProps & {
  image: {
    url: string;
    thumb: string;
    position: Delta;
    rotate: number;
    boxSize: BoxSize;
  } | null;
};

const ShapeLayer: FC<ShapeLayerProps> = ({
  fontSizes,
  text,
  layerId,
  boxSize,
  shape,
  image,
  color,
  gradientBackground,
  roundedCorners = 0,
  scale = 1,
  rotate,
  position,
  border,
  fill,
  textHeight,
  textWidth,
  textPosX,
  textPosY,
}) => {
  const { config } = useContext(EditorContext);
  const [imageData, setImageData] = useState<FrameLayerProps["image"]>(null);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setImageData((prevState) => {
          if (prevState) {
            return { ...prevState, url: img.src };
          }
          return prevState;
        });
      };
      img.src = image.url;
    }
  }, [image]);

  useEffect(() => {
    const getImageSetting = () => {
      const imgRatio =
        config?.frame.defaultImage.width / config?.frame.defaultImage.height;
      const boxRatio = boxSize.width / boxSize.height;
      const w =
        imgRatio > boxRatio
          ? (boxSize.height / scale) * imgRatio
          : boxSize.width / scale;
      const h =
        imgRatio > boxRatio
          ? boxSize.height / scale
          : (boxSize.width / scale) * imgRatio;
      const res: FrameLayerProps["image"] = {
        boxSize: {
          width: w,
          height: h,
        },
        position: {
          x: -(w - boxSize.width / scale) / 2,
          y: -(h - boxSize.height / scale) / 2,
        },
        rotate: 0,
        url: config?.frame.defaultImage.url,
        thumb: config?.frame.defaultImage.url,
      };
      return res;
    };
    if (!image && !color && !gradientBackground) {
      setImageData(getImageSetting());
    } else {
      setImageData(image);
    }
  }, [
    image,
    color,
    gradientBackground,
    config?.frame?.defaultImage.width,
    config?.frame?.defaultImage.height,
    config?.frame?.defaultImage.url,
    boxSize.width,
    boxSize.height,
    scale,
  ]);

  return (
    <div
      style={{
        transformOrigin: "0 0",
        width: boxSize.width / (scale || 1),
        height: boxSize.height / (scale || 1),
        transform: `scale(${scale || 1})`,
      }}
    >
      <ShapeContent
        fontSizes={fontSizes}
        text={text}
        border={border}
        boxSize={boxSize}
        color={color}
        gradientBackground={gradientBackground}
        image={imageData}
        layerId={layerId}
        position={position}
        rotate={rotate}
        roundedCorners={roundedCorners}
        scale={scale}
        shape={shape}
        fill={fill}
        textWidth={textWidth}
        textHeight={textHeight}
        textPosX={textPosX}
        textPosY={textPosY}
      />
    </div>
  );
};

export default ShapeLayer;
