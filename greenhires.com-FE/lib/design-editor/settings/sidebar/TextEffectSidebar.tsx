"use client";
import XIcon from "@duyank/icons/regular/X";
import { ColorIcon, ColorPicker } from "@lidojs/color-picker";
import { Color, hex2rgbString } from "@lidojs/design-utils";
import { cloneDeep, throttle } from "lodash";
import Image from "next/image";
import {
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import Popover from "../../common/popover/Popover";
import Slider from "../../common/slider/Slider";
import { EditorContext } from "../../editor/EditorContext";
import { useEditor, useSelectedLayers } from "../../hooks";
import { TextLayerProps } from "../../layers/TextLayer";
import { Layer } from "../../types";
import { isTextLayer } from "../../ultils/layer/layers";
import Sidebar, { SidebarProps } from "./Sidebar";

const getEffectList = (assetPath: string) => [
  {
    value: "none",
    img: `${assetPath}/text/effects/none.png`,
  },
  {
    value: "shadow",
    img: `${assetPath}/text/effects/shadow.png`,
    settings: {
      offset: 50,
      direction: 45,
      blur: 0,
      transparency: 40,
      color: "#000000",
    },
  },
  {
    value: "lift",
    img: `${assetPath}/text/effects/lift.png`,
    settings: {
      intensity: 50,
    },
  },
  {
    value: "hollow",
    img: `${assetPath}/text/effects/hollow.png`,
    settings: {
      thickness: 50,
    },
  },
  {
    value: "splice",
    img: `${assetPath}/text/effects/splice.png`,
    settings: {
      thickness: 50,
      offset: 50,
      direction: 45,
      color: "#000000",
    },
  },
  {
    value: "echo",
    img: `${assetPath}/text/effects/echo.png`,
    settings: {
      offset: 50,
      direction: 45,
      color: "#000000",
    },
  },
];

type TextEffectSidebarProps = SidebarProps;
const TextEffectSidebar: ForwardRefRenderFunction<
  HTMLDivElement,
  TextEffectSidebarProps
> = ({ ...props }, ref) => {
  const {
    config: { assetPath },
  } = useContext(EditorContext);
  const addColorRef = useRef<HTMLDivElement>(null);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const { selectedLayers } = useSelectedLayers();
  const { actions, activePage } = useEditor((state) => ({
    activePage: state.activePage,
  }));
  const textLayers = selectedLayers.filter((layer) =>
    isTextLayer(layer)
  ) as unknown as Layer<TextLayerProps>[];

  const { effect, settings } = useMemo(() => {
    return textLayers.reduce(
      (acc, layer) => {
        const props = layer.data.props as TextLayerProps;
        if (props.effect) {
          if (
            props.effect.name === acc.effect ||
            (props.effect.name && acc.effect === "none")
          ) {
            acc.effect = props.effect.name;
            acc.settings = props.effect.settings;
          } else {
            acc.effect = "none";
            acc.settings = {};
          }
        }
        return acc;
      },
      { effect: "none", settings: {} }
    );
  }, [textLayers]);

  const handleSetEffect = (effect: string) => {
    actions.history.new();
    textLayers.forEach(
      ({
        id,
        data: {
          props: { colors },
        },
      }) => {
        if (effect === "none") {
          actions.setProp<TextLayerProps>(activePage, id, {
            effect: null,
          });
        } else {
          const settings = cloneDeep(
            getEffectList(assetPath).find((e) => e.value === effect)
              ?.settings as Record<string, unknown>
          );
          if (colors.length > 0) {
            const c = new Color(colors[0]);
            if (c.white() > 50) {
              settings.color = c.darken(0.5).toRgbString();
            } else {
              settings.color = c.whiten(0.5).toRgbString();
            }
          }
          actions.history.merge().setProp<TextLayerProps>(
            activePage,
            id,
            {
              effect: {
                name: effect,
                settings,
              },
            },
            (objVal, srcVal) => {
              if (srcVal) {
                return srcVal;
              }
            }
          );
        }
      }
    );
  };
  const handleChangeSetting = throttle(
    (key: string, value: number | string) => {
      const layerIds = textLayers.map((l) => l.id);
      actions.history
        .throttle(2000)
        .setProp<TextLayerProps>(activePage, layerIds, {
          effect: {
            settings: {
              [key]: value,
            },
          },
        });
    },
    16
  );
  return (
    <Sidebar ref={ref} {...props}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          height: 48,
          borderBottom: "1px solid rgba(57,76,96,.15)",
          padding: "0 20px",
        }}
      >
        <p
          style={{
            lineHeight: "48px",
            fontWeight: 600,
            color: "#181C32",
            flexGrow: 1,
          }}
        >
          Text Effects
        </p>
        <div
          style={{
            fontSize: 20,
            flexShrink: 0,
            width: 32,
            height: 32,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => {
            actions.setSidebar();
          }}
        >
          <XIcon />
        </div>
      </div>
      <div style={{ padding: "24px 16px" }}>
        <p>Style</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,minmax(0,1fr))",
            gap: 12,
            fontSize: 10,
          }}
        >
          {getEffectList(assetPath).map((ef) => (
            <div key={ef.value}>
              <div
                style={{ cursor: "pointer", position: "relative" }}
                onClick={() => handleSetEffect(ef.value)}
              >
                <div style={{ paddingBottom: "100%", width: "100%" }} />
                <Image
                  alt={"Text Effect"}
                  className="hover:shadow-[00_0_0_2px_#3d8eff,inset_0_0_0_2px_#fff]"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    borderRadius: 4,
                    boxShadow:
                      ef.value === effect
                        ? "0 0 0 2px #3d8eff,inset 0 0 0 2px #fff"
                        : "0 0 0 1px rgba(43,59,74,.3)",
                  }}
                  fill
                  src={ef.img}
                />
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: 4,
                  lineHeight: "20px",
                  textTransform: "capitalize",
                }}
              >
                {ef.value}
              </div>
            </div>
          ))}
          {settings && (
            <div
              style={{
                gridRow: `${
                  Math.ceil(
                    (1 +
                      getEffectList(assetPath).findIndex(
                        (e) => e.value === effect
                      )) /
                      3
                  ) + 1
                } / auto`,
                gridColumn: "1/-1",
                padding: "8px 0",
              }}
            >
              <div
                style={{
                  display: "grid",
                  rowGap: 8,
                }}
              >
                {Object.entries(settings).map(([settingKey, value]) => (
                  <Fragment key={settingKey}>
                    {settingKey !== "color" && (
                      <Slider
                        defaultValue={value as number}
                        label={settingKey}
                        max={settingKey === "direction" ? 180 : 100}
                        min={settingKey === "direction" ? -180 : 0}
                        onChange={(value) => {
                          handleChangeSetting(settingKey, value);
                        }}
                      />
                    )}
                    {settingKey === "color" && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            flexGrow: 1,
                            fontSize: 14,
                            textTransform: "capitalize",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Color
                        </div>
                        <div
                          ref={addColorRef}
                          style={{ width: 32, height: 32 }}
                        >
                          <ColorIcon
                            color={value as string}
                            selected={null}
                            onClick={() => setOpenColorPicker(true)}
                          />
                        </div>
                        <Popover
                          anchorEl={addColorRef.current}
                          open={openColorPicker}
                          placement={"bottom-end"}
                          onClose={() => setOpenColorPicker(false)}
                        >
                          <div style={{ padding: 16, width: 280 }}>
                            <ColorPicker
                              color={new Color(
                                (value as string) || "#f25022"
                              ).toHex()}
                              onChange={(color) => {
                                handleChangeSetting(
                                  settingKey,
                                  hex2rgbString(color)
                                );
                              }}
                            />
                          </div>
                        </Popover>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default forwardRef<HTMLDivElement, TextEffectSidebarProps>(
  TextEffectSidebar
);
