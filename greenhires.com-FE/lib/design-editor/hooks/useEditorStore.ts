import { LayerComponentProps } from "@lidojs/design-core";
import { enablePatches, produce, produceWithPatches } from "immer";
import { useCallback, useMemo, useReducer, useRef } from "react";
import { setContent } from "../common/text-editor/core/helper/setContent";
import { ActionMethods } from "../editor/actions";
import { QueryMethods } from "../editor/query";
import {
  CoreEditorActions,
  CoreEditorQuery,
  EditorActions,
  EditorQuery,
  EditorState,
  HistoryActions,
  Layer,
} from "../types";
import { History, HISTORY_ACTIONS } from "../ultils/history";
import { isTextLayer } from "../ultils/layer/layers";

type Action = {
  type: string;
  payload?: unknown;
  config?: {
    rate: number;
  };
};
enablePatches();
const ignoreHistoryForActions: string[] = [
  "hoverLayer",
  "selectLayers",
  "setControlBox",
  "setScale",
  "setEditing",
  "selectAllLayers",
  "resetSelectLayer",
  "hoverLayer",
  "setTextEditor",
  "setData",
  "showContextMenu",
  "hideContextMenu",
  "setResizeData",
  "setRotateData",
  "setDragData",
  "setSelectData",
  "setSidebar",
  "imageEditor",
];

const autoHistoryForActions: string[] = [
  "setProp",
  "ungroup",
  "group",
  "setHidden",
  "lock",
  "unlock",
  "lockPage",
  "unlockPage",
  "deletePage",
  "duplicatePage",
  "addPage",
  "movePageUp",
  "movePageDown",
  "bringForward",
  "sendBackward",
  "bringToFront",
  "sendToBack",
  "addLayer",
  "addImageLayer",
  "addFrameLayer",
  "addLayerTree",
  "deleteLayer",
];
export const useEditorStore = () => {
  const history = useMemo(() => new History(), []);
  const currState = useRef<EditorState>();
  const getState = useCallback(() => currState.current as EditorState, []);
  const methods = ActionMethods;

  const baseQuery = useMemo(() => {
    const qMethods = QueryMethods;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.keys(qMethods()).reduce((accum, key) => {
      return {
        ...accum,
        [key as keyof CoreEditorQuery]: (...args: never) => {
          const func = qMethods(getState())[key as keyof CoreEditorQuery];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return func(...args);
        },
      };
    }, {} as CoreEditorQuery);
  }, [getState]);

  const query = useMemo<EditorQuery>(() => {
    return {
      ...baseQuery,
      history: {
        canUndo() {
          return history.canUndo();
        },
        canRedo() {
          return history.canRedo();
        },
      },
    };
  }, [baseQuery, history]);

  const [reducer] = useMemo(() => {
    return [
      (state: EditorState, action: Action) => {
        let finalState;
        const [nextState, patches, inversePatches] = produceWithPatches<
          EditorState,
          EditorState
        >(state, (draft) => {
          switch (action.type) {
            case HISTORY_ACTIONS.NEW:
              break;
            case HISTORY_ACTIONS.BACK:
              history.back();
              break;
            case HISTORY_ACTIONS.UNDO:
              return history.undo(draft);
            case HISTORY_ACTIONS.REDO:
              return history.redo(draft);
            case HISTORY_ACTIONS.CLEAR:
              history.clear();
              return {
                ...draft,
              };
            case HISTORY_ACTIONS.IGNORE:
            case HISTORY_ACTIONS.MERGE:
            case HISTORY_ACTIONS.THROTTLE:
              // eslint-disable-next-line no-case-declarations
              const [type, ...params] = action.payload as [string, unknown];
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              methods(draft, query)[type](...params);
              break;
            default:
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              methods(draft, query)[action.type](...action.payload);
          }
        });

        finalState = nextState;
        if (
          [HISTORY_ACTIONS.UNDO, HISTORY_ACTIONS.REDO].includes(
            action.type as never
          )
        ) {
          finalState = produce(finalState, (state) => {
            state.pages.forEach((page) => {
              Object.entries(page.layers).forEach(([, layer]) => {
                const l = layer as Layer<LayerComponentProps>;
                if (isTextLayer(l)) {
                  //reset editor content
                  const editor = l.data.editor;
                  if (editor) {
                    setContent(l.data.props.text)(
                      editor.state,
                      editor.dispatch
                    );
                  }
                }
              });
            });
            state.textEditor = undefined;
            state.selectedLayers = {};
            state.hoveredLayer = {};
            state.controlBox = undefined;
          });
        }
        if (
          ![
            ...ignoreHistoryForActions,
            HISTORY_ACTIONS.UNDO,
            HISTORY_ACTIONS.REDO,
            HISTORY_ACTIONS.CLEAR,
            HISTORY_ACTIONS.IGNORE,
            HISTORY_ACTIONS.NEW,
          ].includes(action.type)
        ) {
          if (action.type === HISTORY_ACTIONS.THROTTLE) {
            history.throttleAdd(
              patches,
              inversePatches,
              action.config && action.config.rate
            );
          } else if (autoHistoryForActions.includes(action.type)) {
            history.add(patches, inversePatches);
          } else {
            history.merge(patches, inversePatches);
          }
        }
        if (HISTORY_ACTIONS.NEW === action.type) {
          history.add(patches, inversePatches);
        }
        if (HISTORY_ACTIONS.MERGE === action.type) {
          history.merge(patches, inversePatches);
        }
        if (HISTORY_ACTIONS.THROTTLE === action.type) {
          history.throttleAdd(patches, inversePatches);
        }

        return finalState;
      },
    ];
  }, [history, methods, query]);
  const [state, dispatch] = useReducer(reducer, {
    selectedLayers: {},
    hoveredLayer: {},
    openMenu: null,
    scale: 1,
    activePage: 0,
    pages: [],
    fontList: [],
    guideline: {
      vertical: [],
      horizontal: [],
    },
    sidebar: null,
    resizeData: {
      status: false,
    },
    dragData: {
      status: false,
    },
    rotateData: {
      status: false,
    },
    updateLineData: {
      status: false,
    },
    selectData: {
      status: false,
    },
  });

  const actions = useMemo<EditorActions>(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const actionKeys: (keyof CoreEditorActions)[] = Object.keys(methods(null));
    const coreActions = actionKeys.reduce((accum, type) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      accum[type] = (...payload) => dispatch({ type, payload });
      return accum;
    }, {} as CoreEditorActions);

    const historyActions: HistoryActions = {
      new() {
        dispatch({
          type: HISTORY_ACTIONS.NEW,
        });
      },
      undo() {
        return dispatch({
          type: HISTORY_ACTIONS.UNDO,
        });
      },
      redo() {
        return dispatch({
          type: HISTORY_ACTIONS.REDO,
        });
      },
      clear: () => {
        return dispatch({
          type: HISTORY_ACTIONS.CLEAR,
        });
      },
      back: () => {
        return dispatch({
          type: HISTORY_ACTIONS.BACK,
        });
      },
      ignore: () => {
        return actionKeys
          .filter((type) => !ignoreHistoryForActions.includes(type))
          .reduce((accum, type) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            accum[type] = (...payload) =>
              dispatch({
                type: HISTORY_ACTIONS.IGNORE,
                payload: [type, ...payload],
              });
            return accum;
          }, {} as EditorActions);
      },
      throttle: (rate: number) => {
        return actionKeys
          .filter((type) => !ignoreHistoryForActions.includes(type))
          .reduce((accum, type) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            accum[type] = (...payload) =>
              dispatch({
                type: HISTORY_ACTIONS.THROTTLE,
                payload: [type, ...payload],
                config: {
                  rate: rate,
                },
              });
            return accum;
          }, {} as EditorActions);
      },
      merge: () => {
        return actionKeys
          .filter((type) => !ignoreHistoryForActions.includes(type))
          .reduce((accum, type) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            accum[type] = (...payload) =>
              dispatch({
                type: HISTORY_ACTIONS.MERGE,
                payload: [type, ...payload],
              });
            return accum;
          }, {} as EditorActions);
      },
    };
    return { ...coreActions, history: historyActions };
  }, [methods]);

  currState.current = state;

  return useMemo(
    () => ({
      getState,
      actions,
      query,
    }),
    [actions, getState, query]
  );
};
