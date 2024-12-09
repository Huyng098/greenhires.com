import { TextContentProps } from "@/lib/design-layers";
import { useEventCallback } from "@lidojs/design-core";
import React, { FC, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import { useEditor } from "../../hooks";
import { Layer } from "../../types";
import { isTextLayer } from "../../ultils/layer/layers";
import { selectText } from "./core/command/selectText";
import { createEditor } from "./core/helper/createEditor";
import { TextEditor } from "./interfaces";

interface EditorContentProps {
  editor: TextEditor;
  layer: Layer<TextContentProps>;
}

const EditorContent: FC<EditorContentProps> = ({ editor, layer }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { actions, state } = useEditor();

  const initEditor = useEventCallback(() => {
    actions.history.new();
    const editingEditor = createEditor({
      content: editor.dom.innerHTML,
      ele: ref.current,
      handleDOMEvents: {
        blur: () => {
          isMobile && actions.closeTextEditor();
          if (editor.dom.innerText === "" && isTextLayer(layer)) {
            actions.deleteLayer(state.activePage, layer.id);
          }
        },
      },
    });
    selectText({
      from: editingEditor.state.doc.content.size,
      to: editingEditor.state.doc.content.size,
    })(editingEditor.state, editingEditor.dispatch);
    editingEditor.focus();
    actions.setOpeningEditor(editingEditor);
  })!;

  useEffect(() => {
    initEditor();
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflowWrap: "break-word",
        // padding: "5px",
      }}
      ref={ref}
    ></div>
  );
};
export default React.memo(EditorContent);
