import {
  boundingRect,
  getTransformStyle,
  LayerComponentProps,
} from '@lidojs/design-core';
import React, { createElement, FC, useMemo } from 'react';
import LayerProvider from '../../../layers/core/LayerContext';
import RenderLayer from '../../../layers/core/RenderLayer';
import { Layer } from '../../../types';

interface ReverseTransformLayerProps {
  layer: Layer<LayerComponentProps>;
  hiddenChild?: boolean;
}

const WIDTH = 231;
const HEIGHT = 36;
const ReverseTransformLayer: FC<ReverseTransformLayerProps> = ({
  layer,
  hiddenChild,
}) => {
  const box = useMemo(() => {
    const box = {
      width: WIDTH,
      height: HEIGHT,
      scale: 1,
    };
    const boxRatio = box.width / box.height;
    const props = layer.data.props;
    const rect = boundingRect(props.boxSize, props.position, props.rotate);
    const layerRatio = rect.width / rect.height;
    if (boxRatio > layerRatio) {
      box.height = HEIGHT;
      box.width = box.height * layerRatio;
      box.scale = box.height / rect.height;
    } else {
      box.width = WIDTH;
      box.height = box.width / layerRatio;
      box.scale = box.width / rect.width;
    }
    return box;
  }, [layer]);

  const transform = useMemo(() => {
    const props = layer.data.props;
    if (props.rotate === 0) {
      return {
        x: -props.position.x * box.scale,
        y: -props.position.y * box.scale,
      };
    } else {
      const rect = boundingRect(props.boxSize, props.position, props.rotate);
      return {
        x: -rect.x * box.scale,
        y: -rect.y * box.scale,
      };
    }
  }, [layer, box]);

  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: box.width,
          height: box.height,
        }}
      >
        <div
          style={{
            transform: getTransformStyle({
              position: transform,
            }),
          }}
        >
          <div
            style={{
              transformOrigin: '0px 0px',
              transform: `scale(${box.scale})`,
            }}
          >
            {!hiddenChild ? (
              <LayerProvider id={layer.id}>
                <RenderLayer />
              </LayerProvider>
            ) : (
              createElement(layer.data.comp, layer.data.props, null)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseTransformLayer;
