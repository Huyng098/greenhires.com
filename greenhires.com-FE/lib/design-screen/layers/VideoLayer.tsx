import { BoxSize, Delta } from '@lidojs/design-core';
import { VideoContent, VideoContentProps } from '@lidojs/design-layers';
import { FC } from 'react';

export interface VideoLayerProps extends VideoContentProps {
  video: {
    url: string;
    position: Delta;
    rotate: number;
    boxSize: BoxSize;
    transparency?: number;
  };
}

const VideoLayer: FC<VideoLayerProps> = ({
  video,
  boxSize,
  position,
  rotate,
  ...props
}) => {
  return (
    <VideoContent
      boxSize={boxSize}
      position={position}
      rotate={rotate}
      video={{ ...video, autoPlay: true }}
      {...props}
    />
  );
};

export default VideoLayer;
