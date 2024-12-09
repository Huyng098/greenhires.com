import { BoxSize, Delta } from '@lidojs/design-core';
import { ImageContent, ImageContentProps } from '@lidojs/design-layers';
import { useEffect, useState } from 'react';
import { useEditor, useLayer, useSelectedLayers } from '../hooks';
import { LayerComponent } from '../types';

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

const ImageLayer: LayerComponent<ImageLayerProps> = ({
  layerId,
  image,
  boxSize,
  position,
  rotate,
}) => {
  const { actions, pageIndex, id } = useLayer();
  const { selectedLayerIds } = useSelectedLayers();
  const { imageEditor } = useEditor((state) => ({
    imageEditor: state.imageEditor,
  }));
  const [imageData, setImageData] = useState<ImageLayerProps['image']>({
    ...image,
    url: image.thumb,
  });
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageData((prevState) => ({ ...prevState, url: image.url }));
    };
    img.src = image.url;
  }, [image, setImageData]);

  useEffect(() => {
    setImageData(image);
  }, [image]);
  return (
    <div
      style={{
        pointerEvents: 'auto',
        visibility:
          imageEditor &&
          imageEditor.pageIndex === pageIndex &&
          imageEditor.layerId === id
            ? 'hidden'
            : undefined,
      }}
      onDoubleClick={() =>
        selectedLayerIds.includes(id) &&
        actions.openImageEditor({ position, rotate, boxSize, image })
      }
    >
      <ImageContent
        boxSize={boxSize}
        image={imageData}
        layerId={layerId}
        position={position}
        rotate={rotate}
      />
    </div>
  );
};

ImageLayer.info = {
  name: 'Image',
  type: 'Image',
};
export default ImageLayer;
