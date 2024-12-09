import { useContext, useEffect } from "react";
import { EditorContext } from "../editor/EditorContext";
import { EditorQuery, EditorState } from "../types";

export const useEditor = <C>(
  collector?: (s: EditorState, query: EditorQuery) => C
) => {
  const store = useContext(EditorContext);
  const { actions, getState, query } = store;
  const collected = collector ? collector(store.getState(), query) : ({} as C);
  return {
    ...collected,
    actions,
    query,
    state: getState(),
  };
};
