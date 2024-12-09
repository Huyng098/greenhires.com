import { Command } from "prosemirror-state";
import { setMark } from "./setMark";
import { toggleMark } from "./toggleMark";
import { unsetMark } from "./unsetMark";

export const toggleItalic: Command = (...params) => {
  return toggleMark("italic")(...params);
};
export const unsetItalic: Command = (...params) => {
  return unsetMark("italic")(...params);
};
export const setItalic: Command = (...params) => {
  return setMark("italic")(...params);
};
export const unsetItalicOfBlock: Command = (state, dispatch) => {
  const { $from, $to } = state.selection;
  const nodeRange = $from.blockRange($to);
  if (nodeRange && dispatch) {
    const mark = state.schema.mark("bold");
    dispatch(state.tr.removeMark(nodeRange.start, nodeRange.end, mark));
    return true;
  }
  return false;
};
