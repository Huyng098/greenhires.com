import { BoxSize, Delta } from "@lidojs/design-core";
import { FrameContent, FrameContentProps } from "@lidojs/design-layers";
import { FC } from "react";

export interface FrameLayerProps extends FrameContentProps {
  image: {
    url: string;
    thumb: string;
    position: Delta;
    rotate: number;
    boxSize: BoxSize;
  } | null;
}

const FrameLayer: FC<FrameLayerProps> = ({
  clipPath,
  image,
  color,
  gradientBackground,
  boxSize,
  position,
  rotate,
  scale,
  ...props
}) => {
  return (
    <div
      style={{
        transformOrigin: "0 0",
        width: boxSize.width / scale,
        height: boxSize.height / scale,
        transform: `scale(${scale})`,
      }}
    >
      <FrameContent
        boxSize={boxSize}
        clipPath={clipPath}
        color={color}
        gradientBackground={gradientBackground}
        image={image}
        position={position}
        rotate={rotate}
        scale={scale}
        {...props}
      />
    </div>
  );
};

export default FrameLayer;
