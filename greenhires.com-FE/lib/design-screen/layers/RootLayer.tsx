import { RootContent, RootContentProps } from '@lidojs/design-layers';
import { FC, Fragment, PropsWithChildren } from 'react';

export type RootLayerProps = RootContentProps;

const RootLayer: FC<PropsWithChildren<RootLayerProps>> = ({
  boxSize,
  children,
  color,
  gradientBackground,
  image,
  video,
  position,
  rotate,
  scale,
  ...props
}) => {
  return (
    <Fragment>
      <RootContent
        boxSize={boxSize}
        color={color}
        gradientBackground={gradientBackground}
        image={image}
        position={position}
        rotate={rotate}
        scale={scale}
        video={video ? { ...video, autoPlay: true } : undefined}
        {...props}
      />
      {children}
    </Fragment>
  );
};

export default RootLayer;
