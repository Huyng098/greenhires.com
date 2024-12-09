import {
  BoxSize,
  Delta,
  getTransformStyle,
  LayerComponentProps,
} from '@lidojs/design-core';
import React, { FC } from 'react';

export interface VideoContentProps extends LayerComponentProps {
  video: {
    url: string;
    position: Delta;
    rotate: number;
    boxSize: BoxSize;
    transparency?: number;
    autoPlay?: boolean;
  };
}

export const VideoContent: FC<VideoContentProps> = ({ video, boxSize }) => {
  return (
    <div
      style={{
        overflow: 'hidden',
        pointerEvents: 'auto',
        width: boxSize.width,
        height: boxSize.height,
      }}
    >
      <div
        style={{
          width: video.boxSize.width,
          height: video.boxSize.height,
          transform: getTransformStyle({
            position: video.position,
            rotate: video.rotate,
          }),
          position: 'relative',
          userSelect: 'none',
          opacity: video.transparency,
        }}
      >
        <video
          autoPlay={video.autoPlay}
          crossOrigin="anonymous"
          style={{ objectFit: 'fill', width: '100%', height: '100%' }}
          muted={true}
          src={video.url}
        />
      </div>
    </div>
  );
};
