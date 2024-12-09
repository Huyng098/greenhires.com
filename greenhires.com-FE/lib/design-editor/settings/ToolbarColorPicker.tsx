import PlusIcon from "@duyank/icons/regular/Plus";
import XIcon from "@duyank/icons/regular/X";
import { ColorIcon, ColorPicker } from "@lidojs/color-picker";
import { getGradientBackground } from "@lidojs/design-core";
import { Color } from "@lidojs/design-utils";
import {
  FC,
  Fragment,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type GradientStyle =
  | "leftToRight"
  | "topToBottom"
  | "topLeftToBottomRight"
  | "circleCenter"
  | "circleTopLeft";

interface GradientPickerProps {
  selectedColor: string;
  event: "click" | "doubleClick";
  gradient?: { colors: string[]; style: GradientStyle } | null;
  onChangeGradient: (gradient: {
    colors: string[];
    style: GradientStyle;
  }) => void;
  onChangeColor: (color: string) => void;
}

const GRADIENT_STYLE: GradientStyle[] = [
  "leftToRight",
  "topToBottom",
  "topLeftToBottomRight",
  "circleCenter",
  "circleTopLeft",
];
const ToolbarColorPicker: FC<PropsWithChildren<GradientPickerProps>> = ({
  selectedColor,
  gradient,
  event,
  children,
  onChangeGradient,
  onChangeColor,
}) => {
  const gradientRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement[]>([]);
  const [openGradientPicker, setOpenGradientPicker] = useState(false);
  const [editColorPicker, setEditColorPicker] = useState<{
    index: number;
    color: string;
  } | null>(null);
  const [tab, setTab] = useState(gradient ? "gradient" : "solid");
  const [tmpGradient, setTmpGradient] = useState<{
    colors: string[];
    style: GradientStyle;
  }>();
  const [tmpColor, setTmpColor] = useState<string>(selectedColor);
  const gradientColors = useMemo(() => {
    if (gradient?.colors.length) {
      return gradient?.colors;
    } else {
      const c = new Color(selectedColor);
      const hsl = c.toHsl();
      if (hsl.l < 50) {
        hsl.l = Math.min(100, hsl.l + 30);
      } else {
        hsl.l = Math.max(0, hsl.l - 30);
      }
      return [c.toRgbString(), new Color(hsl).toRgbString()];
    }
  }, [gradient, selectedColor]);
  useEffect(() => {
    if (openGradientPicker) {
      setTmpGradient({
        colors: gradientColors,
        style: gradient?.style || "leftToRight",
      });
    }
    // init color when picker open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openGradientPicker]);
  useEffect(() => {
    if (tmpGradient && tab === "gradient") {
      onChangeGradient(tmpGradient);
    }
  }, [tmpGradient, tab, onChangeGradient]);
  const handleChangeSolidColor = (color: string) => {
    setTmpColor(color);
    onChangeColor(color);
  };

  const handleSwitchGradient = () => {
    setTmpGradient({
      colors: tmpGradient?.colors || [],
      style: tmpGradient?.style || "leftToRight",
    });
  };

  return (
    <Fragment>
      <div
        ref={gradientRef}
        style={{ cursor: "pointer" }}
        onClick={() => event === "click" && setOpenGradientPicker(true)}
        onDoubleClick={() =>
          event === "doubleClick" && setOpenGradientPicker(true)
        }
      >
        {children}
      </div>
      <div style={{ padding: "0 16px 16px 16px", width: 280 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 12,
            borderBottom: "1px solid rgba(217, 219, 228, 0.6)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              cursor: "pointer",
              padding: 8,
              flexGrow: 1,
              textAlign: "center",
              overflow: "hidden",
              flexShrink: 0,
              fontWeight: 700,
              whiteSpace: "nowrap",
              color: tab === "solid" ? "#3d8eff" : "rgba(13,18,22,.7)",
            }}
            onClick={() => {
              setTab("solid");
              onChangeColor(tmpColor);
            }}
          >
            Solid Color
          </div>
          <div
            style={{
              display: "inline-block",
              cursor: "pointer",
              padding: 8,
              flexGrow: 1,
              textAlign: "center",
              overflow: "hidden",
              flexShrink: 0,
              fontWeight: 700,
              whiteSpace: "nowrap",
              color: tab === "gradient" ? "#3d8eff" : "rgba(13,18,22,.7)",
            }}
            onClick={() => {
              setTab("gradient");
              handleSwitchGradient();
            }}
          >
            Gradient
          </div>
        </div>

        <div style={{}}>
          <ColorPicker
            color={new Color(tmpColor).toHex()}
            onChange={handleChangeSolidColor}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default ToolbarColorPicker;
