import { BoxSize, Delta } from '@lidojs/design-core';
import { ImageContent, ImageContentProps } from '@lidojs/design-layers';
import { FC } from 'react';

export interface ImageLayerProps extends ImageContentProps {
  image: {
    url: string;
    thumb: string;
    position: Delta;
    rotate: number;
    boxSize: BoxSize;
    transparency?: number;
  };
}

const ImageLayer: FC<ImageLayerProps> = ({
  image,
  boxSize,
  position,
  rotate,
  ...props
}) => {
  return (
    <ImageContent
      boxSize={boxSize}
      image={image}
      position={position}
      rotate={rotate}
      {...props}
    />
  );
};

export default ImageLayer;
