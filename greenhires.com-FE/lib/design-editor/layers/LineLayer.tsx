import { LineContent, LineContentProps } from '@lidojs/design-layers';
import { LayerComponent } from '../types';

export type LineLayerProps = LineContentProps;

const LineLayer: LayerComponent<LineLayerProps> = ({
  layerId,
  boxSize,
  color,
  scale = 1,
  rotate,
  position,
  style,
  ...props
}) => {
  return (
    <>
      {boxSize.height < 32 && (
        <div
          style={{
            top: -(32 - boxSize.height) / 2,
            height: 32,
            width: boxSize.width,
            position: 'absolute',
          }}
        />
      )}
      <LineContent
        boxSize={boxSize}
        color={color}
        layerId={layerId}
        position={position}
        rotate={rotate}
        scale={scale}
        style={style}
        {...props}
      />
    </>
  );
};

LineLayer.info = {
  name: 'Line',
  type: 'Line',
};
export default LineLayer;
