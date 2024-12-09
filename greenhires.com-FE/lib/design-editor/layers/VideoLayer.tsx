import { VideoContent, VideoContentProps } from '@lidojs/design-layers';
import { useEditor, useLayer, useSelectedLayers } from '../hooks';
import { LayerComponent } from '../types';

export type VideoLayerProps = VideoContentProps;

const VideoLayer: LayerComponent<VideoLayerProps> = ({
  video,
  boxSize,
  position,
  rotate,
  ...props
}) => {
  const { actions, pageIndex, id } = useLayer();
  const { selectedLayerIds } = useSelectedLayers();
  const { imageEditor } = useEditor((state) => ({
    imageEditor: state.imageEditor,
  }));

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
        actions.openImageEditor({ position, rotate, boxSize, video })
      }
    >
      <VideoContent
        boxSize={boxSize}
        position={position}
        rotate={rotate}
        video={video}
        {...props}
      />
    </div>
  );
};

VideoLayer.info = {
  name: 'Video',
  type: 'Video',
};
export default VideoLayer;
