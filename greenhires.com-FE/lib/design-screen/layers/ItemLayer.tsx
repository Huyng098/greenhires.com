import { LayerComponentProps } from "@lidojs/design-core";
import { FC, PropsWithChildren } from "react";

export interface ItemLayerProps extends LayerComponentProps {
  scale: number;
}

const ItemLayer: FC<PropsWithChildren<ItemLayerProps>> = ({
  boxSize,
  scale,
  children,
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
      {children}
    </div>
  );
};

export default ItemLayer;
