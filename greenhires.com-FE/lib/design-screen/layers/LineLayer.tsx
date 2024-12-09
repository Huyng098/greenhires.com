import { LineContent, LineContentProps } from "@lidojs/design-layers";
import { FC } from "react";

export type LineLayerProps = LineContentProps;
const LineLayer: FC<LineLayerProps> = ({
  layerId,
  boxSize,
  color,
  scale = 1,
  rotate,
  position,
  ...props
}) => {
  return (
    <div
      style={{
        width: boxSize.width / (scale || 1),
        height: boxSize.height / (scale || 1),
        transform: `scale(${scale || 1})`,
        transformOrigin: "0 0",
      }}
    >
      <LineContent
        boxSize={boxSize}
        color={color}
        layerId={layerId}
        position={position}
        rotate={rotate}
        scale={scale}
        {...props}
      />
    </div>
  );
};

export default LineLayer;
