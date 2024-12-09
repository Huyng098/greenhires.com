import TriangleIcon from "@duyank/icons/shape/Triangle";
import {
  BoxSize,
  Delta,
  getTransformStyle,
  LayerType,
} from "@lidojs/design-core";
import { forwardRef, ForwardRefRenderFunction, PropsWithChildren } from "react";
import { useEditor } from "../../hooks";

interface LayerBorderBoxProps {
  boxSize: BoxSize;
  position?: Delta;
  rotate: number;
  dx?: number;
  dy?: number;
  type?: "dashed" | "solid";
  layerType?: LayerType | "Section" | "Item" | "Resume";
}

const LayerBorderBox: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<LayerBorderBoxProps>
> = (
  { boxSize, position, rotate, dx = 0, dy = 0, type = "solid", layerType },
  ref
) => {
  const { scale } = useEditor((state) => ({
    scale: state.scale,
  }));

  return (
    <div
      ref={ref}
      style={{
        width: boxSize.width * scale,
        height: boxSize.height * scale,
        position: "absolute",
        transform: position
          ? getTransformStyle({
              position: {
                x: (position.x + dx) * scale,
                y: (position.y + dy) * scale,
              },
              rotate,
            })
          : undefined,
      }}
    >
      {type === "solid" && layerType !== "Line" && (
        <div
          style={{
            border: "2px solid #3d8eff",
            boxShadow:
              "0 0 0 1px hsla(0,0%,100%,.07), inset 0 0 0 1px hsla(0,0%,100%,.07)",
            position: "absolute",
            inset: -1,
            transform: `translate(${dx}px, ${dy}px)`,
          }}
        />
      )}
      {type === "dashed" && layerType !== "Line" && (
        <div
          style={{
            inset: -1,
            position: "absolute",
            backgroundImage:
              "linear-gradient(90deg,#fff 60%,rgba(53,71,90,.2) 0),linear-gradient(180deg,#fff 60%,rgba(53,71,90,.2) 0),linear-gradient(90deg,#fff 60%,rgba(53,71,90,.2) 0),linear-gradient(180deg,#fff 60%,rgba(53,71,90,.2) 0),linear-gradient(90deg,rgba(57,76,96,.15),rgba(57,76,96,.15)),linear-gradient(180deg,rgba(57,76,96,.15),rgba(57,76,96,.15)),linear-gradient(90deg,rgba(57,76,96,.15),rgba(57,76,96,.15)),linear-gradient(180deg,rgba(57,76,96,.15),rgba(57,76,96,.15))",
            backgroundPosition:
              "top,100%,bottom,0,center 2px,calc(100% - 2px),center calc(100% - 2px),2px",
            backgroundRepeat:
              "repeat-x,repeat-y,repeat-x,repeat-y,no-repeat,no-repeat,no-repeat,no-repeat",
            backgroundSize:
              "6px 2px,2px 6px,6px 2px,2px 6px,calc(100% - 6px) 1px,1px calc(100% - 4px),calc(100% - 6px) 1px,1px calc(100% - 4px)",
          }}
        />
      )}
      {layerType === "Video" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: getTransformStyle({
              rotate: -rotate,
            }),
            display:
              boxSize.width > 80 && boxSize.height > 80 ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: boxSize.height <= 180 || boxSize.width <= 180 ? 24 : 48,
              height: boxSize.height <= 180 || boxSize.width <= 180 ? 24 : 48,
              background: "rgba(17,23,29,.6)",
              borderRadius: "50%",
              color: "#fff",
              fontSize: boxSize.height <= 180 || boxSize.width <= 180 ? 8 : 16,
              transform: getTransformStyle({
                rotate: 90,
              }),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TriangleIcon />
          </div>
        </div>
      )}
    </div>
  );
};

export default forwardRef<HTMLDivElement, LayerBorderBoxProps>(LayerBorderBox);
