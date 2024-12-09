import {
  BoxSize,
  Delta,
  LayerComponentProps,
  LayerId,
  LayerType,
} from "@lidojs/design-core";
import { FunctionComponent, ReactElement } from "react";
import { TextEditor } from "../common/text-editor/interfaces";
import { DeepPartial } from "./common";
import { EditorActions, EditorState } from "./editor";

export type ContextMenuItem = {
  value: string;
  label: string | ReactElement;
  execute: (data: {
    pageIndex: number;
    layerId: LayerId;
    state: EditorState;
    actions: EditorActions;
  }) => void;
};

export type LayerInfo = {
  name: string;
  type: LayerType | "Section" | "Item" | "Resume";
  contextMenu?: ContextMenuItem[];
};

export interface LayerComponent<P extends LayerComponentProps>
  extends FunctionComponent<P> {
  info: LayerInfo;
}

export type LayerActions = {
  setProp: <P extends LayerComponentProps>(props: DeepPartial<P>) => void;
  select: () => void;
  hover: (v?: null) => void;
  setTextEditor: (editor: TextEditor) => void;
  setTextEditorSize: (
    width: number,
    height: number,
    posX: number,
    posY: number
  ) => void;
  openTextEditor: () => void;
  openGroupEditor: (textLayerId: string) => void;
  openImageEditor: (data: {
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
  }) => void;
};

export type LayerData<P extends LayerComponentProps> = LayerInfo & {
  comp: LayerComponent<P>;
  props: P;
  locked: boolean;
  parent: LayerId | null;
  child: LayerId[];
  editor?: TextEditor;
};
export type Layer<P extends LayerComponentProps> = {
  id: LayerId;
  data: LayerData<P>;
};

export type LayerDataRef = Record<
  LayerId,
  Pick<LayerComponentProps, "position" | "boxSize" | "rotate" | "scale"> & {
    centerX?: number;
    centerY?: number;
    type: LayerType | "Section" | "Item" | "Resume";
  }
>;

export type Layers = Record<LayerId, Layer<LayerComponentProps>>;
