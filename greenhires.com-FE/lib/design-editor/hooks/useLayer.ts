"use client";
import { LayerComponentProps } from "@lidojs/design-core";
import { useContext, useMemo } from "react";
import { LayerContext } from "../layers/core/LayerContext";
import { PageContext } from "../layers/core/PageContext";
import { Layer, LayerActions } from "../types";
import { useEditor } from "./useEditor";

export const useLayer = <P extends LayerComponentProps, C>(
  collector?: (layer: Layer<P>) => C
) => {
  const { pageIndex } = useContext(PageContext);
  const { id } = useContext(LayerContext);
  const {
    state,
    actions: editorActions,
    ...collected
  } = useEditor((state) => {
    return (
      collector &&
      state.pages[pageIndex] &&
      state.pages[pageIndex].layers[id] &&
      collector(state.pages[pageIndex].layers[id] as unknown as Layer<P>)
    );
  });
  const actions = useMemo<LayerActions>(
    () => ({
      setProp: (props) => editorActions.setProp(pageIndex, id, props),
      select: () => editorActions.selectLayers(pageIndex, id),
      hover: (v) =>
        editorActions.hoverLayer(
          pageIndex,
          typeof v === "undefined" ? id : null
        ),
      setTextEditor: (editor) =>
        editorActions.setTextEditor(pageIndex, id, editor),
      openTextEditor: () => editorActions.openTextEditor(pageIndex, id),
      setTextEditorSize: (width, height, posX, posY) =>
        editorActions.setTextEditorSize(width, height, posX, posY),
      openGroupEditor: (textLayerId: string) =>
        editorActions.openTextEditor(pageIndex, textLayerId),
      openImageEditor: ({ boxSize, position, rotate, image, video }) =>
        editorActions.openImageEditor(pageIndex, id, {
          boxSize,
          position,
          rotate,
          image,
          video,
        }),
    }),
    [editorActions, pageIndex, id]
  );
  return {
    ...collected,
    pageIndex,
    id,
    state,
    actions,
  };
};
