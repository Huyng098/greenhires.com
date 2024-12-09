import {
  BoxData,
  BoxSize,
  CursorPosition,
  Delta,
  FontData,
  LayerId,
} from "@lidojs/design-core";
import { TextEditor } from "../common/text-editor/interfaces";
import { ActionMethods } from "../editor/actions";
import { QueryMethods } from "../editor/query";
import { HorizontalGuideline, VerticalGuideline } from "./common";
import { Page } from "./page";
import { Direction, LinePosition } from "./resize";

export type ImageEditorData = {
  layerId: LayerId;
  pageIndex: number;
  position: Delta;
  rotate: number;
  boxSize: BoxSize;
  image?: {
    url: string;
    position: Delta;
    rotate: number;
    boxSize: BoxSize;
  } | null;
  video?: {
    url: string;
    position: Delta;
    rotate: number;
    boxSize: BoxSize;
  } | null;
};
export type SidebarType =
  | "TEXT_EFFECT"
  | "FONT_FAMILY"
  | "LAYER_MANAGEMENT"
  | "CHOOSING_COLOR"
  | "CHOOSING_SHAPE_COLOR"
  | "CHOOSING_SHAPE_BORDER_COLOR"
  | "CHOOSING_COLOR_TEXT_SHAPE";

export interface EditorState {
  scale: number;
  selectedLayers: Record<number, LayerId[]>;
  hoveredLayer: Record<number, LayerId | null>;
  openMenu: {
    clientX: number;
    clientY: number;
  } | null;
  imageEditor?: ImageEditorData;
  textEditor?: {
    pageIndex: number;
    layerId: LayerId;
    editor: TextEditor | null;
  };
  textEditorSize?: {
    width: number;
    height: number;
    posX: number;
    posY: number;
  };
  controlBox?: BoxData;
  guideline: {
    horizontal: HorizontalGuideline[];
    vertical: VerticalGuideline[];
  };
  activePage: number;
  pages: Page[];
  sidebar: SidebarType | null;
  fontList: FontData[];
  resizeData: {
    status: boolean;
    layerIds?: LayerId[];
    direction?: Direction;
    rotate?: number;
    boxSize?: BoxSize;
    cursor?: CursorPosition;
  };
  updateLineData: {
    status: boolean;
    layerId?: LayerId;
    linePosition?: LinePosition;
  };
  selectData: {
    status: boolean;
  };
  dragData: {
    status: boolean;
    layerIds?: LayerId[];
    position?: Delta;
    cursor?: CursorPosition;
  };
  rotateData: {
    status: boolean;
    rotate?: number;
    cursor?: CursorPosition;
  };
  pageDOMRect?: DOMRect;
}

export type CoreEditorActions = ReturnType<typeof ActionMethods>;

export type HistoryActions = {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  new: () => void;
  ignore: () => CoreEditorActions;
  merge: () => CoreEditorActions;
  throttle: (rate: number) => CoreEditorActions;
  back: () => void;
};

export type CoreEditorQuery = ReturnType<typeof QueryMethods>;

export interface EditorQuery extends CoreEditorQuery {
  history: {
    canUndo: () => boolean;
    canRedo: () => boolean;
  };
}

export type EditorActions = CoreEditorActions & {
  history: HistoryActions;
};
