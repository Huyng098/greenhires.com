"use client";
import { BoxSize, Delta } from "@lidojs/design-core";
import { ShapeContent, ShapeContentProps } from "@lidojs/design-layers";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createEditor } from "../common/text-editor/core/helper/createEditor";
import { EditorContext } from "../editor/EditorContext";
import { useEditor, useSelectedLayers } from "../hooks";
import { useLayer } from "../hooks/useLayer";
import { LayerComponent } from "../types";
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

const ShapeLayer: LayerComponent<ShapeLayerProps> = ({
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
  const { actions, id, pageIndex } = useLayer();
  const { selectedLayerIds, selectedLayers } = useSelectedLayers();

  const { textEditor } = useEditor((state) => ({
    textEditor: state.textEditor,
  }));
  const [imageData, setImageData] = useState<FrameLayerProps["image"]>(null);

  const handleStartUpdateShape = useCallback(() => {
    if (selectedLayers[0].data.locked) return;
    actions.openTextEditor();
    actions.setTextEditorSize(textWidth, textHeight, textPosX, textPosY);
  }, [actions, id, selectedLayerIds]);

  useEffect(() => {
    const editor = createEditor({ content: text ?? "" });
    editor && actions.setTextEditor(editor);
    // editor shouldn't re-create
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        config.frame.defaultImage.width / config.frame.defaultImage.height;
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
        url: config.frame.defaultImage.url,
        thumb: config.frame.defaultImage.url,
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
    config.frame.defaultImage.width,
    config.frame.defaultImage.height,
    config.frame.defaultImage.url,
    boxSize.width,
    boxSize.height,
    scale,
  ]);

  const isEditing = useMemo(() => {
    if (!textEditor) return false;
    return textEditor.pageIndex === pageIndex && textEditor.layerId === id;
  }, [id, pageIndex, textEditor]);
  return (
    <div
      style={{
        transformOrigin: "0 0",
        width: boxSize.width / (scale || 1),
        height: boxSize.height / (scale || 1),
        transform: `scale(${scale || 1})`,
      }}
      onDoubleClick={handleStartUpdateShape}
    >
      <ShapeContent
        isEditing={isEditing}
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

ShapeLayer.info = {
  name: "Shape",
  type: "Shape",
};
export default ShapeLayer;
