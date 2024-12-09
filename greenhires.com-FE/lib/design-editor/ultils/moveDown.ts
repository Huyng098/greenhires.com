import { EditorActions, EditorState } from "../types";
import { isCanCollide } from "./colision";

export const moveDownCollision = (
  state: EditorState,
  actions: EditorActions,
  current_id: string,
  ids: string[],
  dy: number,
  isCheckSameParent = true
) => {
  const layers = state.pages[state.activePage].layers;
  ids.map((id) => {
    if (
      current_id !== id &&
      isCanCollide(layers[current_id].data, layers[id].data, isCheckSameParent)
    ) {
      actions.moveDownByDeltaY(id, dy);
    }
  });
};
