import {
  EffectSettings,
  getTransformStyle,
  LayerId,
} from "@lidojs/design-core";
import { getTextEffectStyle } from "@lidojs/design-layers";
import React, { useEffect, useMemo, useState } from "react";
import { useEditor } from "../../hooks";
import { TextLayerProps } from "../../layers";
import { Layer } from "../../types";
import { deltaPositionGroup } from "../../ultils/delta-position-group";
import {
  isItemLayer,
  isSectionLayer
} from "../../ultils/layer/layers";
import { moveDownCollision } from "../../ultils/moveDown";
import EditorContent from "./EditorContent";

interface CustomStyleProps extends React.CSSProperties {
  "&:before"?: React.CSSProperties;
}

const TextEditor = () => {
  const { editorScale, actions, layer, state } = useEditor((state) => {
    const textEditor = state.textEditor as {
      pageIndex: number;
      layerId: LayerId;
    };
    const layer = state.pages[textEditor.pageIndex].layers[
      textEditor.layerId
    ] as unknown as Layer<TextLayerProps>;
    return {
      editorScale: state.scale,
      textEditor,
      layer,
    };
  });

  if (!layer) return null;

  const {
    boxSize,
    position,
    scale,
    rotate,
    transparency,
    effect,
    colors,
    fontSizes,
  } = layer.data.props;

  const {
    width: editorWidth,
    height: editorHeight,
    posX: editorX,
    posY: editorY,
  } = state.textEditorSize
    ? state.textEditorSize
    : {
        width: boxSize.width,
        height: boxSize.height,
        posX: 0,
        posY: 0,
      };

  const [color] = colors || [];
  const [fontSize] = fontSizes || [];

  const { dx, dy } = useMemo(() => {
    return deltaPositionGroup(state, layer as Layer<any>);
  }, [layer.data.parent, state.pages, state.activePage]);

  const customStyle: CustomStyleProps = useMemo(
    () => ({
      ...getTextEffectStyle(
        effect?.name || "none",
        effect?.settings as EffectSettings,
        color,
        fontSize
      ),
      "&:before": {
        ...getTextEffectStyle(
          effect?.name || "none",
          effect?.settings as EffectSettings,
          color,
          fontSize
        ),
      },
    }),
    [effect, color, fontSize]
  );
  const [preBoxSizeHeight, setPreBoxSizeHeight] = useState<null | number>(null);

  useEffect(() => {
    if (layer) {
      const { boxSize } = layer.data.props;
      setPreBoxSizeHeight(boxSize.height);
      const layers = state.pages[state.activePage].layers;
      if (preBoxSizeHeight) {
        if (layer.data.parent && layer.data.parent !== "ROOT") {
          if (isSectionLayer(layers[layer.data.parent])) {
            const childs = layers[layer.data.parent].data.child;
            moveDownCollision(
              state,
              actions,
              layer.id,
              childs,
              boxSize.height - preBoxSizeHeight
            );
          } else if (isItemLayer(layers[layer.data.parent])) {
            const section_id = layer.id.includes("basics")
              ? "basics"
              : `sections.${layer.id.split(".")[1]}`;
            const childs_of_section = layers[section_id].data.child;
            const childs_of_item = layers[layer.data.parent].data.child;
            const childs = [
              ...childs_of_section.filter((id) => id !== layer.data.parent),
              ...childs_of_item,
            ];
            moveDownCollision(
              state,
              actions,
              layer.id,
              childs,
              boxSize.height - preBoxSizeHeight
            );
          }
        }
      }
    }
  }, [layer.data.props.boxSize.height]);

  // console.log("boxSize", boxSize);

  return (
    <div
      style={{
        touchAction: "pan-x pan-y pinch-zoom",
        pointerEvents: "auto",
        position: "absolute",
        width: editorWidth * editorScale,
        height: editorHeight * editorScale,
        outline: "none",
        transform: getTransformStyle({
          position: {
            x: (position.x + dx) * editorScale,
            y: (position.y + dy) * editorScale,
          },
          rotate,
        }),
        opacity: transparency,
        top: editorScale * editorY,
        left: editorScale * editorX,
        ...customStyle,
      }}
    >
      <div
        style={{
          width: editorWidth / scale,
          height: editorHeight / scale,
          transform: `scale(${scale * editorScale})`,
          transformOrigin: "0 0",
          fontSize,
          color,
          outline: "none",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {layer.data.editor && (
          <EditorContent editor={layer.data.editor} layer={layer} />
        )}
      </div>
    </div>
  );
};

export default TextEditor;
