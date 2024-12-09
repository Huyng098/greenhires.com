"use client";
import { LayerSettings, useSelectedLayers } from "@/lib/design-editor";

const AppLayerSettings = () => {
  const { selectedLayerIds } = useSelectedLayers();
  return (
    <div
      className={`max-[900px]:fixed max-[900px]:bottom-0 max-[900px]:left-0 max-[900px]:right-0 max-[900px]:bg-[#fff] max-[900px]:justify-center max-[900px]:z-[20] max-[900px]:h-[72px] ${selectedLayerIds.length > 0 ? "max-[900px]:flex" : ""}`}
      style={{
        background: "white",
        borderBottom: "1px solid rgba(57,76,96,.15)",
        height: 50,
        overflowX: "auto",
        flexShrink: 0,
      }}
    >
      <LayerSettings />
    </div>
  );
};

export default AppLayerSettings;
