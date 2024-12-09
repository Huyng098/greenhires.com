import { useEventCallback } from "@lidojs/design-core";
import { baseKeymap } from "prosemirror-commands";
import { gapCursor } from "prosemirror-gapcursor";
import { history } from "prosemirror-history";
import { DOMParser, Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorProps, EditorView } from "prosemirror-view";
import { TextEditor } from "../../interfaces";
import { buildKeyMap } from "../plugins/buildKeyMap";
import events from "../plugins/events";
import { buildInputRules } from "../plugins/inputrules";
import { keymap } from "../plugins/keymap";
import { schema } from "../schema/schema";
import { EventEmitter } from "./EventEmitter";

const editorSchema = new Schema({
  nodes: schema.spec.nodes,
  marks: schema.spec.marks,
});
export const createEditor = ({
  content,
  ele = null,
  handleDOMEvents = {},
}: {
  content: string;
  ele?: HTMLDivElement | null;
  handleDOMEvents?: EditorProps["handleDOMEvents"];
}) => {
  const div = document.createElement("div");
  div.innerHTML = content;
  const state = EditorState.create({
    doc: DOMParser.fromSchema(editorSchema).parse(div),
    plugins: [
      buildInputRules(editorSchema),
      keymap(buildKeyMap(editorSchema)),
      keymap(baseKeymap),
      gapCursor(),
      history(),
      events(),
    ],
  });
  const editor = new EditorView(ele, {
    attributes: { class: "lidojs-text" },
    state,
    handleDOMEvents,
  }) as TextEditor;
  editor.events = new EventEmitter();
  return editor;
};

export const useCreateEditor = () =>
  useEventCallback((data: any) => createEditor(data));
