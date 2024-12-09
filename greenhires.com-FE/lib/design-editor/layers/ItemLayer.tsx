import { LayerComponentProps } from "@lidojs/design-core";
import { PropsWithChildren } from "react";
import { LayerComponent } from "../types";

export interface ItemLayerProps extends LayerComponentProps {
  scale: number;
}
const ItemLayer: LayerComponent<PropsWithChildren<ItemLayerProps>> = ({
  boxSize,
  scale,
  children,
}) => {
  return (
    <>
      <div
        style={{
          transformOrigin: "0 0",
          width: boxSize.width / scale,
          height: boxSize.height / scale,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </>
  );
};

ItemLayer.info = {
  name: "Item",
  type: "Item",
};

export default ItemLayer;
