import { LayerComponentProps, LayerId } from "@lidojs/design-core";
import { EditorState, Layer } from "../types";
import { serialize } from "../ultils/layer/page";

export const QueryMethods = (state: EditorState) => {
  return {
    getPageSize() {
      return (
        (state.pages[0] && state.pages[0].layers.ROOT.data.props.boxSize) || {
          width: 0,
          height: 0,
        }
      );
    },
    serialize() {
      return serialize(state.pages);
    },
    getLayers(pageIndex: number) {
      return state.pages[pageIndex] && state.pages[pageIndex].layers;
    },
    getLayer<P extends LayerComponentProps>(
      pageIndex: number,
      layerId: LayerId
    ) {
      const layers = state.pages[pageIndex] && state.pages[pageIndex].layers;
      if (layers) {
        return layers[layerId] as unknown as Layer<P>;
      }
    },
  };
};