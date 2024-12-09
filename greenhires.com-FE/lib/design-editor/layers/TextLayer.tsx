"use client";
import { TextContent, TextContentProps } from "@lidojs/design-layers";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { createEditor } from "../common/text-editor/core/helper/createEditor";
import { useEditor, useLayer, useSelectedLayers } from "../hooks";
import { LayerComponent } from "../types";

export type TextLayerProps = TextContentProps;

const TextLayer: LayerComponent<TextLayerProps> = ({
  text,
  boxSize,
  scale,
  fonts,
  colors,
  fontSizes,
  effect,
  rotate,
  position,
  ...props
}) => {
  const { actions, id, pageIndex } = useLayer();
  const { selectedLayerIds, selectedLayers } = useSelectedLayers();
  const pathname = usePathname();
  const { textEditor } = useEditor((state) => ({
    textEditor: state.textEditor,
    activePage: state.activePage,
  }));

  useEffect(() => {
    const editor = createEditor({ content: text });
    editor && actions.setTextEditor(editor);
    // editor shouldn't re-create
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleStartUpdate = useCallback(() => {
    if (selectedLayerIds.includes(id) && !selectedLayers[0].data.locked) {
      actions.openTextEditor();
    }
  }, [actions, id, selectedLayerIds]);

  const isEditing = useMemo(() => {
    if (!textEditor) return false;
    return textEditor.pageIndex === pageIndex && textEditor.layerId === id;
  }, [id, pageIndex, textEditor]);

  return (
    <div
      style={{
        transformOrigin: "0 0",
        width: boxSize.width / scale,
        height: boxSize.height / scale,
        transform: `scale(${scale})`,
        opacity: isEditing ? 0 : 1,
        overflowWrap: "break-word",
      }}
      onDoubleClick={handleStartUpdate}
    >
      <TextContent
        boxSize={boxSize}
        colors={colors}
        effect={effect}
        fontSizes={fontSizes}
        fonts={fonts}
        position={position}
        rotate={rotate}
        scale={scale}
        text={text}
        {...props}
      />
    </div>
  );
};

TextLayer.info = {
  name: "Text",
  type: "Text",
};

export default TextLayer;
