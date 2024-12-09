import { TextContent, TextContentProps } from "@lidojs/design-layers";
import { FC } from "react";

export type TextLayerProps = TextContentProps;

const TextLayer: FC<TextLayerProps> = ({
  text,
  boxSize,
  scale,
  fonts,
  colors,
  fontSizes,
  effect,
  rotate,
  position,
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
      <TextContent
        boxSize={boxSize}
        colors={colors}
        effect={effect}
        fontSizes={fontSizes}
        fonts={fonts}
        position={position}
        rotate={rotate}
        scale={scale}
        text={text}
        {...props}
      />
    </div>
  );
};

export default TextLayer;
