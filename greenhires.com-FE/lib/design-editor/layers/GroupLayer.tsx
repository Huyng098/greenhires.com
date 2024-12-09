import { LayerComponentProps } from "@lidojs/design-core";
import { PropsWithChildren } from "react";
import { LayerComponent } from "../types";

export interface GroupLayerProps extends LayerComponentProps {
  scale: number;
}
const GroupLayer: LayerComponent<PropsWithChildren<GroupLayerProps>> = ({
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

GroupLayer.info = {
  name: "Group",
  type: "Group",
};

export default GroupLayer;
