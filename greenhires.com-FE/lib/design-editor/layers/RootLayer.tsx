import { BoxSize, Delta } from '@lidojs/design-core';
import { RootContent, RootContentProps } from '@lidojs/design-layers';
import { Fragment, PropsWithChildren } from 'react';
import { useLayer } from '../hooks';
import { LayerComponent } from '../types';

export interface RootLayerProps extends Omit<RootContentProps, 'image'> {
  image?: {
    url: string;
    thumb: string;
    position: Delta;
    rotate: number;
    boxSize: BoxSize;
    transparency: number;
  } | null;
}

const RootLayer: LayerComponent<PropsWithChildren<RootLayerProps>> = ({
  layerId,
  boxSize,
  children,
  color,
  gradientBackground,
  image,
  video,
  position,
  rotate,
  scale,
}) => {
  const { actions } = useLayer();
  return (
    <Fragment>
      <RootContent
        boxSize={boxSize}
        color={color}
        gradientBackground={gradientBackground}
        image={image}
        layerId={layerId}
        position={position}
        rotate={rotate}
        scale={scale}
        video={video}
        onDoubleClick={() =>
          (image || video) &&
          actions.openImageEditor({ boxSize, position, rotate, image, video })
        }
      />
      {children}
    </Fragment>
  );
};

RootLayer.info = {
  name: 'Main',
  type: 'Root',
};
export default RootLayer;
