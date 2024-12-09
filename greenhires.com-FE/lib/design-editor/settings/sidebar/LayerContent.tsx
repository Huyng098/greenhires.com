import { DraggableSyntheticListeners } from "@dnd-kit/core";
import DotsSixVerticalBoldIcon from "@duyank/icons/bold/DotsSixVerticalBold";
import DotsThreeBoldIcon from "@duyank/icons/bold/DotsThreeBold";
import BoundingBoxIcon from "@duyank/icons/regular/BoundingBox";
import { LayerComponentProps } from "@lidojs/design-core";
import React, {
  CSSProperties,
  forwardRef,
  ForwardRefRenderFunction,
  HTMLProps,
} from "react";
import { useSelectedLayers } from "../../hooks";
import { Layer } from "../../types";
import { isGroupLayer } from "../../ultils/layer/layers";
import ReverseTransformLayer from "./layer/ReverseTransformLayer";

type Props = HTMLProps<HTMLDivElement> & {
  layer: Layer<LayerComponentProps>;
  onOpenOption?: (e: React.MouseEvent) => void;
  listeners?: DraggableSyntheticListeners;
  extraCSS?: CSSProperties;
};

const LayerContent: ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { layer, onOpenOption, listeners, extraCSS, ...props },
  ref
) => {
  const { selectedLayerIds } = useSelectedLayers();
  return (
    <div
      ref={ref}
      style={{
        background: "#F6F6F6",
        borderRadius: 8,
        padding: 8,
        cursor: "pointer",
        position: "relative",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: selectedLayerIds.includes(layer.id)
          ? "#3d8eff"
          : "transparent",
        ...(extraCSS ?? {}),
      }}
      {...props}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 24,
            width: 40,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
          }}
          {...listeners}
        >
          <DotsSixVerticalBoldIcon />
        </div>
        <div style={{ minWidth: 0, flexGrow: 1 }}>
          <ReverseTransformLayer layer={layer} />
        </div>
        {isGroupLayer(layer) && (
          <div style={{ flexShrink: 0, fontSize: 24 }}>
            <BoundingBoxIcon />
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          right: 4,
          top: 4,
          background: "#5E6278",
          borderRadius: 8,
          color: "#fff",
          padding: "0 6px",
        }}
        onClick={onOpenOption}
      >
        <DotsThreeBoldIcon />
      </div>
    </div>
  );
};

export default forwardRef(LayerContent);
