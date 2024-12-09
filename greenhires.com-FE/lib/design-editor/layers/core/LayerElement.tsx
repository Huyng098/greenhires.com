import { LayerId } from '@lidojs/design-core';
import React, { FC, PropsWithChildren } from 'react';
import LayerProvider from './LayerContext';
import RenderLayer from './RenderLayer';

type LayerElementProps = {
  id: LayerId;
};
const LayerElement: FC<PropsWithChildren<LayerElementProps>> = ({ id }) => {
  return (
    <LayerProvider id={id}>
      <RenderLayer />
    </LayerProvider>
  );
};

export default LayerElement;
