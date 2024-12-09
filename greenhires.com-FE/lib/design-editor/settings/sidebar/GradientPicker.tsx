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
import Popover from "../../common/popover/Popover";

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
const GradientPicker: FC<PropsWithChildren<GradientPickerProps>> = ({
  selectedColor,
  gradient,
  event,
  children,
  onChangeGradient,
  onChangeColor,
}) => {
  const mainRef = useRef<HTMLDivElement>(null);
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
  const handleChangeGradientType = (style: GradientStyle) => {
    setTmpGradient({
      colors: gradientColors,
      style,
    });
  };

  const handleChangeGradientColor = (color: string) => {
    if (editColorPicker) {
      const g = [...gradientColors];
      g[editColorPicker.index] = new Color(color).toRgbString();
      setTmpGradient({
        colors: g,
        style: tmpGradient?.style || "leftToRight",
      });
    }
  };

  const handleAddGradient = () => {
    const newColor = gradientColors[gradientColors.length - 1];
    setTmpGradient({
      colors: [...gradientColors, newColor],
      style: gradient?.style || "leftToRight",
    });
    setEditColorPicker({ index: gradientColors.length, color: newColor });
  };

  const handleSwitchGradient = () => {
    setTmpGradient({
      colors: tmpGradient?.colors || [],
      style: tmpGradient?.style || "leftToRight",
    });
  };

  const handleDeleteGradientColor = (index: number) => {
    if (tmpGradient) {
      setTmpGradient({
        colors: tmpGradient.colors.filter((_, i) => i !== index),
        style: tmpGradient.style,
      });
    }
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
      <Popover
        ref={mainRef}
        anchorEl={gradientRef.current}
        offsets={{ bottom: { y: 8, x: 0 } }}
        open={openGradientPicker}
        placement={"bottom"}
        onClose={() => {
          setOpenGradientPicker(false);
          setEditColorPicker(null);
        }}
      >
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
          {tab === "solid" && (
            <div style={{}}>
              <ColorPicker
                color={new Color(tmpColor).toHex()}
                onChange={handleChangeSolidColor}
              />
            </div>
          )}
          {tab === "gradient" && (
            <div
              style={{
                display: "grid",
                rowGap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 700, lineHeight: 2.2 }}>
                  Gradient colors
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      " repeat(auto-fill, minmax(40px, 1fr))",
                    gridGap: 8,
                  }}
                >
                  {tmpGradient?.colors.map((color, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <ColorIcon
                        ref={(el) => {
                          colorRef.current[i] = el as HTMLDivElement;
                        }}
                        color={color}
                        selected={null}
                        onClick={() => setEditColorPicker({ index: i, color })}
                      />
                      <div
                        className="hover:opacity-100"
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          fontSize: 12,
                          padding: 4,
                          borderRadius: "50%",
                          opacity: 0,
                          transition: "opacity .15s ease-in-out",
                          background: "rgba(17,23,29,.6)",
                          color: "#fff",
                          display:
                            tmpGradient?.colors.length > 2 ? "block" : "none",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          tmpGradient?.colors.length > 2 &&
                          handleDeleteGradientColor(i)
                        }
                      >
                        <XIcon />
                      </div>
                    </div>
                  ))}
                  <Popover
                    anchorEl={
                      editColorPicker && colorRef.current[editColorPicker.index]
                    }
                    element={mainRef.current}
                    offsets={{ bottom: { y: 8, x: 0 } }}
                    open={!!editColorPicker}
                    placement={"bottom"}
                    onClose={() => setEditColorPicker(null)}
                  >
                    <div style={{ padding: 16, width: 280 }}>
                      <ColorPicker
                        color={new Color(
                          editColorPicker?.color || "#f25022"
                        ).toHex()}
                        enableAlpha={true}
                        onChange={handleChangeGradientColor}
                      />
                    </div>
                  </Popover>
                  <div
                    style={{
                      paddingBottom: "100%",
                      position: "relative",
                      width: "100%",
                      cursor: "pointer",
                    }}
                    onClick={handleAddGradient}
                  >
                    <div
                      className="hover:bg-[rgba(57,76,96,.15)]"
                      style={{
                        background: "rgba(64,87,109,.07)",
                        fontSize: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        inset: 0,
                        borderRadius: 4,
                        transition:
                          "background-color .1s linear,border-color .1s linear,color .1s linear",
                      }}
                    >
                      <PlusIcon />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, lineHeight: 2.2 }}>Style</div>
                <div
                  style={{
                    display: "grid",
                    columnGap: 8,
                    gridAutoFlow: "column",
                  }}
                >
                  {GRADIENT_STYLE.map((style) => (
                    <div
                      key={style}
                      style={{
                        width: "100%",
                        height: 40,
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                      onClick={() => handleChangeGradientType(style)}
                    >
                      <div
                        style={{
                          backgroundColor: "#fff",
                          backgroundPosition: "0 0, 6px 6px",
                          backgroundSize: "12px 12px",
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          backgroundImage:
                            "linear-gradient(-45deg,rgba(57,76,96,.15) 25%,transparent 25%,transparent 75%,rgba(57,76,96,.15) 75%),linear-gradient(-45deg,rgba(57,76,96,.15) 25%,transparent 25%,transparent 75%,rgba(57,76,96,.15) 75%)",
                        }}
                      >
                        <div
                          style={{
                            background: getGradientBackground(
                              gradientColors,
                              style
                            ),
                            position: "absolute",
                            inset: 0,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Popover>
    </Fragment>
  );
};

export default GradientPicker;
