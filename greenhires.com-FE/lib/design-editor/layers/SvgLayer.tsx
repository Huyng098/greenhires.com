import { SvgContent, SvgContentProps } from "@lidojs/design-layers";
import { LayerComponent } from "../types";

export type SvgLayerProps = SvgContentProps;
const SvgLayer: LayerComponent<SvgLayerProps> = ({ boxSize, ...props }) => {
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

SvgLayer.info = {
  name: "Svg",
  type: "Svg",
};
export default SvgLayer;
