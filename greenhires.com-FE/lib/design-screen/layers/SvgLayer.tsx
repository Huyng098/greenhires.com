import { SvgContent, SvgContentProps } from "@lidojs/design-layers";
import { FC } from "react";

const SvgLayer: FC<SvgContentProps> = ({ boxSize, ...props }) => {
  return (
    <div
      style={{
        transformOrigin: "0 0",
        width: boxSize.width,
        height: boxSize.height,
      }}
    >
      <SvgContent boxSize={boxSize} {...props} />
    </div>
  );
};

export default SvgLayer;
