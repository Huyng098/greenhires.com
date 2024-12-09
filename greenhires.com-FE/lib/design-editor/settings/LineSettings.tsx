import SquareBoldIcon from "@duyank/icons/bold/SquareBold";
import BorderWeightIcon from "@duyank/icons/external/BorderWeight";
import DotsIcon from "@duyank/icons/external/Dots";
import LongDashesIcon from "@duyank/icons/external/LongDashes";
import ShortDashesIcon from "@duyank/icons/external/ShortDashes";
import SolidIcon from "@duyank/icons/external/Solid";
import { ArrowType, LineStyle } from "@lidojs/design-core";
import { FC, ReactElement, useMemo, useRef, useState } from "react";
import Popover from "../common/popover/Popover";
import Slider from "../common/slider/Slider";
import { useEditor } from "../hooks";
import { LineLayerProps } from "../layers";
import { Layer } from "../types";
import ColorSettings from "./ColorSettings";
import SettingButton from "./SettingButton";
import ArrowTypeDropDown from "./sidebar/ArrowTypeDropDown";

interface ShapeSettingsProps {
  layers: Layer<LineLayerProps>[];
}

const lineStyles: { type: LineStyle; icon: ReactElement }[] = [
  { type: "solid", icon: <SolidIcon /> },
  { type: "longDashes", icon: <LongDashesIcon /> },
  { type: "shortDashes", icon: <ShortDashesIcon /> },
  { type: "dots", icon: <DotsIcon /> },
];

const LineSettings: FC<ShapeSettingsProps> = ({ layers }) => {
  const borderRef = useRef<HTMLDivElement>(null);
  const { actions, activePage } = useEditor((state) => ({
    activePage: state.activePage,
  }));
  const [openBorderSetting, setOpenBorderSetting] = useState(false);

  const colors = useMemo(() => {
    return layers.map((layer) => layer.data.props.color);
  }, [layers]);

  const arrowStart = useMemo(() => {
    return layers.map((layer) => layer.data.props.arrowStart);
  }, [layers]);

  const arrowEnd = useMemo(() => {
    return layers.map((layer) => layer.data.props.arrowEnd);
  }, [layers]);

  const styles = useMemo(() => {
    return layers.map((layer) => layer.data.props.style);
  }, [layers]);

  const lineWeight = useMemo(() => {
    return layers.map((layer) => layer.data.props.boxSize.height);
  }, [layers]);

  const updateColor = (color: string) => {
    layers.forEach((layer) => {
      actions.history
        .throttle(2000)
        .setProp<LineLayerProps>(activePage, layer.id, {
          color,
        });
    });
  };
  const updateLineWeight = (height: number) => {
    // TODO recalculate position
    layers.forEach((layer) => {
      actions.history
        .throttle(2000)
        .setProp<LineLayerProps>(activePage, layer.id, {
          boxSize: {
            height,
          },
        });
    });
  };

  const updateStyle = (style: LineStyle) => {
    layers.forEach((layer) => {
      actions.history
        .throttle(2000)
        .setProp<LineLayerProps>(activePage, layer.id, {
          style,
        });
    });
  };

  const updateArrowStart = (arrowType: ArrowType) => {
    layers.forEach((layer) => {
      actions.history
        .throttle(2000)
        .setProp<LineLayerProps>(activePage, layer.id, {
          arrowStart: arrowType,
        });
    });
  };

  const updateArrowEnd = (arrowType: ArrowType) => {
    layers.forEach((layer) => {
      actions.history
        .throttle(2000)
        .setProp<LineLayerProps>(activePage, layer.id, {
          arrowEnd: arrowType,
        });
    });
  };

  return (
    <div
      style={{
        display: "grid",
        alignItems: "center",
        gridAutoFlow: "column",
        gridGap: 8,
      }}
    >
      <ColorSettings colors={colors} onChange={updateColor}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 2,
            position: "relative",
            fontSize: 24,
            overflow: "hidden",
            color: colors[0],
          }}
        >
          <SquareBoldIcon />
        </div>
      </ColorSettings>
      <SettingButton
        ref={borderRef}
        style={{ fontSize: 20 }}
        onClick={() => setOpenBorderSetting(true)}
      >
        <BorderWeightIcon />
      </SettingButton>
      <Popover
        anchorEl={borderRef.current}
        offsets={{
          "bottom-end": { x: 0, y: 8 },
        }}
        open={openBorderSetting}
        placement={"bottom"}
        onClose={() => setOpenBorderSetting(false)}
      >
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <div>
            <div
              style={{
                display: "grid",
                gridAutoFlow: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              {lineStyles.map((style) => (
                <div
                  key={style.type}
                  style={{
                    fontSize: 24,
                    borderRadius: 4,
                    boxShadow:
                      style.type === styles[0]
                        ? "inset 0 0 0 2px #3d8eff"
                        : "inset 0 0 0 1px rgba(43,59,74,.3)",
                    padding: 8,
                    cursor: "pointer",
                  }}
                  onClick={() => updateStyle(style.type)}
                >
                  {style.icon}
                </div>
              ))}
            </div>
          </div>

          <Slider
            label={"Line Weight"}
            min={1}
            value={lineWeight[0] || 1}
            onChange={updateLineWeight}
          />
        </div>
      </Popover>
      <ArrowTypeDropDown value={arrowStart[0]!} onChange={updateArrowStart} />
      <ArrowTypeDropDown
        position="end"
        value={arrowEnd[0]!}
        onChange={updateArrowEnd}
      />
      <div
        style={{ height: 24, width: `1px`, background: "rgba(57,76,96,.15)" }}
      />
    </div>
  );
};

export default LineSettings;
