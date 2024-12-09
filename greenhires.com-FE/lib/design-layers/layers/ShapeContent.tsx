"use client";
import {
  BoxSize,
  Delta,
  EffectSettings,
  FontData,
  getGradientBackground,
  getTransformStyle,
  GradientStyle,
  LayerComponentProps,
  ShapeBorderStyle,
  ShapeType,
} from "@lidojs/design-core";
import parse from "html-react-parser";
import Image from "next/image";
import { FC } from "react";
import { getShapePath } from "./shape";

export interface ShapeContentProps extends LayerComponentProps {
  text?: string;
  fonts?: FontData[];
  fontSizes?: number[];
  textUsingMainColor?: boolean;
  colors?: string[];
  effect?: {
    name: string;
    settings: EffectSettings;
  } | null;
  shape: ShapeType;
  roundedCorners: number;
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
  border: {
    style: ShapeBorderStyle;
    weight: number;
    color: string;
  } | null;
  scale: number;
  fill?: "color" | "image";
  usingMainColor?: boolean;
  textWidth: number;
  textHeight: number;
  textPosX: number;
  textPosY: number;
}

export const ShapeContent: FC<ShapeContentProps & { isEditing?: boolean }> = ({
  isEditing,
  text,
  layerId,
  boxSize,
  shape,
  color,
  gradientBackground,
  image,
  roundedCorners = 0,
  scale = 1,
  border,
  fill = "color",
  textWidth,
  textHeight,
  textPosX,
  textPosY,
}) => {
  const getDashArray = () => {
    switch (border?.style) {
      case "longDashes":
        return `${border.weight * 6}, ${border.weight}`;
      case "shortDashes":
        return `${border.weight * 3}, ${border.weight}`;
      case `dots`:
        return `${border.weight}, ${border.weight}`;
      default:
        return undefined;
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: boxSize.width / scale,
        height: boxSize.height / scale,
        overflow: "visible",
      }}
    >
      <div
        style={{
          clipPath: `path("${getShapePath(shape, {
            width: boxSize.width / scale,
            height: boxSize.height / scale,
            roundedCorners,
          })}")`,
          width: "100%",
          height: "100%",
          background: gradientBackground
            ? getGradientBackground(
                gradientBackground.colors,
                gradientBackground.style
              )
            : color || "#fff",
        }}
      >
        {fill === "image" && image && (
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

      {border && (
        <svg
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          viewBox={`0 0 ${boxSize.width / scale} ${boxSize.height / scale}`}
        >
          {roundedCorners && (
            <defs>
              <clipPath id={`roundedCorners_${layerId}`}>
                <path
                  d={getShapePath(shape, {
                    width: boxSize.width / scale,
                    height: boxSize.height / scale,
                    roundedCorners,
                  })}
                />
              </clipPath>
            </defs>
          )}
          <path
            clipPath={`url(#roundedCorners_${layerId})`}
            d={getShapePath(shape, {
              width: boxSize.width / scale,
              height: boxSize.height / scale,
              roundedCorners,
            })}
            fill={"none"}
            stroke={border.color}
            strokeDasharray={getDashArray()}
            strokeLinecap={"butt"}
            strokeWidth={border.weight / 2}
          />
        </svg>
      )}

      <div
        className={`lidojs-text`}
        style={{
          position: "absolute",
          top: textPosY / scale,
          left: textPosX / scale,
          width: textWidth / scale,
          height: textHeight / scale,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: isEditing ? 0 : 1,
          overflowWrap: "break-word",
        }}
      >
        {parse(text ?? "")}
      </div>
    </div>
  );
};
