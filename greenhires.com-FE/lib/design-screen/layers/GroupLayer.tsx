import { LayerComponentProps } from "@lidojs/design-core";
import { FC, PropsWithChildren } from "react";

export interface GroupLayerProps extends LayerComponentProps {
  scale: number;
}

const GroupLayer: FC<PropsWithChildren<GroupLayerProps>> = ({
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

export default GroupLayer;
