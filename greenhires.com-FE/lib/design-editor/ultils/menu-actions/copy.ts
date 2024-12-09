import { LayerId, SerializedLayerTree } from '@lidojs/design-core';
import { EditorState } from '../../types';
import { serializeLayers } from '../layer/layers';

export const copy = async (
  state: EditorState,
  { pageIndex, layerIds }: { pageIndex: number; layerIds: LayerId[] }
) => {
  const data: SerializedLayerTree[] = [];
  layerIds.forEach((layerId) => {
    data.push({
      rootId: layerId,
      layers: serializeLayers(state.pages[pageIndex].layers, layerId),
    });
  });
  await navigator.clipboard.writeText(JSON.stringify(data));
};
