import { Delta } from "@lidojs/design-core";

export type DragCallback = (
  e: MouseEvent | TouchEvent,
  position: Delta
) => void;
