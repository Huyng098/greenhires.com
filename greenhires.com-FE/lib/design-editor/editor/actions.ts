import {
  boundingRect,
  BoxData,
  BoxSize,
  CursorPosition,
  Delta,
  FontData,
  getControlBoxSizeFromLayers,
  getPositionWhenLayerCenter,
  LayerComponentProps,
  LayerId,
  PageSize,
  positionOfObjectInsideAnother,
  SerializedLayer,
  SerializedLayerTree,
  SerializedPage,
} from "@lidojs/design-core";

import {
  FrameContentProps,
  LineContentProps,
  ShapeContentProps,
  SvgContentProps,
  TextContentProps,
} from "@/lib/design-layers";
import { Section } from "@/modules/Canva/Sidebar/data/resume-component";
import { Color, mergeWithoutArray } from "@lidojs/design-utils";
import { cloneDeep, isArray, uniq } from "lodash";
import { TextEditor } from "../common/text-editor/interfaces";
import { GroupLayerProps, RootLayerProps } from "../layers";
import {
  CoreEditorQuery,
  DeepPartial,
  Direction,
  EdgeDirection,
  EditorState,
  HorizontalGuideline,
  Layer,
  Layers,
  LinePosition,
  Page,
  SidebarType,
  VerticalGuideline,
} from "../types";
import {
  deserializeLayer,
  getBoundingBoxGroup,
  getRandomId,
  isFrameLayer,
  isGroupLayer,
  isImageLayer,
  isMainLayer,
  isRootLayer,
  isSectionLayer,
  isTextLayer,
  serializeItem,
  serializeLayers,
} from "../ultils/layer/layers";
import { getShapeTextSize } from "@/lib/design-layers/layers/shape-text";
import { isShapeType } from "@/lib/utils";

export const ActionMethods = (state: EditorState, query: CoreEditorQuery) => {
  const addLayerTreeToParent = (
    pageIndex: number,
    { rootId, layers }: SerializedLayerTree,
    parentId: LayerId = "ROOT",
    item_id: LayerId = "",
    custom_id?: LayerId,
    layout_id?: LayerId
  ) => {
    const decodeLayer = (
      serializedLayer: SerializedLayer,
      parentId: LayerId,
      rootId: string = "",
      item_id: string = "",
      custom_id: string = "",
      layout_id?: string
    ) => {
      let newId: string;
      if (item_id) {
        newId = rootId.replace("{humantree_id}", item_id);
      } else if (layout_id) {
        newId = layout_id;
      } else {
        newId = getRandomId();
      }
      newId = newId.replace("{custom_id}", custom_id);
      return {
        id: newId,
        data: deserializeLayer({
          ...serializedLayer,
          parent: parentId,
          child: [],
        }),
      };
    };

    const layer = decodeLayer(
      layers[rootId],
      parentId,
      rootId,
      item_id,
      custom_id,
      layout_id
    );

    const deserializeChild = (layerId: LayerId, newParentId: LayerId) => {
      const res: [LayerId, Layer<LayerComponentProps>][] = [];
      layers[layerId].child.forEach((childId) => {
        const childLayer = decodeLayer(
          layers[childId],
          newParentId,
          childId,
          item_id
        );
        res.push([childLayer.id, childLayer]);
        layer.data.child.push(childLayer.id);
      });
      return res;
    };

    const child = deserializeChild(rootId, layer.id);

    const layerList: Layers = Object.fromEntries([[layer.id, layer], ...child]);
    Object.entries(layerList).forEach(([layerId, layer]) => {
      state.pages[state.activePage].layers[layerId] = layer;
    });

    state.pages[pageIndex].layers[parentId].data.child.push(layer.id);
    return layer;
  };
  return {
    setProp<T extends LayerComponentProps>(
      pageIndex: number,
      layerId: LayerId | LayerId[],
      props: DeepPartial<T>,
      customizer?: (objVal: unknown, srcVal: unknown) => unknown
    ) {
      const ids: LayerId[] = [];
      if (isArray(layerId)) {
        ids.push(...layerId);
      } else {
        ids.push(layerId);
      }
      ids.forEach((id) => {
        try {
          state.pages[pageIndex].layers[id].data.props = mergeWithoutArray(
            state.pages[pageIndex].layers[id].data.props,
            props,
            customizer
          );
        } catch (e) {
          console.log("Hic: ", ids, pageIndex);
        }
      });
    },
    moveSelectedLayers: (direction: EdgeDirection, value: number) => {
      state.controlBox = undefined;
      (state.selectedLayers[state.activePage] || []).forEach((layerId) => {
        if (direction === "right") {
          state.pages[state.activePage].layers[layerId].data.props.position.x +=
            value;
        } else if (direction === "left") {
          state.pages[state.activePage].layers[layerId].data.props.position.x -=
            value;
        } else if (direction === "top") {
          state.pages[state.activePage].layers[layerId].data.props.position.y -=
            value;
        } else if (direction === "bottom") {
          state.pages[state.activePage].layers[layerId].data.props.position.y +=
            value;
        }
      });
    },
    changePageSize: (size: PageSize) => {
      const changeW = size.width - query.getPageSize().width;
      const changeH = size.height - query.getPageSize().height;
      const pageRatio = size.width / size.height;
      state.pages.forEach((page) => {
        Object.entries(page.layers).forEach(([, layer]) => {
          if (!isRootLayer(layer) && isMainLayer(layer)) {
            layer.data.props.position.x += changeW / 2;
            layer.data.props.position.y += changeH / 2;
          }
          if (isRootLayer(layer)) {
            layer.data.props.boxSize = size;
            if (layer.data.props.image) {
              const imageRatio =
                layer.data.props.image.boxSize.width /
                layer.data.props.image.boxSize.height;
              if (imageRatio > pageRatio) {
                //use image height
                layer.data.props.image.boxSize.height = size.height;
                layer.data.props.image.boxSize.width = size.height * imageRatio;
              } else {
                layer.data.props.image.boxSize.width = size.width;
                layer.data.props.image.boxSize.height = size.width / imageRatio;
              }
              layer.data.props.image.position.y =
                (size.height - layer.data.props.image.boxSize.height) / 2;
              layer.data.props.image.position.x =
                (size.width - layer.data.props.image.boxSize.width) / 2;
            }
          }
        });
      });
    },
    setScale: (scale: number) => {
      state.scale = scale;
    },
    setGuideline: ({
      vertical,
      horizontal,
    }: {
      vertical: VerticalGuideline[];
      horizontal: HorizontalGuideline[];
    }) => {
      state.guideline.vertical = vertical;
      state.guideline.horizontal = horizontal;
    },
    selectLayers(
      pageIndex: number,
      layerIds: LayerId | LayerId[],
      type: "replace" | "add" = "replace"
    ) {
      const ids = typeof layerIds === "object" ? layerIds : [layerIds];
      state.textEditor = undefined;
      state.imageEditor = undefined;
      if (pageIndex !== state.activePage) {
        state.selectedLayers = {};
      }
      if (
        type === "replace" ||
        (state.selectedLayers[pageIndex] &&
          state.selectedLayers[pageIndex].includes("ROOT")) ||
        ids.includes("ROOT")
      ) {
        state.selectedLayers = {
          [pageIndex]: ids,
        };
        const hoverLayer = state.hoveredLayer[pageIndex];
        if (hoverLayer && ids.includes(hoverLayer)) {
          state.hoveredLayer = {
            [pageIndex]: null,
          };
        }
      } else {
        state.selectedLayers[pageIndex] = uniq([
          ...(state.selectedLayers[pageIndex] || []),
          ...ids,
        ]);
      }
      state.activePage = pageIndex;
    },
    selectAllLayers: () => {
      state.imageEditor = undefined;
      state.textEditor = undefined;
      state.selectedLayers = {
        [state.activePage]: Object.entries(
          state.pages[state.activePage].layers
        ).reduce((acc, [id, layer]) => {
          if (layer.data.parent === "ROOT") {
            acc.push(id);
          }
          return acc;
        }, [] as LayerId[]),
      };
    },
    resetSelectLayer: () => {
      state.selectedLayers = {};
      state.hoveredLayer = {};
      state.textEditor = undefined;
      state.imageEditor = undefined;
    },
    moveLayersToPage(pageIdx: number, layers: SerializedLayerTree[]) {
      layers.forEach((layer) => {
        Object.entries(layer.layers).forEach(([layerId, layer]) => {
          if (layer.parent === "ROOT")
            state.pages[pageIdx].layers.ROOT.data.child.push(layerId);
          state.pages[pageIdx].layers[layerId] = {
            id: layerId,
            data: deserializeLayer(layer),
          };
        });
      });
    },
    hoverLayer: (pageIndex: number, layerId: LayerId | null) => {
      state.hoveredLayer = {
        [pageIndex]: layerId,
      };
    },
    setAlign(
      alignment: "left" | "right" | "center" | "top" | "bottom" | "middle"
    ) {
      const getChangeX = (box: BoxData, layer: Layer<LayerComponentProps>) => {
        const rect = boundingRect(
          layer.data.props.boxSize,
          layer.data.props.position,
          layer.data.props.rotate
        );
        if (alignment === "left") {
          return (
            box.position.x - (layer.data.props.boxSize.width - rect.width) / 2
          );
        } else if (alignment === "right") {
          return (
            box.position.x +
            box.boxSize.width -
            rect.width -
            (layer.data.props.boxSize.width - rect.width) / 2
          );
        } else {
          return (
            box.position.x +
            (box.boxSize.width - layer.data.props.boxSize.width) / 2
          );
        }
      };
      const getChangeY = (box: BoxData, layer: Layer<LayerComponentProps>) => {
        const rect = boundingRect(
          layer.data.props.boxSize,
          layer.data.props.position,
          layer.data.props.rotate
        );
        if (alignment === "top") {
          return (
            box.position.y - (layer.data.props.boxSize.height - rect.height) / 2
          );
        } else if (alignment === "bottom") {
          return (
            box.position.y +
            box.boxSize.height -
            rect.height -
            (layer.data.props.boxSize.height - rect.height) / 2
          );
        } else {
          return (
            box.position.y +
            (box.boxSize.height - layer.data.props.boxSize.height) / 2
          );
        }
      };
      const layers = state.selectedLayers[state.activePage].map((layerId) => {
        return state.pages[state.activePage].layers[layerId];
      });
      if (layers.length === 1) {
        if (["left", "right", "center"].includes(alignment)) {
          const newX = getChangeX(
            state.pages[state.activePage].layers.ROOT.data.props,
            layers[0]
          );
          state.pages[state.activePage].layers[
            layers[0].id
          ].data.props.position.x = newX;
          if (state.controlBox) {
            state.controlBox.position.x = newX;
          }
        } else {
          const newY = getChangeY(
            state.pages[state.activePage].layers.ROOT.data.props,
            layers[0]
          );
          state.pages[state.activePage].layers[
            layers[0].id
          ].data.props.position.y = newY;
          if (state.controlBox) {
            state.controlBox.position.y = newY;
          }
        }
      } else if (layers.length > 1) {
        const layerData = layers.reduce(
          (acc, layer) => {
            acc[layer.id] = layer.data.props;
            return acc;
          },
          {} as Record<LayerId, LayerComponentProps>
        );
        const currentRect = getControlBoxSizeFromLayers(layerData) as BoxData;
        const newLayerData: Record<LayerId, LayerComponentProps> = {};
        layers.forEach((layer) => {
          if (["left", "right", "center"].includes(alignment)) {
            state.pages[state.activePage].layers[
              layer.id
            ].data.props.position.x = getChangeX(currentRect, layer);
          } else {
            state.pages[state.activePage].layers[
              layer.id
            ].data.props.position.y = getChangeY(currentRect, layer);
          }
          newLayerData[layer.id] =
            state.pages[state.activePage].layers[layer.id].data.props;
        });
        state.controlBox = getControlBoxSizeFromLayers(newLayerData);
      }
    },
    setTextEditor: (
      pageIndex: number,
      layerId: LayerId,
      editor: TextEditor
    ) => {
      state.pages[pageIndex].layers[layerId].data.editor = editor;
    },
    setData: (serializedPages: SerializedPage[]) => {
      console.log(serializedPages);
      state.activePage = 0;
      state.selectedLayers = {};
      state.hoveredLayer = {};
      const pages: Page[] = [];
      const decodeLayer = (
        serializedLayer: SerializedLayer,
        parentId: LayerId | null,
        defaultId: LayerId | null
      ) => {
        const newId =
          serializedLayer.parent === null ? "ROOT" : defaultId || getRandomId();
        return {
          id: newId,
          data: deserializeLayer({
            ...serializedLayer,
            parent: parentId,
            child: [],
          }),
        };
      };
      serializedPages?.forEach((serializedPage) => {
        const page: Page = {
          layers: {},
        };

        page.layers.ROOT = decodeLayer(serializedPage.layers.ROOT, null, null);
        const deserializeChild = (layerId: LayerId, newLayerId: LayerId) => {
          const res: [LayerId, Layer<LayerComponentProps>][] = [];
          serializedPage.layers[layerId].child.forEach((childId) => {
            const childLayer = decodeLayer(
              serializedPage.layers[childId],
              newLayerId,
              childId
            );
            res.push([childLayer.id, childLayer]);
            page.layers[childLayer.id] = childLayer;
            page.layers[newLayerId].data.child.push(childLayer.id);
            if (serializedPage.layers[childId].child.length > 0) {
              res.push(...deserializeChild(childId, childLayer.id));
            }
          });
          return res;
        };
        const child = deserializeChild("ROOT", "ROOT");
        const layerList: Layers = Object.fromEntries(child);
        Object.entries(layerList).forEach(([layerId, layer]) => {
          page.layers[layerId] = layer;
        });
        pages.push(page);
      });
      state.pages = pages;
    },
    setPage: (pageIndex: number, serializedPage: SerializedPage) => {
      const page: Page = {
        layers: {},
      };
      const decodeLayer = (
        serializedLayer: SerializedLayer,
        parentId: LayerId | null,
        defaultId: LayerId | null
      ) => {
        const newId =
          serializedLayer.parent === null ? "ROOT" : defaultId || getRandomId();
        return {
          id: newId,
          data: deserializeLayer({
            ...serializedLayer,
            parent: parentId,
            child: [],
          }),
        };
      };

      page.layers.ROOT = decodeLayer(serializedPage.layers.ROOT, null, null);
      const deserializeChild = (layerId: LayerId, newLayerId: LayerId) => {
        const res: [LayerId, Layer<LayerComponentProps>][] = [];
        serializedPage.layers[layerId].child.forEach((childId) => {
          const childLayer = decodeLayer(
            serializedPage.layers[childId],
            newLayerId,
            childId
          );
          res.push([childLayer.id, childLayer]);
          page.layers[childLayer.id] = childLayer;
          page.layers[newLayerId].data.child.push(childLayer.id);
          if (serializedPage.layers[childId].child.length > 0) {
            res.push(...deserializeChild(childId, childLayer.id));
          }
        });
        return res;
      };
      const child = deserializeChild("ROOT", "ROOT");
      const layerList: Layers = Object.fromEntries(child);
      Object.entries(layerList).forEach(([layerId, layer]) => {
        page.layers[layerId] = layer;
      });
      state.selectedLayers = {};
      state.pages[pageIndex] = page;
    },
    setActivePage(pageIndex: number) {
      state.selectedLayers = {};
      state.hoveredLayer = {};
      state.textEditor = undefined;
      state.activePage = pageIndex;
    },
    deleteLayer: (pageIndex: number, layerId: LayerId | LayerId[]) => {
      const ids: LayerId[] = [];
      if (typeof layerId === "object") {
        ids.push(...layerId);
      } else {
        ids.push(layerId);
      }
      state.selectedLayers[pageIndex] = state.selectedLayers[pageIndex].filter(
        (id) => !ids.includes(id)
      );

      ids.forEach((id) => {
        const parentId = state.pages[pageIndex].layers[id].data.parent;
        delete state.pages[pageIndex].layers[id];
        if (parentId && state.pages[pageIndex].layers[parentId]) {
          state.pages[pageIndex].layers[parentId].data.child = state.pages[
            pageIndex
          ].layers[parentId].data.child.filter((i) => i !== id);
        }
      });
    },
    openTextEditor(pageIndex: number, layerId: LayerId) {
      state.textEditor = {
        pageIndex,
        layerId,
        editor: null,
      };
      state.textEditorSize = undefined;
    },
    setTextEditorSize(
      width: number,
      height: number,
      posX: number,
      posY: number
    ) {
      state.textEditorSize = {
        width,
        height,
        posX,
        posY,
      };
    },
    setOpeningEditor(editor: TextEditor) {
      if (state.textEditor) {
        state.textEditor.editor = editor;
      }
    },
    closeTextEditor() {
      state.textEditor = undefined;
      state.textEditorSize = undefined;
    },
    lockPage: (pageIndex: number) => {
      state.pages[pageIndex].layers.ROOT.data.locked = true;
    },
    unlockPage: (pageIndex: number) => {
      state.pages[pageIndex].layers.ROOT.data.locked = false;
    },
    deletePage: (pageIndex: number) => {
      state.selectedLayers = {};
      state.hoveredLayer = {};
      state.pages.splice(pageIndex, 1);
    },
    duplicatePage(pageIndex: number) {
      state.textEditor = undefined;
      state.imageEditor = undefined;
      const newPage: Page = {
        layers: {},
      };
      Object.entries(
        cloneDeep(serializeLayers(state.pages[pageIndex].layers, "ROOT"))
      ).forEach(([layerId, layer]) => {
        newPage.layers[layerId] = {
          id: layerId,
          data: deserializeLayer(layer),
        };
      });
      state.pages.splice(pageIndex, 0, newPage);
      state.activePage = pageIndex + 1;
      state.selectedLayers = {
        [pageIndex + 1]: ["ROOT"],
      };
    },
    addPage: (pageIndex?: number) => {
      const page: Page = {
        layers: {},
      };
      page.layers.ROOT = {
        id: "ROOT",
        data: deserializeLayer({
          type: {
            resolvedName: "RootLayer",
          },
          props: {
            boxSize: query.getPageSize(),
            position: {
              x: 0,
              y: 0,
            },
            rotate: 0,
            color: "#fff",
            image: null,
          },
          locked: false,
          parent: null,
          child: [],
        }),
      };

      if (typeof pageIndex !== "undefined") {
        state.pages.splice(pageIndex + 1, 0, page);
        state.activePage = pageIndex + 1;
      } else {
        state.pages.push(page);
        state.activePage = state.activePage + 1;
      }
    },
    movePageUp: (pageIndex: number) => {
      const newPage = cloneDeep(state.pages[pageIndex]);
      state.pages.splice(pageIndex, 1);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.pages.splice(pageIndex - 1, 0, newPage);
      state.activePage = pageIndex - 1;
    },
    movePageDown: (pageIndex: number) => {
      const newPage = cloneDeep(state.pages[pageIndex]);
      state.pages.splice(pageIndex, 1);
      state.pages.splice(pageIndex + 1, 0, newPage);
      state.activePage = pageIndex + 1;
    },
    lock: (pageIndex: number, layerId: LayerId | LayerId[]) => {
      const ids: LayerId[] = [];
      if (typeof layerId === "object") {
        ids.push(...layerId);
      } else {
        ids.push(layerId);
      }
      ids.forEach((id) => {
        state.pages[pageIndex].layers[id].data.locked = true;
      });
    },
    unlock: (pageIndex: number, layerId: LayerId | LayerId[]) => {
      const ids: LayerId[] = [];
      if (typeof layerId === "object") {
        ids.push(...layerId);
      } else {
        ids.push(layerId);
      }
      ids.forEach((id) => {
        state.pages[pageIndex].layers[id].data.locked = false;
      });
    },
    ungroup(layerId: LayerId) {
      const activePage = state.activePage;
      const layers = state.pages[state.activePage]?.layers;
      const group = layers[layerId] as Layer<GroupLayerProps>;
      const child = layers[layerId].data.child;
      const parentId = layers[layerId].data.parent as LayerId;
      const parent = layers[parentId];

      const childLayer = child.reduce(
        (acc, id) => {
          acc[id] = positionOfObjectInsideAnother(
            group.data.props,
            layers[id].data.props
          );
          return acc;
        },
        {} as Record<LayerId, Delta & { rotate: number }>
      );
      const groupIdx = parent.data.child.indexOf(layerId);
      child.forEach((id) => {
        const layer = state.pages[activePage].layers[id];
        layer.data.parent = "ROOT";
        layer.data.props.position.x = childLayer[id].x;
        layer.data.props.position.y = childLayer[id].y;
        layer.data.props = {
          ...layer.data.props,
          rotate: childLayer[id].rotate,
        };
        layer.data.props.boxSize.width =
          layer.data.props.boxSize.width * group.data.props.scale;
        layer.data.props.boxSize.height =
          layer.data.props.boxSize.height * group.data.props.scale;

        if (isTextLayer(layer) || isFrameLayer(layer)) {
          layer.data.props = {
            ...layer.data.props,
            scale: layer.data.props.scale * group.data.props.scale,
          };
        } else if (isImageLayer(layer)) {
          layer.data.props.image.boxSize.width =
            layer.data.props.image.boxSize.width * group.data.props.scale;
          layer.data.props.image.boxSize.height =
            layer.data.props.image.boxSize.height * group.data.props.scale;
          layer.data.props.image.position.x =
            layer.data.props.image.position.x * group.data.props.scale;
          layer.data.props.image.position.y =
            layer.data.props.image.position.y * group.data.props.scale;
        }
      });
      state.pages[activePage].layers[parentId].data.child.splice(groupIdx, 1);
      state.pages[activePage].layers[parentId].data.child.splice(
        groupIdx,
        0,
        ...child
      );
      delete state.pages[activePage].layers[layerId];
      state.selectedLayers = {
        [activePage]: child,
      };
      return child;
    },
    group(layerIds: LayerId[], key?: string, resovleName?: string) {
      const ids: LayerId[] = [];
      const activePage = state.activePage;
      const layers = state.pages[state.activePage].layers;
      layerIds?.forEach((layerId) => {
        if (isGroupLayer(layers[layerId]) || isSectionLayer(layers[layerId])) {
          ids.push(...this.ungroup(layerId));
        } else {
          ids.push(layerId);
        }
      });
      const { left, right, top, bottom } = getBoundingBoxGroup(layers, ids);
      const newGroupNode = {
        type: {
          resolvedName: resovleName ?? "GroupLayer",
        },
        props: {
          position: {
            x: left,
            y: top,
          },
          boxSize: {
            width: (right as number) - (left as number),
            height: (bottom as number) - (top as number),
          },
          scale: 1,
          rotate: 0,
        },
        locked: false,
        hidden: false,
        parent: "ROOT",
        child: ids,
      };
      const parentId = key || getRandomId();
      const dl = deserializeLayer(newGroupNode);
      const rootChild = layers.ROOT.data.child;
      state.pages[activePage].layers[parentId] = { id: parentId, data: dl };
      ids.sort((a, b) => rootChild.indexOf(a) - rootChild.indexOf(b));
      const lastIdx = state.pages[
        activePage
      ].layers.ROOT.data.child.findLastIndex((i) => ids.includes(i));
      ids.forEach((id) => {
        const idx = state.pages[activePage].layers.ROOT.data.child.findIndex(
          (lId) => lId === id
        );
        state.pages[activePage].layers.ROOT.data.child.splice(idx, 1);

        state.pages[activePage].layers[id].data.parent = parentId;
        const props = {
          ...state.pages[activePage].layers[id].data.props,
        };
        props.position = {
          ...props.position,
          x: props.position.x - (left as number),
          y: props.position.y - (top as number),
        };
        state.pages[activePage].layers[id].data.props = props;
      });
      state.pages[activePage].layers.ROOT.data.child.splice(
        lastIdx - layerIds.length + 1,
        0,
        parentId
      );
      state.selectedLayers = {
        [activePage]: [parentId],
      };
      if (key) {
        this.resetSelectLayer();
      }
      return parentId;
    },
    bringToFront: (pageIndex: number, layerId: LayerId | LayerId[]) => {
      const ids: LayerId[] = [];
      if (typeof layerId === "object") {
        ids.push(...layerId);
      } else {
        ids.push(layerId);
      }
      const child = state.pages[pageIndex].layers.ROOT.data.child;
      ids.sort((a, b) => child.indexOf(a) - child.indexOf(b));
      ids.forEach((id) => {
        const fromIndex = child.findIndex((lId) => lId === id);
        child.splice(fromIndex, 1);
        child.splice(child.length, 0, id);
      });
    },
    bringForward: (pageIndex: number, layerId: LayerId | LayerId[]) => {
      const ids: LayerId[] = [];
      if (typeof layerId === "object") {
        ids.push(...layerId);
      } else {
        ids.push(layerId);
      }
      const child = state.pages[pageIndex].layers.ROOT.data.child;
      const lastIndex = child.findLastIndex((lId) => ids.includes(lId));
      ids.sort((a, b) => child.indexOf(a) - child.indexOf(b));
      ids.forEach((id) => {
        const fromIndex = child.findIndex((lId) => lId === id);
        child.splice(fromIndex, 1);
        child.splice(lastIndex + 1, 0, id);
      });
    },
    sendToBack: (pageIndex: number, layerId: LayerId | LayerId[]) => {
      const ids: LayerId[] = [];
      if (typeof layerId === "object") {
        ids.push(...layerId);
      } else {
        ids.push(layerId);
      }
      const child = state.pages[pageIndex].layers.ROOT.data.child;
      ids.sort((a, b) => child.indexOf(b) - child.indexOf(a));
      ids.forEach((id) => {
        const fromIndex = child.findIndex((lId) => lId === id);
        child.splice(fromIndex, 1);
        child.splice(0, 0, id);
      });
    },
    sendBackward: (pageIndex: number, layerId: LayerId | LayerId[]) => {
      const ids: LayerId[] = [];
      if (typeof layerId === "object") {
        ids.push(...layerId);
      } else {
        ids.push(layerId);
      }
      const child = state.pages[pageIndex].layers.ROOT.data.child;
      const firstIndex = child.findIndex((lId) => ids.includes(lId));
      ids.sort((a, b) => child.indexOf(b) - child.indexOf(a));
      ids.forEach((id) => {
        const fromIndex = child.findIndex((lId) => lId === id);
        child.splice(fromIndex, 1);
        child.splice(firstIndex - 1, 0, id);
      });
    },
    moveLayerPosition: (
      pageIndex: number,
      layerId: LayerId,
      newPosition: number
    ) => {
      const child = state.pages[pageIndex].layers.ROOT.data.child;
      const index = child.findIndex((lId) => lId === layerId);
      if (index === -1) return;
      child.splice(index, 1);
      child.splice(newPosition, 0, layerId);
    },
    setFontList(list: FontData[]) {
      state.fontList = list;
    },
    appendFontList(list: FontData[]) {
      state.fontList.push(...list);
    },
    addLayer(
      serializedLayer: Pick<SerializedLayer, "type" | "props">,
      parentId: LayerId = "ROOT"
    ) {
      const layerId = getRandomId();
      const dl = deserializeLayer({
        ...serializedLayer,
        locked: false,
        parent: parentId,
        child: [],
      });
      state.pages[state.activePage].layers[layerId] = {
        id: layerId,
        data: mergeWithoutArray(dl, {
          props: {
            position: getPositionWhenLayerCenter(
              query.getPageSize(),
              dl.props.boxSize
            ),
          },
        }),
      };
      state.pages[state.activePage].layers[parentId].data.child.push(layerId);
      this.selectLayers(state.activePage, layerId);
    },
    addShapeLayer(
      serializedLayer: Pick<SerializedLayer, "type" | "props">,
      parentId: LayerId = "ROOT"
    ) {
      const layerId = getRandomId();
      const dl = deserializeLayer({
        ...serializedLayer,
        locked: false,
        parent: parentId,
        child: [],
      });
      const ratio = query.getPageSize().width / query.getPageSize().height;
      const shapeRatio = dl.props.boxSize.width / dl.props.boxSize.height;
      let scale = 1,
        width = dl.props.boxSize.width,
        height = dl.props.boxSize.height;
      const shapeSize = 0.3;
      if (shapeRatio > ratio) {
        //scale by width
        width = query.getPageSize().width * shapeSize;
        height = width / shapeRatio;
        scale = width / dl.props.boxSize.width;
      } else {
        height = query.getPageSize().height * shapeSize;
        width = height * shapeRatio;
        scale = height / dl.props.boxSize.height;
      }
      const { x, y } = getPositionWhenLayerCenter(
        query.getPageSize(),
        dl.props.boxSize
      );

      const {
        width: textWidth,
        height: textHeight,
        x: textPosX,
        y: textPosY,
      } = isShapeType(serializedLayer.props.shape)
        ? getShapeTextSize(serializedLayer.props.shape, {
            width: width,
            height: height,
          })
        : { width: width, height: height, x: x, y: y };

      state.pages[state.activePage].layers[layerId] = {
        id: layerId,
        data: mergeWithoutArray(cloneDeep(dl), {
          props: {
            boxSize: { width, height },
            position: {
              x,
              y,
            },
            scale,
            textWidth,
            textHeight,
            textPosX,
            textPosY,
          },
        }),
      };
      state.pages[state.activePage].layers[parentId].data.child.push(layerId);
      this.selectLayers(state.activePage, layerId);
    },

    addSectionLayer(section: Section) {
      const custom_id = getRandomId();
      const new_item_id = getRandomId();
      const child = this.addLayerCV(section.component, new_item_id, custom_id);
      // Create item layer as group layer
      if (section.type === "basics.picture") return;
      else if (section.type === "basics" || section.type === "aboutme") {
        this.group(
          child.map((layer) => layer.id),
          `sections.${section.type}`,
          "SectionLayer"
        );
      } else {
        const item_ids = child.filter((layer) => layer.id.includes("items"));
        const item_key = `${item_ids[0].id.split("]")[0]}]`;
        this.group(
          item_ids.map((layer) => layer.id),
          item_key,
          "ItemLayer"
        );
        // Group name layer with item layer
        this.group(
          [item_key, `sections.${section.type}.name`],
          `sections.${section.type}`,
          "SectionLayer"
        );
      }
    },
    addLayoutLayer(section: Section) {
      const layout_id = `${section.type}.layout`;
      addLayerTreeToParent(
        state.activePage,
        section.layout,
        "ROOT",
        "",
        layout_id
      );
    },
    addLineLayer(
      serializedLayer: Pick<SerializedLayer, "props">,
      parentId: LayerId = "ROOT"
    ) {
      const layerId = getRandomId();
      const width = query.getPageSize().width / 2;
      const dl = deserializeLayer(
        mergeWithoutArray(
          {
            props: {
              boxSize: {
                width,
                height: 4,
              },
              position: {
                x: 0,
                y: 0,
              },
              style: "solid",
              color: "rgb(0, 0, 0)",
              scale: 1,
              rotate: 0,
            },
            type: {
              resolvedName: "LineLayer",
            },
            locked: false,
            parent: parentId,
            child: [],
          },
          serializedLayer
        )
      );
      state.pages[state.activePage].layers[layerId] = {
        id: layerId,
        data: mergeWithoutArray(cloneDeep(dl), {
          props: {
            position: getPositionWhenLayerCenter(
              query.getPageSize(),
              dl.props.boxSize
            ),
          },
        }),
      };
      state.pages[state.activePage].layers[parentId].data.child.push(layerId);
      this.selectLayers(state.activePage, layerId);
    },
    setUsingMainColor(layerId: string) {
      const props = state.pages[state.activePage].layers[layerId].data.props as
        | ShapeContentProps
        | TextContentProps
        | LineContentProps
        | SvgContentProps
        | FrameContentProps;
      (props as ShapeContentProps).usingMainColor = !props.usingMainColor;
    },
    addImageLayer(
      { thumb, url }: { url: string; thumb: string },
      boxSize: BoxSize,
      parentId: LayerId = "ROOT"
    ) {
      const layerId = getRandomId();
      const pageSize = query.getPageSize();
      const ratio = pageSize.width / pageSize.height;
      const imgRatio = boxSize.width / boxSize.height;
      const w =
        ratio < imgRatio
          ? pageSize.width * 0.8
          : pageSize.height * imgRatio * 0.8;
      const h = w / imgRatio;
      const dl = deserializeLayer({
        type: {
          resolvedName: "ImageLayer",
        },
        props: {
          image: {
            url,
            thumb,
            boxSize: {
              width: w,
              height: h,
            },
            position: {
              x: 0,
              y: 0,
            },
            rotate: 0,
          },
          position: {
            x: 0,
            y: 0,
          },
          boxSize: {
            width: w,
            height: h,
          },
          rotate: 0,
        },
        locked: false,
        parent: parentId,
        child: [],
      });
      state.pages[state.activePage].layers[layerId] = {
        id: layerId,
        data: mergeWithoutArray(dl, {
          props: {
            position: getPositionWhenLayerCenter(
              query.getPageSize(),
              dl.props.boxSize
            ),
          },
        }),
      };
      state.pages[state.activePage].layers[parentId].data.child.push(layerId);
      this.selectLayers(state.activePage, layerId);
    },
    changeBackgroundImage(
      url: string,
      rotate: number = 0,
      transparency: number = 1
    ) {
      const layer = state.pages[state.activePage].layers
        .ROOT as unknown as Layer<RootLayerProps>;
      layer.data.props.image = {
        url: url,
        thumb: url,
        boxSize: query.getPageSize(),
        position: {
          x: 0,
          y: 0,
        },
        rotate: rotate,
        transparency: transparency,
      };
    },
    addSvgLayer(
      url: string,
      boxSize: BoxSize,
      element: HTMLElement,
      parentId: LayerId = "ROOT"
    ) {
      const layerId = getRandomId();
      const pageSize = query.getPageSize();
      const ratio = pageSize.width / pageSize.height;
      const svgRatio = boxSize.width / boxSize.height;
      const w =
        ratio < svgRatio
          ? pageSize.width * 0.5
          : pageSize.height * svgRatio * 0.5;
      const h = w / svgRatio;
      const colors: string[] = [];

      const paths = element.querySelectorAll(
        "path, circle, ellipse,line, rect, polygon,polyline, text"
      ) as unknown as NodeListOf<HTMLElement>;
      for (let j = 0; j < paths.length; j++) {
        const style = paths[j].getAttribute("style");
        let stroke = paths[j].getAttribute("stroke") || "none";
        let fill = paths[j].getAttribute("fill") || "#000000";
        const styleObj: Record<string, string> = {};
        if (style) {
          const styleList = style.split(";").filter((s) => !!s);
          styleList.forEach((attr) => {
            const [key, value] = attr.split(":");
            styleObj[key.trim()] = value.trim();
          });
        }
        if (styleObj.stroke) {
          stroke = styleObj.stroke;
        }
        if (styleObj.fill) {
          fill = styleObj.fill;
        }
        if (
          stroke &&
          !["none", "currentcolor"].includes(stroke.toLowerCase()) &&
          !/url\((.*?)\)/.test(stroke) &&
          !colors.includes(new Color(stroke).toRgbString())
        ) {
          colors.push(new Color(stroke).toRgbString());
        } else if (
          fill &&
          !["none", "currentcolor"].includes(fill.toLowerCase()) &&
          !/url\((.*?)\)/.test(fill) &&
          !colors.includes(new Color(fill).toRgbString())
        ) {
          colors.push(new Color(fill).toRgbString());
        }
      }
      const dl = deserializeLayer({
        type: {
          resolvedName: "SvgLayer",
        },
        props: {
          image: url,
          position: {
            x: 0,
            y: 0,
          },
          boxSize: {
            width: w,
            height: h,
          },
          colors,
          rotate: 0,
        },
        locked: false,
        parent: parentId,
        child: [],
      });
      state.pages[state.activePage].layers[layerId] = {
        id: layerId,
        data: mergeWithoutArray(dl, {
          props: {
            position: getPositionWhenLayerCenter(
              query.getPageSize(),
              dl.props.boxSize
            ),
          },
        }),
      };
      state.pages[state.activePage].layers[parentId].data.child.push(layerId);
      this.selectLayers(state.activePage, layerId);
    },
    addFrameLayer(
      boxSize: BoxSize,
      clipPath: string,
      parentId: LayerId = "ROOT"
    ) {
      const layerId = getRandomId();
      const pageSize = query.getPageSize();
      const ratio = pageSize.width / pageSize.height;
      const frameRatio = boxSize.width / boxSize.height;
      const scale =
        ratio > frameRatio
          ? (pageSize.height * 0.5) / boxSize.height
          : (pageSize.width * 0.5) / boxSize.width;
      const dl = deserializeLayer({
        type: {
          resolvedName: "FrameLayer",
        },
        props: {
          clipPath,
          position: {
            x: 0,
            y: 0,
          },
          boxSize: {
            width: boxSize.width * scale,
            height: boxSize.height * scale,
          },
          rotate: 0,
          scale,
        },
        locked: false,
        parent: parentId,
        child: [],
      });
      state.pages[state.activePage].layers[layerId] = {
        id: layerId,
        data: mergeWithoutArray(dl, {
          props: {
            position: getPositionWhenLayerCenter(
              query.getPageSize(),
              dl.props.boxSize
            ),
          },
        }),
      };
      state.pages[state.activePage].layers[parentId].data.child.push(layerId);
      this.selectLayers(state.activePage, layerId);
    },
    addVideoLayer(
      { url }: { url: string },
      boxSize: BoxSize,
      parentId: LayerId = "ROOT"
    ) {
      const layerId = getRandomId();
      const pageSize = query.getPageSize();
      const ratio = pageSize.width / pageSize.height;
      const imgRatio = boxSize.width / boxSize.height;
      const w =
        ratio < imgRatio
          ? pageSize.width * 0.8
          : pageSize.height * imgRatio * 0.8;
      const h = w / imgRatio;
      const dl = deserializeLayer({
        type: {
          resolvedName: "VideoLayer",
        },
        props: {
          video: {
            url,
            boxSize: {
              width: w,
              height: h,
            },
            position: {
              x: 0,
              y: 0,
            },
            rotate: 0,
          },
          position: {
            x: 0,
            y: 0,
          },
          boxSize: {
            width: w,
            height: h,
          },
          rotate: 0,
        },
        locked: false,
        parent: parentId,
        child: [],
      });
      state.pages[state.activePage].layers[layerId] = {
        id: layerId,
        data: mergeWithoutArray(dl, {
          props: {
            position: getPositionWhenLayerCenter(
              query.getPageSize(),
              dl.props.boxSize
            ),
          },
        }),
      };
      state.pages[state.activePage].layers[parentId].data.child.push(layerId);
      this.selectLayers(state.activePage, layerId);
    },
    addLayerTree({ layers, rootId }: SerializedLayerTree) {
      const layer = addLayerTreeToParent(state.activePage, { layers, rootId });
      this.selectLayers(state.activePage, layer.id);
    },
    addLayerTrees(data: SerializedLayerTree[]) {
      const ids: LayerId[] = [];
      const layers = data?.map((serializeLayers) => {
        const layer = addLayerTreeToParent(state.activePage, serializeLayers);
        ids.push(layer.id);
        return layer;
      });
      this.selectLayers(state.activePage, ids);
      return layers;
    },
    addLayerCV(
      data: SerializedLayerTree[],
      item_id: LayerId,
      custom_id?: LayerId,
      parent_id?: string
    ) {
      const ids: LayerId[] = [];
      const layers = data?.map((serializeLayers) => {
        const layer = addLayerTreeToParent(
          state.activePage,
          serializeLayers,
          parent_id ?? "ROOT",
          item_id,
          custom_id
        );
        ids.push(layer.id);
        return layer;
      });
      this.selectLayers(state.activePage, ids);
      return layers;
    },
    addLayerItem(
      data: SerializedLayerTree[],
      section_id: LayerId,
      item_id?: LayerId
    ) {
      const new_item_id = item_id || getRandomId();
      const layer = this.addLayerCV(data, new_item_id);
      const ids = layer.map((l) => l.id);
      this.group([...ids, section_id], section_id, "SectionLayer");
      return layer;
    },
    cloneNewItem(sectionId: LayerId, isKeepFirst: boolean = false) {
      const pageIndex = state.activePage;
      const sectionLayer = state.pages[pageIndex].layers[sectionId];
      const old_item_id = sectionLayer.data.child.reduce((acc, child_id) => {
        if (
          state.pages[state.activePage].layers[child_id].data.props.position.y <
            state.pages[state.activePage].layers[acc].data.props.position.y ||
          (child_id.includes("items") && !acc.includes("items"))
        ) {
          acc = child_id;
        }
        return acc;
      });
      const data: SerializedLayerTree[] = [];
      const dx = state.pages[pageIndex].layers[sectionId].data.props.position.x;
      let dy = state.pages[pageIndex].layers[sectionId].data.props.position.y;
      if (!isKeepFirst) {
        dy +=
          state.pages[pageIndex].layers[sectionId].data.props.boxSize.height;
      }
      const copied_id = old_item_id.replace(/\[(.*?)\]/g, "[{humantree_id}]");
      const copied_item = {
        rootId: copied_id,
        layers: cloneDeep(
          serializeItem(state.pages[pageIndex].layers, old_item_id)
        ),
      };
      const props = copied_item.layers[copied_id].props as LayerComponentProps;
      if (props.position.y > 0) props.position.y = 5;
      props.position.x += dx;
      props.position.y += dy;
      data.push(copied_item);
      return { data, old_item_id };
    },
    keepFirstItem(sectionId: LayerId, item_id: string) {
      const result = this.cloneNewItem(sectionId, true);
      // Delete old item
      const deleted_ids: LayerId[] = [];
      state.pages[state.activePage].layers[sectionId].data.child.map(
        (child_id) => {
          if (child_id.includes("items") && !child_id.includes(item_id)) {
            delete state.pages[state.activePage].layers[child_id];
            deleted_ids.push(child_id);
          }
        }
      );
      state.pages[state.activePage].layers[sectionId].data.child = state.pages[
        state.activePage
      ].layers[sectionId].data.child.filter(
        (child_id) => !deleted_ids.includes(child_id)
      );
      this.addLayerItem(result.data, sectionId, item_id);
    },
    addANewItem(sectionId: LayerId, item_id?: LayerId) {
      const result = this.cloneNewItem(sectionId);
      this.addLayerItem(result.data, sectionId, item_id);
    },
    deleteItem(sectionId: LayerId, item_id: LayerId) {
      const layers = state.pages[state.activePage].layers;
      layers[sectionId].data.child.map((child_id) => {
        if (child_id === item_id) {
          delete layers[child_id];
        }
      });
      layers[sectionId].data.child = layers[sectionId].data.child.filter(
        (child_id) => child_id !== item_id
      );
      const remaining_items = layers[sectionId].data.child;
      this.ungroup(sectionId);
      this.group(remaining_items, sectionId, "SectionLayer");
    },
    moveDownByDeltaY: (id: LayerId, dy: number) => {
      const layer = state.pages[state.activePage].layers[id];
      layer.data.props.position.y += dy;
      let parentId = layer.data.parent;
      while (parentId && parentId !== "ROOT") {
        const parent = state.pages[state.activePage].layers[parentId];
        parent.data.props.boxSize.height += dy;
        parentId = parent.data.parent;
      }
    },
    showContextMenu: ({ clientX, clientY }: CursorPosition) => {
      state.openMenu = {
        clientX,
        clientY,
      };
    },
    hideContextMenu: () => {
      state.openMenu = null;
    },
    setSelectData: (status: boolean) => {
      state.selectData.status = status;
    },
    setResizeData: (
      status: boolean,
      layerIds?: LayerId[],
      direction?: Direction,
      rotate?: number,
      boxSize?: BoxSize,
      cursor?: CursorPosition
    ) => {
      state.resizeData = {
        status,
        layerIds,
        direction,
        rotate,
        boxSize,
        cursor,
      };
    },
    setRotateData: (status: boolean, rotate?: number) => {
      state.rotateData = {
        status,
        rotate,
      };
    },
    setDragData: (status: boolean, layerIds?: LayerId[]) => {
      state.dragData = {
        status,
        layerIds,
      };
    },
    setUpdateLineData: (
      status: boolean,
      layerId?: LayerId,
      linePosition?: LinePosition
    ) => {
      state.updateLineData = {
        status,
        layerId,
        linePosition,
      };
    },
    setControlBox: (data?: BoxData) => {
      state.controlBox = data;
    },
    setSidebar: (sidebar?: SidebarType) => {
      state.sidebar = sidebar || null;
    },
    openImageEditor(
      pageIndex: number,
      layerId: LayerId,
      {
        boxSize,
        position,
        rotate,
        image,
        video,
      }: {
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
      }
    ) {
      state.imageEditor = cloneDeep({
        pageIndex,
        layerId,
        boxSize,
        position,
        rotate,
        image,
        video,
      });
    },
    updateImageEditor(
      data: DeepPartial<{
        position: Delta;
        rotate: number;
        boxSize: BoxSize;
        image: {
          url: string;
          position: Delta;
          rotate: number;
          boxSize: BoxSize;
        };
        video: {
          url: string;
          position: Delta;
          rotate: number;
          boxSize: BoxSize;
        };
      }>
    ) {
      if (state.imageEditor) {
        state.imageEditor = mergeWithoutArray(state.imageEditor, data);
      }
    },
    closeImageEditor() {
      const imageEditor = state.imageEditor;
      if (imageEditor) {
        const originalLayer =
          state.pages[imageEditor.pageIndex].layers[imageEditor.layerId];
        state.pages[imageEditor.pageIndex].layers[
          imageEditor.layerId
        ].data.props = mergeWithoutArray(
          state.pages[imageEditor.pageIndex].layers[imageEditor.layerId].data
            .props,
          {
            boxSize: imageEditor.boxSize,
            position: imageEditor.position,
            rotate: imageEditor.rotate,
            image: imageEditor.image
              ? {
                  boxSize: {
                    width:
                      imageEditor.image.boxSize.width /
                      (originalLayer.data.props.scale || 1),
                    height:
                      imageEditor.image.boxSize.height /
                      (originalLayer.data.props.scale || 1),
                  },
                  position: {
                    x:
                      imageEditor.image.position.x /
                      (originalLayer.data.props.scale || 1),
                    y:
                      imageEditor.image.position.y /
                      (originalLayer.data.props.scale || 1),
                  },
                  rotate: imageEditor.image.rotate,
                }
              : undefined,
            video: imageEditor.video
              ? {
                  boxSize: {
                    width:
                      imageEditor.video.boxSize.width /
                      (originalLayer.data.props.scale || 1),
                    height:
                      imageEditor.video.boxSize.height /
                      (originalLayer.data.props.scale || 1),
                  },
                  position: {
                    x:
                      imageEditor.video.position.x /
                      (originalLayer.data.props.scale || 1),
                    y:
                      imageEditor.video.position.y /
                      (originalLayer.data.props.scale || 1),
                  },
                  rotate: imageEditor.video.rotate,
                }
              : undefined,
          }
        );
      }

      state.imageEditor = undefined;
    },
    setPageDOMRect(pageDOMRect: DOMRect) {
      state.pageDOMRect = pageDOMRect;
    },
  };
};
