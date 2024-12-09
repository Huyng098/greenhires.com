import {
  getGradientBackground,
  GradientStyle,
  LayerComponentProps,
} from '@lidojs/design-core';
import React, { FC, HTMLProps } from 'react';
import { ImageContent, ImageContentProps } from './ImageContent';
import { VideoContent, VideoContentProps } from './VideoContent';

export interface RootContentProps
  extends LayerComponentProps,
    Omit<HTMLProps<HTMLDivElement>, 'color'> {
  color: string | null;
  gradientBackground: {
    colors: string[];
    style: GradientStyle;
  } | null;
  image?: (ImageContentProps['image'] & { transparency: number }) | null;
  video?: VideoContentProps['video'] | null;
}

export const RootContent: FC<RootContentProps> = ({
  boxSize,
  color,
  gradientBackground,
  image,
  video,
  position,
  rotate,
  layerId,
  ...props
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        overflow: 'hidden',
        pointerEvents: 'auto',
        width: boxSize.width,
        height: boxSize.height,
      }}
      {...props}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: boxSize.width,
          height: boxSize.height,
          background: gradientBackground
            ? getGradientBackground(
                gradientBackground.colors,
                gradientBackground.style
              )
            : color || '#fff',
        }}
      />
      {image && (
        <div style={{ width: boxSize.width, height: boxSize.height }}>
          <ImageContent
            boxSize={boxSize}
            image={image}
            layerId={layerId}
            position={position}
            rotate={rotate}
          />
        </div>
      )}
      {video && (
        <div style={{ width: boxSize.width, height: boxSize.height }}>
          <VideoContent
            boxSize={boxSize}
            layerId={layerId}
            position={position}
            rotate={rotate}
            video={video}
          />
        </div>
      )}
    </div>
  );
};
