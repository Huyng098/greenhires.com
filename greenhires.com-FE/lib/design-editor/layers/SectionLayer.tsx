import { LayerComponentProps } from "@lidojs/design-core";
import { PropsWithChildren } from "react";
import { useEditor } from "../hooks";
import { LayerComponent } from "../types";
export interface SectionLayerProps extends LayerComponentProps {
  scale: number;
  maxColumns?: number;
}
const SectionLayer: LayerComponent<PropsWithChildren<SectionLayerProps>> = ({
  boxSize,
  scale,
  children,
}) => {
  const { actions, activePage } = useEditor((state) => ({
    activePage: state.activePage,
  }));
  const handleStartSelect = () => {
    //actions.selectLayers(activePage, "sections.experience.name", "add");
  };
  return (
    <>
      <div
        style={{
          transformOrigin: "0 0",
          width: boxSize.width / scale,
          height: boxSize.height / scale,
          transform: `scale(${scale})`,
        }}
        onClick={handleStartSelect}
      >
        {children}
      </div>
    </>
  );
};

SectionLayer.info = {
  name: "Section",
  type: "Section",
};

export default SectionLayer;
