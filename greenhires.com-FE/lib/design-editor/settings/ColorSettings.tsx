import { getGradientBackground, GradientStyle } from "@lidojs/design-core";
import { Color } from "@lidojs/design-utils";
import { FC, Fragment, PropsWithChildren, useMemo } from "react";
import { useEditor } from "../hooks";
import SettingButton from "./SettingButton";
import ColorSidebar from "./sidebar/ColorSidebar";

interface ColorSettingsProps {
  keyColor?: "CHOOSING_SHAPE_COLOR" | "CHOOSING_SHAPE_BORDER_COLOR";
  colors: string[];
  gradient?: { colors: string[]; style: GradientStyle } | null;
  useGradient?: boolean;
  onChange: (color: string) => void;
  onChangeGradient?: (gradient: {
    colors: string[];
    style: GradientStyle;
  }) => void;
}

const ColorSettings: FC<PropsWithChildren<ColorSettingsProps>> = ({
  keyColor,
  colors,
  gradient,
  useGradient,
  children,
  onChange,
  onChangeGradient,
}) => {
  const { actions, sidebar } = useEditor((state) => ({
    sidebar: state.sidebar,
  }));

  const linearGradient = useMemo(() => {
    if (
      (colors.length === 0 ||
        (colors.length === 1 && new Color(colors[0]).white() === 100)) &&
      !gradient
    ) {
      return "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)";
    }
    if (gradient) {
      return getGradientBackground(gradient.colors, gradient.style);
    }
    return colors
      .map((color) => `linear-gradient(to right, ${color}, ${color})`)
      .join(", ");
  }, [colors, gradient]);
  return (
    <Fragment>
      <SettingButton
        onClick={() => {
          actions.setSidebar(keyColor || "CHOOSING_COLOR");
        }}
      >
        {!children && (
          <div
            style={{
              width: 24,
              height: 24,
              boxShadow: "inset 0 0 0 1px rgba(57,76,96,.15)",
              borderRadius: 2,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                backgroundPosition: "0 0, 6px 6px",
                backgroundSize: "12px 12px",
                inset: 0,
                position: "absolute",
                backgroundImage:
                  "linear-gradient(-45deg,rgba(57,76,96,.15) 25%,transparent 25%,transparent 75%,rgba(57,76,96,.15) 75%),linear-gradient(-45deg,rgba(57,76,96,.15) 25%,transparent 25%,transparent 75%,rgba(57,76,96,.15) 75%)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: linearGradient,
                }}
              />
            </div>
          </div>
        )}
        {children}
      </SettingButton>
      {(sidebar === keyColor || sidebar === "CHOOSING_COLOR") && (
        <ColorSidebar
          gradient={gradient}
          open={true}
          selected={colors.length === 1 ? colors[0] : null}
          useGradient={useGradient}
          onChangeGradient={onChangeGradient}
          onSelect={onChange}
        />
      )}
    </Fragment>
  );
};

export default ColorSettings;
