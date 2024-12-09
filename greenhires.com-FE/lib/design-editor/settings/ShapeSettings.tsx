import SquareBoldIcon from "@duyank/icons/bold/SquareBold";
import TextBBoldIcon from "@duyank/icons/bold/TextBBold";
import BorderWeightIcon from "@duyank/icons/external/BorderWeight";
import DotsIcon from "@duyank/icons/external/Dots";
import LineSpacingIcon from "@duyank/icons/external/LineSpacing";
import LongDashesIcon from "@duyank/icons/external/LongDashes";
import NotAllowedIcon from "@duyank/icons/external/NotAllowed";
import ShortDashesIcon from "@duyank/icons/external/ShortDashes";
import SolidIcon from "@duyank/icons/external/Solid";
import CaretDownIcon from "@duyank/icons/regular/CaretDown";
import CheckIcon from "@duyank/icons/regular/Check";
import ListBulletsIcon from "@duyank/icons/regular/ListBullets";
import ListNumbersIcon from "@duyank/icons/regular/ListNumbers";
import MinusIcon from "@duyank/icons/regular/Minus";
import PlusIcon from "@duyank/icons/regular/Plus";
import TextAaIcon from "@duyank/icons/regular/TextAa";
import TextAlignCenterIcon from "@duyank/icons/regular/TextAlignCenter";
import TextAlignJustifyIcon from "@duyank/icons/regular/TextAlignJustify";
import TextAlignLeftIcon from "@duyank/icons/regular/TextAlignLeft";
import TextAlignRightIcon from "@duyank/icons/regular/TextAlignRight";
import TextAUnderlineIcon from "@duyank/icons/regular/TextAUnderline";
import TextItalicIcon from "@duyank/icons/regular/TextItalic";
import TextUnderlineIcon from "@duyank/icons/regular/TextUnderline";
import {
  Font,
  FontData,
  GradientStyle,
  LayerComponentProps,
  LayerId,
  ShapeBorderStyle,
  getControlBoxSizeFromLayers,
  getPositionChangesBetweenTwoCorners,
  getTransformStyle,
  getVirtualDomHeight,
  visualCorners,
} from "@lidojs/design-core";
import { Color } from "@lidojs/design-utils";
import { isEqual, throttle, uniq, uniqBy } from "lodash";
import { EditorState } from "prosemirror-state";
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Popover from "../common/popover/Popover";
import Slider from "../common/slider/Slider";
import {
  setBold,
  toggleBold,
  unsetBold,
  unsetBoldOfBlock,
} from "../common/text-editor/core/command/bold";
import {
  setItalic,
  toggleItalic,
  unsetItalic,
  unsetItalicOfBlock,
} from "../common/text-editor/core/command/italic";
import { selectAll } from "../common/text-editor/core/command/selectAll";
import { selectNode } from "../common/text-editor/core/command/selectNode";
import { selectText } from "../common/text-editor/core/command/selectText";
import { setBulletList } from "../common/text-editor/core/command/setBulletList";
import { setFontFamily } from "../common/text-editor/core/command/setFontFamily";
import { setFontSize } from "../common/text-editor/core/command/setFontSize";
import { setLetterSpacing } from "../common/text-editor/core/command/setLetterSpacing";
import { setLineHeight } from "../common/text-editor/core/command/setLineHeight";
import { setOrderedList } from "../common/text-editor/core/command/setOrderedList";
import { setTextAlign } from "../common/text-editor/core/command/setTextAlign";
import { setTextTransform } from "../common/text-editor/core/command/setTextTransform";
import {
  setColor,
  setColorForBlock,
} from "../common/text-editor/core/command/textColor";
import {
  setUnderline,
  toggleUnderline,
  unsetUnderline,
} from "../common/text-editor/core/command/underline";
import { isActive } from "../common/text-editor/core/helper/isActive";
import { isEmptyContent } from "../common/text-editor/core/helper/isEmptyContent";
import {
  getAllAttrs,
  getAllMarks,
  getAttrs,
  getColor,
  getFontFamily,
  getFontSize,
  getLetterSpacing,
  getLineHeight,
  getMarkAttrs,
} from "../common/text-editor/mark";
import { useEditor, useSelectedLayers } from "../hooks";
import { TextLayerProps } from "../layers";
import { useUsedFont } from "../layers/hooks/useUsedFont";
import { ShapeLayerProps } from "../layers/ShapeLayer";
import { Layer } from "../types";
import ColorSettings from "./ColorSettings";
import SettingButton from "./SettingButton";
import ColorSidebarTextShape from "./sidebar/ColorSidebarTextShape";
import FontSidebar from "./sidebar/FontSidebar";
import TextEffectSidebar from "./sidebar/TextEffectSidebar";

interface ShapeSettingsProps {
  layers: Layer<ShapeLayerProps>[];
}

const fontSizeList = [
  6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 88, 96,
  104, 120, 144,
];

const shapeStyles: { type: ShapeBorderStyle; icon: ReactElement }[] = [
  {
    type: "none",
    icon: <NotAllowedIcon />,
  },
  { type: "solid", icon: <SolidIcon /> },
  { type: "longDashes", icon: <LongDashesIcon /> },
  { type: "shortDashes", icon: <ShortDashesIcon /> },
  { type: "dots", icon: <DotsIcon /> },
];
const ShapeSettings: FC<ShapeSettingsProps> = ({ layers }) => {
  const fontSizeRef = useRef<HTMLDivElement>(null);
  const fontSizeInputRef = useRef<HTMLInputElement>(null);
  const spacingRef = useRef<HTMLDivElement>(null);
  const [openSpacingSetting, setOpenSpacingSetting] = useState(false);
  const [openFontSizeSelection, setOpenFontSizeSelection] = useState(false);
  const { usedFonts } = useUsedFont();

  const [
    {
      isBold,
      isItalic,
      isUnderline,
      isUppercase,
      isBulletList,
      isOrderedList,
      ...settings
    },
    setSettings,
  ] = useState(() => {
    const settings: {
      fontFamily: Record<LayerId, FontData[]>;
      fontSize: Record<LayerId, number[]>;
      color: Record<LayerId, string[]>;
      isBold: boolean;
      isItalic: boolean;
      isUnderline: boolean;
      isUppercase: boolean;
      isBulletList: boolean;
      isOrderedList: boolean;
      lineHeight: Record<LayerId, number[]>;
      letterSpacing: Record<LayerId, number[]>;
    } = {
      fontFamily: {},
      fontSize: {},
      color: {},
      isBold: true,
      isItalic: true,
      isUnderline: true,
      isUppercase: true,
      isBulletList: true,
      isOrderedList: true,
      lineHeight: {},
      letterSpacing: {},
    };
    layers.forEach((layer) => {
      settings.fontFamily[layer.id] = layer.data.props.fonts || [];
      settings.fontSize[layer.id] = layer.data.props.fontSizes || [];
      settings.color[layer.id] = layer.data.props.colors || [];
      const editor = layer.data.editor;
      if (editor) {
        if (!isActive(editor.state, "bold")) {
          settings.isBold = false;
        }
        if (!isActive(editor.state, "italic")) {
          settings.isItalic = false;
        }
        if (!isActive(editor.state, "underline")) {
          settings.isUnderline = false;
        }
        if (!isActive(editor.state, null, { indent: 1, listType: "" })) {
          settings.isBulletList = false;
        }
        if (!isActive(editor.state, null, { indent: 1, listType: "ordered" })) {
          settings.isOrderedList = false;
        }
        if (!isActive(editor.state, null, { textTransform: "uppercase" })) {
          settings.isUppercase = false;
        }
        if (!isActive(editor.state, null, { textTransform: "uppercase" })) {
          settings.isUppercase = false;
        }
      }
    });
    return settings;
  });

  const borderRef = useRef<HTMLDivElement>(null);
  const { selectedLayers, selectedLayerIds } = useSelectedLayers();
  const {
    actions,
    activePage,
    textEditor,
    editingLayer,
    fontList,
    sidebar,
    state,
  } = useEditor((state) => ({
    sidebar: state.sidebar,
    activePage: state.activePage,
    textEditor: state.textEditor,
    fontList: state.fontList,
    editingLayer: state.textEditor
      ? (state.pages[state.textEditor.pageIndex].layers[
          state.textEditor.layerId
        ] as unknown as Layer<TextLayerProps>)
      : null,
    state: state,
  }));
  const { fontFamily, fontSize, color, lineHeight, letterSpacing } =
    useMemo(() => {
      return layers.reduce(
        (acc, layer) => {
          if (settings.fontFamily[layer.id]) {
            const props = layer.data.props;
            acc.fontFamily.push(...settings.fontFamily[layer.id]);
            acc.fontFamily = uniqBy(acc.fontFamily, "name");
            if (settings.fontSize[layer.id]) {
              acc.fontSize = uniq(
                acc.fontSize.concat(
                  settings.fontSize[layer.id].map(
                    (s) => Math.round(s * props.scale * 10) / 10
                  )
                )
              );
            }
            acc.color = uniq(acc.color.concat(settings.color[layer.id]));
            acc.lineHeight = uniq(
              acc.lineHeight.concat(settings.lineHeight[layer.id])
            );
            acc.letterSpacing = uniq(
              acc.letterSpacing.concat(settings.letterSpacing[layer.id])
            );
          }
          return acc;
        },
        {
          fontSize: [],
          fontFamily: [],
          color: [],
          lineHeight: [],
          letterSpacing: [],
        } as {
          fontSize: number[];
          fontFamily: FontData[];
          color: string[];
          lineHeight: number[];
          letterSpacing: number[];
        }
      );
    }, [settings, selectedLayers]);
  useEffect(() => {
    const settings: {
      fontFamily: Record<LayerId, FontData[]>;
      fontSize: Record<LayerId, number[]>;
      color: Record<LayerId, string[]>;
      isBold: boolean;
      isItalic: boolean;
      isUnderline: boolean;
      isUppercase: boolean;
      isBulletList: boolean;
      isOrderedList: boolean;
      lineHeight: Record<LayerId, number[]>;
      letterSpacing: Record<LayerId, number[]>;
    } = {
      fontFamily: {},
      fontSize: {},
      color: {},
      isBold: true,
      isItalic: true,
      isUnderline: true,
      isUppercase: true,
      isBulletList: true,
      isOrderedList: true,
      lineHeight: {},
      letterSpacing: {},
    };
    setOpenSpacingSetting(false);
    setOpenFontSizeSelection(false);
    selectedLayers.forEach((layer) => {
      const editor = layer.data.editor;
      if (editor) {
        const attrs = getAllAttrs(editor.state.doc);
        settings.fontFamily[layer.id] = uniqBy(
          getFontFamily(attrs).map((font) => ({
            name: font,
            fonts: usedFontObj[font] || fontObj[font],
          })),
          "name"
        );
        settings.fontSize[layer.id] = getFontSize(attrs);
        settings.lineHeight[layer.id] = getLineHeight(attrs);
        settings.letterSpacing[layer.id] = getLetterSpacing(attrs);
        settings.color[layer.id] = getColor(
          attrs,
          getAllMarks(editor.state.doc)
        );
        if (!isActive(editor.state, "bold")) {
          settings.isBold = false;
        }
        if (!isActive(editor.state, "italic")) {
          settings.isItalic = false;
        }
        if (!isActive(editor.state, "underline")) {
          settings.isUnderline = false;
        }
        if (!isActive(editor.state, "bulletList")) {
          settings.isBulletList = false;
        }
        if (!isActive(editor.state, "orderedList")) {
          settings.isOrderedList = false;
        }
        if (!isActive(editor.state, null, { textTransform: "uppercase" })) {
          settings.isUppercase = false;
        }
        setSettings(settings);
      }
    });
  }, [JSON.stringify(selectedLayerIds)]);

  const [openBorderSetting, setOpenBorderSetting] = useState(false);

  const roundedCorners = layers.reduce((value, layer) => {
    if (value < layer.data.props.roundedCorners) {
      value = layer.data.props.roundedCorners;
    }
    return value;
  }, 0);
  const updateRoundedCorners = (value: number) => {
    const layerIds = layers.map((l) => l.id);
    actions.history
      .throttle(2000)
      .setProp<ShapeLayerProps>(activePage, layerIds, {
        roundedCorners: value,
      });
  };
  const colors = useMemo(() => {
    return layers
      .filter((l) => l.data.props.color && !l.data.props.gradientBackground)
      .map((layer) => layer.data.props.color) as string[];
  }, [layers]);
  const gradient = useMemo(() => {
    return layers
      .map((layer) => layer.data.props.gradientBackground)
      .filter((c) => !!c);
  }, [layers]);
  const border = useMemo(() => {
    const border = layers
      .map((layer) => layer.data.props.border)
      .filter((b) => !!b);
    if (border[0]) {
      return border[0];
    }
    return {
      style: "none" as ShapeBorderStyle,
      weight: 0,
      color: "rgb(0, 0, 0)",
    };
  }, [layers]);
  const updateColor = (color: string) => {
    layers.forEach((layer) => {
      actions.history
        .throttle(2000)
        .setProp<ShapeLayerProps>(activePage, layer.id, {
          color,
          gradientBackground: null,
          fill: "color",
        });
    });
  };

  const handleChangeGradient = (data: {
    colors: string[];
    style: GradientStyle;
  }) => {
    layers.forEach((layer) => {
      actions.history
        .throttle(2000)
        .setProp<ShapeLayerProps>(activePage, layer.id, {
          gradientBackground: data,
          fill: "color",
        });
    });
  };

  const updateBorderStyle = (style: ShapeBorderStyle) => {
    layers.forEach((layer) => {
      actions.history
        .throttle(2000)
        .setProp<ShapeLayerProps>(activePage, layer.id, {
          border: {
            style: style,
            weight: style === "none" ? 0 : layer.data.props.border?.weight || 4,
            color: layer.data.props.border?.color || "rgb(0, 0, 0)",
          },
        });
    });
  };
  const updateBorderWeight = (weight: number) => {
    const layerIds = layers.map((layer) => layer.id);
    actions.history
      .throttle(2000)
      .setProp<ShapeLayerProps>(activePage, layerIds, {
        border: {
          style: (weight === 0 ? "none" : border.style) || "solid",
          weight,
          color: border.color,
        },
      });
  };
  const updateBorderColor = (color: string) => {
    const layerIds = layers
      .filter((layer) => layer.data.props.border?.style !== "none")
      .map((layer) => layer.id);
    actions.history
      .throttle(2000)
      .setProp<ShapeLayerProps>(activePage, layerIds, {
        border: {
          color,
        },
      });
  };

  useEffect(() => {
    if (fontSizeInputRef.current) {
      if (fontSize.length === 1) {
        fontSizeInputRef.current.value = fontSize[0] + "";
      } else {
        fontSizeInputRef.current.value = "--";
      }
    }
  }, [fontSize]);
  const fontObj = useMemo(() => {
    return fontList.reduce(
      (acc, font) => {
        acc[font.name] = font.fonts;
        return acc;
      },
      {} as Record<string, Font[]>
    );
  }, [fontList]);
  const usedFontObj = useMemo(() => {
    return usedFonts.reduce(
      (acc, font) => {
        acc[font.name] = font.fonts;
        return acc;
      },
      {} as Record<string, Font[]>
    );
  }, [usedFonts]);
  const updateLayerProps = useCallback(
    (type: "content" | "selection") => {
      // function is called twice because it updates editor
      const settings: {
        fontFamily: Record<LayerId, FontData[]>;
        fontSize: Record<LayerId, number[]>;
        color: Record<LayerId, string[]>;
        isBold: boolean;
        isItalic: boolean;
        isUnderline: boolean;
        isUppercase: boolean;
        isBulletList: boolean;
        isOrderedList: boolean;
        lineHeight: Record<LayerId, number[]>;
        letterSpacing: Record<LayerId, number[]>;
      } = {
        fontFamily: {},
        fontSize: {},
        color: {},
        isBold: true,
        isItalic: true,
        isUnderline: true,
        isUppercase: true,
        isBulletList: true,
        isOrderedList: true,
        lineHeight: {},
        letterSpacing: {},
      };
      if (editingLayer) {
        settings.fontFamily[editingLayer.id] = [];
        settings.fontSize[editingLayer.id] = [];
        settings.color[editingLayer.id] = [];
        settings.lineHeight[editingLayer.id] = [];
        settings.letterSpacing[editingLayer.id] = [];
        const editor = textEditor?.editor;
        if (editor) {
          const newState = EditorState.create({
            doc: editor.state.doc,
            schema: editor.state.schema,
          });

          editingLayer.data.editor?.updateState(newState);
          const props = editingLayer.data.props;
          if (isEmptyContent(editor.state)) {
            setColorForBlock(props.colors[0])(editor.state, editor.dispatch);
            setFontSize(props.fontSizes[0])(editor.state, editor.dispatch);
            setFontFamily(props.fonts[0].name)(editor.state, editor.dispatch);
            editor.focus();
          }
          const matrix = new WebKitCSSMatrix(
            getTransformStyle({
              position: editingLayer.data.props.position,
              rotate: editingLayer.data.props.rotate,
            })
          );
          const oldCorners = visualCorners(
            editingLayer.data.props.boxSize,
            matrix,
            editingLayer.data.props.position
          );
          const newCorners = visualCorners(
            {
              width: editingLayer.data.props.boxSize.width,
              height: editor.dom.clientHeight * editingLayer.data.props.scale,
            },
            matrix,
            editingLayer.data.props.position
          );
          const { changeX, changeY } = getPositionChangesBetweenTwoCorners(
            oldCorners,
            newCorners,
            "bottomRight"
          );
          if (editor.state.selection.empty) {
            const markList =
              editor.state.storedMarks || editor.state.selection.$from.marks();
            const markAttrs = markList.reduce(
              (acc, mark) => {
                Object.entries(mark.attrs).forEach(([key, value]) => {
                  if (!acc[key]) {
                    acc[key] = [];
                  }
                  acc[key].push(value);
                });
                return acc;
              },
              {} as Record<string, string[]>
            );
            settings.color[editingLayer.id] = uniq(getColor({}, markAttrs));
          }
          let blockColor: string[] | null = null;
          editor.state.doc.nodesBetween(
            editor.state.selection.ranges[0].$from.pos,
            editor.state.selection.ranges[0].$to.pos,
            (node) => {
              const attrs = getAttrs(node);
              if (node.isBlock) {
                const fontFamily = getFontFamily(attrs).map((font) => ({
                  name: font,
                  fonts: usedFontObj[font] || fontObj[font],
                }));
                settings.fontFamily[editingLayer.id].push(...fontFamily);
                settings.fontFamily[editingLayer.id] = uniqBy(
                  settings.fontFamily[editingLayer.id],
                  "name"
                );
                settings.fontSize[editingLayer.id] = uniq(
                  settings.fontSize[editingLayer.id].concat(getFontSize(attrs))
                );
                settings.lineHeight[editingLayer.id] = uniq(
                  settings.lineHeight[editingLayer.id].concat(
                    getLineHeight(attrs)
                  )
                );
                settings.letterSpacing[editingLayer.id] = uniq(
                  settings.letterSpacing[editingLayer.id].concat(
                    getLetterSpacing(attrs)
                  )
                );
                blockColor = getColor(attrs, getMarkAttrs(node));
              }
              if (node.isText && !editor.state.selection.empty) {
                let colors = getColor(attrs, getMarkAttrs(node));
                if (colors.length === 0 && blockColor) {
                  colors = blockColor;
                }
                settings.color[editingLayer.id] = uniq(
                  settings.color[editingLayer.id].concat(colors)
                );
                blockColor = null;
              }
            }
          );
          //
          if (!isActive(editor.state, "bold")) {
            settings.isBold = false;
          }
          if (!isActive(editor.state, "italic")) {
            settings.isItalic = false;
          }
          if (!isActive(editor.state, "underline")) {
            settings.isUnderline = false;
          }
          if (!isActive(editor.state, null, { indent: 1, listType: "" })) {
            settings.isBulletList = false;
          }
          if (
            !isActive(editor.state, null, { indent: 1, listType: "ordered" })
          ) {
            settings.isOrderedList = false;
          }
          if (!isActive(editor.state, null, { textTransform: "uppercase" })) {
            settings.isUppercase = false;
          }
          setSettings(settings);
          if (type === "content") {
            const {
              width: editorWidth,
              height: editorHeight,
              posX,
              posY,
            } = state.textEditorSize
              ? state.textEditorSize
              : {
                  width: props.boxSize.width,
                  height: props.boxSize.height,
                  posX: 0,
                  posY: 0,
                };
            const currentDomHeight = editor.dom.clientHeight * props.scale;
            const attrs = getAllAttrs(editor.state.doc);
            actions.history
              .merge()
              .setProp<ShapeLayerProps>(activePage, editingLayer.id, {
                text: editor.dom.innerHTML,
                fontSizes: getFontSize(attrs),
                fonts: uniqBy(
                  getFontFamily(attrs).map((font) => ({
                    name: font,
                    fonts: usedFontObj[font] || fontObj[font],
                  })),
                  "name"
                ),
                colors: getColor(attrs, getAllMarks(editor.state.doc)),
                boxSize: {
                  width: props.boxSize.width,
                  height:
                    currentDomHeight > editorHeight
                      ? currentDomHeight + props.boxSize.height - editorHeight
                      : props.boxSize.height,
                },
                position: {
                  x: props.position.x - changeX,
                  y: props.position.y - changeY,
                },
                textWidth: editorWidth,
                textHeight: editorHeight,
                textPosX: posX,
                textPosY: posY,
              });
            actions.setControlBox({
              boxSize: {
                width: props.boxSize.width,
                height:
                  currentDomHeight > editorHeight
                    ? currentDomHeight + props.boxSize.height - editorHeight
                    : props.boxSize.height,
              },
              position: {
                x: props.position.x - 0,
                y: props.position.y - 0,
              },
              scale: props.scale,
              rotate: props.rotate,
            });
            if (currentDomHeight > editorHeight) {
              actions.setTextEditorSize(
                editorWidth,
                currentDomHeight,
                posX,
                posY
              );
            }
          }
        }
      } else {
        console.log("selectionUpdate");
        const layerRecords = selectedLayers.reduce(
          (acc, layer) => {
            const editor = layer.data.editor;
            if (editor) {
              const props = layer.data.props as TextLayerProps;
              const attrs = getAllAttrs(editor.state.doc);
              settings.fontFamily[layer.id] = uniqBy(
                getFontFamily(attrs).map((font) => ({
                  name: font,
                  fonts: usedFontObj[font] || fontObj[font],
                })),
                "name"
              );
              settings.fontSize[layer.id] = getFontSize(attrs);
              settings.lineHeight[layer.id] = getLineHeight(attrs);
              settings.letterSpacing[layer.id] = getLetterSpacing(attrs);
              settings.color[layer.id] = getColor(
                attrs,
                getAllMarks(editor.state.doc)
              );
              if (!isActive(editor.state, "bold")) {
                settings.isBold = false;
              }
              if (!isActive(editor.state, "italic")) {
                settings.isItalic = false;
              }
              if (!isActive(editor.state, "underline")) {
                settings.isUnderline = false;
              }
              if (!isActive(editor.state, "bulletList")) {
                settings.isBulletList = false;
              }
              if (!isActive(editor.state, "orderedList")) {
                settings.isOrderedList = false;
              }
              if (
                !isActive(editor.state, null, { textTransform: "uppercase" })
              ) {
                settings.isUppercase = false;
              }
              if (type === "content") {
                const scale = isEqual(
                  props.fontSizes,
                  settings.fontSize[layer.id]
                )
                  ? props.scale
                  : 1;
                const div = document.createElement("div");
                div.append(editor.dom);
                const { clientHeight } = getVirtualDomHeight(
                  div,
                  layer.data.props.boxSize.width,
                  scale
                );

                const matrix = new WebKitCSSMatrix(
                  getTransformStyle({
                    position: layer.data.props.position,
                    rotate: layer.data.props.rotate,
                  })
                );
                const oldCorners = visualCorners(
                  layer.data.props.boxSize,
                  matrix,
                  layer.data.props.position
                );
                const newCorners = visualCorners(
                  {
                    width: layer.data.props.boxSize.width,
                    height:
                      clientHeight > layer.data.props.boxSize.height
                        ? clientHeight
                        : layer.data.props.boxSize.height,
                  },
                  matrix,
                  layer.data.props.position
                );
                const { changeX, changeY } =
                  getPositionChangesBetweenTwoCorners(
                    oldCorners,
                    newCorners,
                    "bottomRight"
                  );
                actions.history
                  .merge()
                  .setProp<TextLayerProps>(activePage, layer.id, {
                    text: editor.dom.innerHTML,
                    fontSizes: settings.fontSize[layer.id],
                    fonts: settings.fontFamily[layer.id],
                    colors: settings.color[layer.id],
                    scale,
                    boxSize: {
                      width: layer.data.props.boxSize.width,
                      height:
                        clientHeight > layer.data.props.boxSize.height
                          ? clientHeight
                          : layer.data.props.boxSize.height,
                    },
                    position: {
                      x: layer.data.props.position.x - changeX,
                      y: layer.data.props.position.y - changeY,
                    },
                  });
                acc[layer.id] = {
                  ...layer.data.props,
                  boxSize: {
                    width: layer.data.props.boxSize.width,
                    height:
                      clientHeight > layer.data.props.boxSize.height
                        ? clientHeight
                        : layer.data.props.boxSize.height,
                  },
                  position: {
                    x: layer.data.props.position.x - changeX,
                    y: layer.data.props.position.y - changeY,
                  },
                };
              }
            } else {
              acc[layer.id] = layer.data.props;
            }
            return acc;
          },
          {} as Record<LayerId, LayerComponentProps>
        );
        setSettings(settings);
        actions.setControlBox(getControlBoxSizeFromLayers(layerRecords));
      }
    },
    [
      JSON.stringify(
        selectedLayers.map((l) => ({
          id: l.id,
          boxSize: l.data.props.boxSize,
          position: l.data.props.position,
          rotate: l.data.props.rotate,
          scale: l.data.props.scale,
        }))
      ),
      editingLayer,
      textEditor?.editor,
      actions,
      fontObj,
    ]
  );
  const selectionUpdate = useCallback(() => {
    updateLayerProps("selection");
  }, [updateLayerProps]);
  const contentUpdate = useCallback(() => {
    updateLayerProps("content");
  }, [updateLayerProps]);

  useEffect(() => {
    textEditor?.editor?.events.on("selectionUpdate", selectionUpdate);
    textEditor?.editor?.events.on("update", contentUpdate);
    return () => {
      textEditor?.editor?.events.off("selectionUpdate", selectionUpdate);
      textEditor?.editor?.events.off("update", contentUpdate);
    };
  }, [textEditor?.editor, updateLayerProps]);
  useEffect(() => {
    layers.forEach((layer) => {
      layer.data.editor?.events.on("update", contentUpdate);
    });
    return () => {
      layers.forEach((layer) => {
        layer.data.editor?.events.off("update", contentUpdate);
      });
    };
  }, [JSON.stringify(layers.map((l) => l.id)), updateLayerProps]);

  const fontStyles = useCallback((fontList: FontData[]) => {
    const fontStyles = ["italic", "bold"];
    fontList.forEach((font) => {
      fontStyles.forEach((s, index) => {
        if (!font.fonts?.find((i) => i.style?.toLowerCase().includes(s))) {
          fontStyles.splice(index, 1);
        }
      });
    });
    return fontStyles;
  }, []);

  const applyFont = (font: FontData) => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        setFontFamily(font.name)(editor.state, editor.dispatch);
        const styles = fontStyles([font]);
        if (!styles.includes("bold")) {
          unsetBoldOfBlock(editor.state, editor.dispatch);
        }
        if (!styles.includes("italic")) {
          unsetItalicOfBlock(editor.state, editor.dispatch);
        }
        editor.focus();

        if (editingLayer.data.editor) {
          const hiddenEditor = editingLayer.data.editor;
          const { $from, $to } = editor.state.selection;
          selectText({ from: $from.pos, to: $to.pos })(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
          setFontFamily(font.name)(hiddenEditor.state, hiddenEditor.dispatch);
          const styles = fontStyles([font]);
          if (!styles.includes("bold")) {
            unsetBoldOfBlock(hiddenEditor.state, hiddenEditor.dispatch);
          }
          if (!styles.includes("italic")) {
            unsetItalicOfBlock(hiddenEditor.state, hiddenEditor.dispatch);
          }
        }
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setFontFamily(font.name)(editor.state, editor.dispatch);
          const styles = fontStyles([font]);
          if (!styles.includes("bold")) {
            unsetBoldOfBlock(editor.state, editor.dispatch);
          }
          if (!styles.includes("italic")) {
            unsetItalicOfBlock(editor.state, editor.dispatch);
          }
        }
      });
    }
  };
  const changeFontSize = (number: number) => {
    layers.forEach((layer) => {
      const editor = layer.data.editor;
      if (editor) {
        const doc = editor.state.doc;
        editor.state.doc.nodesBetween(0, doc.content.size, (node, pos) => {
          if (node.isBlock) {
            const attrs = getAllAttrs(node);
            const fontSize = getFontSize(attrs);
            if (fontSize.length > 0) {
              const scale = layer.data.props.scale || 1;
              selectNode(pos)(editor.state, editor.dispatch);
              setFontSize(
                Math.round((fontSize[0] * scale + number) * 1000) / 1000
              )(editor.state, editor.dispatch);
            }
          }
        });
      }
    });
  };

  const handleChangeFontSize = (size: number) => {
    actions.history.new();
    const fontSize = Math.max(Math.min(800, size), 8);
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const func = setFontSize(
          Math.round((fontSize / editingLayer.data.props.scale) * 1000) / 1000
        );
        func(editor.state, editor.dispatch);
        editor.focus();
        if (editingLayer.data.editor) {
          const hiddenEditor = editingLayer.data.editor;
          const { $from, $to } = editor.state.selection;
          selectText({ from: $from.pos, to: $to.pos })(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
          func(hiddenEditor.state, hiddenEditor.dispatch);
        }
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setFontSize(fontSize)(editor.state, editor.dispatch);
        }
      });
    }
    setOpenFontSizeSelection(false);
  };
  const increaseFontSize = () => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const range = {
          from: editor.state.selection.ranges[0].$from.pos,
          to: editor.state.selection.ranges[0].$to.pos,
        };
        editor.state.doc.nodesBetween(range.from, range.to, (node, pos) => {
          if (node.isBlock) {
            const attrs = getAllAttrs(node);
            const [fontSize] = getFontSize(attrs);
            const scale = editingLayer.data.props.scale;
            selectNode(pos)(editor.state, editor.dispatch);
            setFontSize(Math.round((fontSize + 1 / scale) * 1000) / 1000)(
              editor.state,
              editor.dispatch
            );
            const hiddenEditor = editingLayer.data.editor;
            if (hiddenEditor) {
              selectNode(pos)(hiddenEditor.state, hiddenEditor.dispatch);
              setFontSize(Math.round((fontSize + 1 / scale) * 1000) / 1000)(
                hiddenEditor.state,
                hiddenEditor.dispatch
              );
            }
          }
        });
        selectText(range)(editor.state, editor.dispatch);
        editor.focus();
      }
    } else {
      changeFontSize(+1);
    }
  };
  const decreaseFontSize = () => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const range = {
          from: editor.state.selection.ranges[0].$from.pos,
          to: editor.state.selection.ranges[0].$to.pos,
        };
        editor.state.doc.nodesBetween(range.from, range.to, (node, pos) => {
          if (node.isBlock) {
            const attrs = getAllAttrs(node);
            const [fontSize] = getFontSize(attrs);
            const scale = editingLayer.data.props.scale;
            selectNode(pos)(editor.state, editor.dispatch);
            setFontSize(Math.round((fontSize - 1 / scale) * 1000) / 1000)(
              editor.state,
              editor.dispatch
            );
            const hiddenEditor = editingLayer.data.editor;
            if (hiddenEditor) {
              selectNode(pos)(hiddenEditor.state, hiddenEditor.dispatch);
              setFontSize(Math.round((fontSize - 1 / scale) * 1000) / 1000)(
                hiddenEditor.state,
                hiddenEditor.dispatch
              );
            }
          }
        });
        selectText(range)(editor.state, editor.dispatch);
        editor.focus();
      }
    } else {
      changeFontSize(-1);
    }
  };

  const backgroundIconDivider = useMemo(() => {
    if (!color) return {};
    if (color.length === 1 && new Color(color[0]).white() === 100) {
      return {
        backgroundImage:
          "linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)",
      };
    }
    const size = 100 / color.length;
    return {
      backgroundImage: color
        .map((c) => `linear-gradient(to right, ${c}, ${c})`)
        .join(", "),
      backgroundSize: color
        .map((_, index) => `${size * (index + 1)}%`)
        .join(", "),
      boxShadow: "inset 0 0 0 1px rgba(57,76,96,.15)",
    };
  }, [color]);

  const handleUpdateColor = throttle((color: string | null) => {
    if (!color) return;
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const func = setColor(color);
        func(editor.state, editor.dispatch);
        editor.focus();
        if (editingLayer.data.editor) {
          const hiddenEditor = editingLayer.data.editor;
          const { $from, $to } = editor.state.selection;
          selectText({ from: $from.pos, to: $to.pos })(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
          func(hiddenEditor.state, hiddenEditor.dispatch);
        }
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          const attrs = getAllAttrs(editor.state.doc);
          selectAll(editor.state, editor.dispatch);
          setColor(color)(editor.state, editor.dispatch);
          setColorForBlock(color)(editor.state, editor.dispatch);
          actions.history
            .throttle(2000)
            .setProp<TextLayerProps>(activePage, layer.id, {
              colors: getColor(attrs, getAllMarks(editor.state.doc)),
            });
        }
      });
    }
  }, 16);

  const toggleStyle = (type: "BOLD" | "ITALIC" | "UNDERLINE" | "UPPERCASE") => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        if (type === "BOLD") {
          const fonts = editingLayer.data.props.fonts.reduce(
            (acc, f) => {
              acc[f.name] = f.fonts;
              return acc;
            },
            {} as Record<string, Font[]>
          );

          let supported = true;
          editor.state.doc.nodesBetween(
            editor.state.selection.ranges[0].$from.pos,
            editor.state.selection.ranges[0].$to.pos,
            (node) => {
              const attrs = getAllAttrs(node);
              const fontFamily = getFontFamily(attrs);
              const check = fontFamily.every(
                (f) => fonts[f] && fonts[f].find((s) => s.style === "Bold")
              );
              if (!check) {
                supported = false;
              }
            }
          );
          if (supported) {
            toggleBold(editor.state, editor.dispatch);
            editor.focus();
            if (editingLayer.data.editor) {
              const hiddenEditor = editingLayer.data.editor;
              const { $from, $to } = editor.state.selection;
              selectText({ from: $from.pos, to: $to.pos })(
                hiddenEditor.state,
                hiddenEditor.dispatch
              );
              toggleBold(hiddenEditor.state, hiddenEditor.dispatch);
            }
          }
        } else if (type === "ITALIC") {
          toggleItalic(editor.state, editor.dispatch);
          editor.focus();
          if (editingLayer.data.editor) {
            const hiddenEditor = editingLayer.data.editor;
            const { $from, $to } = editor.state.selection;
            selectText({ from: $from.pos, to: $to.pos })(
              hiddenEditor.state,
              hiddenEditor.dispatch
            );
            toggleItalic(hiddenEditor.state, hiddenEditor.dispatch);
          }
        } else if (type === "UNDERLINE") {
          toggleUnderline(editor.state, editor.dispatch);
          editor.focus();
          if (editingLayer.data.editor) {
            const hiddenEditor = editingLayer.data.editor;
            const { $from, $to } = editor.state.selection;
            selectText({ from: $from.pos, to: $to.pos })(
              hiddenEditor.state,
              hiddenEditor.dispatch
            );
            toggleUnderline(hiddenEditor.state, hiddenEditor.dispatch);
          }
        } else if (type === "UPPERCASE") {
          const cmd = setTextTransform(
            isActive(editor.state, null, { textTransform: "uppercase" })
              ? undefined
              : "uppercase"
          );
          cmd(editor.state, editor.dispatch);
          editor.focus();
          if (editingLayer.data.editor) {
            const hiddenEditor = editingLayer.data.editor;
            const { $from, $to } = editor.state.selection;
            selectText({ from: $from.pos, to: $to.pos })(
              hiddenEditor.state,
              hiddenEditor.dispatch
            );
            cmd(hiddenEditor.state, hiddenEditor.dispatch);
          }
        }
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          if (type === "BOLD") {
            !isBold
              ? setBold(editor.state, editor.dispatch)
              : unsetBold(editor.state, editor.dispatch);
          } else if (type === "ITALIC") {
            !isItalic
              ? setItalic(editor.state, editor.dispatch)
              : unsetItalic(editor.state, editor.dispatch);
          } else if (type === "UNDERLINE") {
            !isUnderline
              ? setUnderline(editor.state, editor.dispatch)
              : unsetUnderline(editor.state, editor.dispatch);
          } else if (type === "UPPERCASE") {
            !isUppercase
              ? setTextTransform("uppercase")(editor.state, editor.dispatch)
              : setTextTransform()(editor.state, editor.dispatch);
          }
        }
      });
    }
  };

  const updateTextAlign = (
    textAlign: "left" | "right" | "center" | "justify"
  ) => {
    actions.history.new();
    const editor = textEditor?.editor;
    if (editingLayer && editor) {
      setTextAlign(textAlign)(editor.state, editor.dispatch);
      editor.focus();
      if (editingLayer.data.editor) {
        const hiddenEditor = editingLayer.data.editor;
        const { $from, $to } = editor.state.selection;
        selectText({ from: $from.pos, to: $to.pos })(
          hiddenEditor.state,
          hiddenEditor.dispatch
        );
        setTextAlign(textAlign)(hiddenEditor.state, hiddenEditor.dispatch);
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setTextAlign(textAlign)(editor.state, editor.dispatch);
        }
      });
    }
  };

  const handleChangeLetterSpacing = (spacing: number) => {
    actions.history.new();
    const editor = textEditor?.editor;
    if (editingLayer && editor) {
      setLetterSpacing(spacing)(editor.state, editor.dispatch);
      editor.focus();
      if (editingLayer.data.editor) {
        const hiddenEditor = editingLayer.data.editor;
        const { $from, $to } = editor.state.selection;
        selectText({ from: $from.pos, to: $to.pos })(
          hiddenEditor.state,
          hiddenEditor.dispatch
        );
        setLetterSpacing(spacing)(hiddenEditor.state, hiddenEditor.dispatch);
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setLetterSpacing(spacing)(editor.state, editor.dispatch);
        }
      });
    }
  };
  const handleChangeLineHeight = (lineHeight: number) => {
    actions.history.new();
    const editor = textEditor?.editor;
    if (editingLayer && editor) {
      setLineHeight(lineHeight)(editor.state, editor.dispatch);
      editor.focus();
      if (editingLayer.data.editor) {
        const hiddenEditor = editingLayer.data.editor;
        const { $from, $to } = editor.state.selection;
        selectText({ from: $from.pos, to: $to.pos })(
          hiddenEditor.state,
          hiddenEditor.dispatch
        );
        setLineHeight(lineHeight)(hiddenEditor.state, hiddenEditor.dispatch);
      }
    } else {
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setLineHeight(lineHeight)(editor.state, editor.dispatch);
        }
      });
    }
  };

  const toggleBulletList = () => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const isValid = isActive(editor.state, null, {
          indent: 1,
          listType: "",
        });
        setBulletList(!isValid ? 1 : 0)(editor.state, editor.dispatch);
        editor.focus();
        if (editingLayer.data.editor) {
          const hiddenEditor = editingLayer.data.editor;
          const { $from, $to } = editor.state.selection;
          selectText({ from: $from.pos, to: $to.pos })(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
          setBulletList(!isValid ? 1 : 0)(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
        }
      }
    } else {
      const isValid = layers.every((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          return isActive(editor.state, null, { indent: 1, listType: "" });
        }
      });
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          setBulletList(!isValid ? 1 : 0)(editor.state, editor.dispatch);
        }
      });
    }
  };

  const toggleOrderedList = () => {
    actions.history.new();
    if (editingLayer) {
      const editor = textEditor?.editor;
      if (editor) {
        const isValid = isActive(editor.state, null, {
          indent: 1,
          listType: "ordered",
        });
        setOrderedList(!isValid ? 1 : 0)(editor.state, editor.dispatch);
        editor.focus();
        if (editingLayer.data.editor) {
          const hiddenEditor = editingLayer.data.editor;
          const { $from, $to } = editor.state.selection;
          selectText({ from: $from.pos, to: $to.pos })(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
          setOrderedList(!isValid ? 1 : 0)(
            hiddenEditor.state,
            hiddenEditor.dispatch
          );
        }
      }
    } else {
      const isValid = layers.every((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          return isActive(editor.state, null, {
            indent: 1,
            listType: "ordered",
          });
        }
      });
      layers.forEach((layer) => {
        const editor = layer.data.editor;
        if (editor) {
          selectAll(editor.state, editor.dispatch);
          setOrderedList(!isValid ? 1 : 0)(editor.state, editor.dispatch);
        }
      });
    }
  };

  const handleFontSizeInputUpdate = (e: React.KeyboardEvent) => {
    const input = fontSizeInputRef.current as HTMLInputElement;
    const inputValue = input.value;
    if (e.key.toLowerCase() === "enter") {
      fontSizeInputRef.current &&
        handleChangeFontSize(+parseFloat(inputValue).toFixed(1));
      e.preventDefault();
      input.blur();
    } else if (!e.key.match(/^[0-9]|./)) {
      e.preventDefault();
    }
  };

  const handleFontSizeInputBlur = () => {
    const input = fontSizeInputRef.current as HTMLInputElement;
    const inputValue = input.value;
    if (inputValue !== "--" && inputValue !== fontSize[0] + "") {
      fontSizeInputRef.current &&
        handleChangeFontSize(+parseFloat(inputValue).toFixed(1));
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gridAutoFlow: "column",
        gridGap: 8,
      }}
    >
      <ColorSettings
        keyColor="CHOOSING_SHAPE_COLOR"
        colors={colors}
        gradient={gradient.length > 0 ? gradient[0] : null}
        useGradient={true}
        onChange={updateColor}
        onChangeGradient={handleChangeGradient}
      />
      {border && border.style !== "none" && (
        <ColorSettings
          keyColor="CHOOSING_SHAPE_BORDER_COLOR"
          colors={[border.color]}
          onChange={updateBorderColor}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 2,
              position: "relative",
              fontSize: 24,
              overflow: "hidden",
              color: border.color,
            }}
          >
            <SquareBoldIcon />
          </div>
        </ColorSettings>
      )}

      <SettingButton
        ref={borderRef}
        style={{ fontSize: 20 }}
        onClick={() => setOpenBorderSetting(true)}
      >
        <BorderWeightIcon />
      </SettingButton>
      <div>
        <div
          style={{
            border: "1px solid rgba(43,59,74,.3)",
            height: 32,
            padding: "0 2px",
            borderRadius: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            background:
              sidebar === "FONT_FAMILY" ? "rgba(57,76,96,.15)" : "#fff",
          }}
          onClick={() => {
            actions.setSidebar("FONT_FAMILY");
          }}
        >
          <div
            style={{
              padding: 4,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: 14,
            }}
          >
            {fontFamily.length === 1 ? fontFamily[0].name : "Multiple Fonts"}
          </div>
          <div
            style={{
              width: 24,
              height: 24,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 16,
            }}
          >
            <CaretDownIcon />
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            border: "1px solid rgba(43,59,74,.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 12,
            }}
            onClick={decreaseFontSize}
          >
            <MinusIcon />
          </div>
          <div
            ref={fontSizeRef}
            style={{
              width: 40,
              height: 32,
              borderLeft: "1px solid rgba(43,59,74,.3)",
              borderRight: "1px solid rgba(43,59,74,.3)",
            }}
            onClick={() => setOpenFontSizeSelection(true)}
          >
            <input
              ref={fontSizeInputRef}
              style={{
                width: 36,
                height: "100%",
                outline: 0,
                border: 0,
                textAlign: "center",
              }}
              onBlur={handleFontSizeInputBlur}
              onClick={() => fontSizeInputRef.current?.select()}
              onKeyDown={handleFontSizeInputUpdate}
            />
          </div>
          <Popover
            anchorEl={fontSizeInputRef.current}
            open={openFontSizeSelection}
            placement={"bottom"}
            onClose={() => setOpenFontSizeSelection(false)}
          >
            <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
              {fontSizeList.map((i) => {
                return (
                  <div
                    key={i}
                    className="hover:bg-[rgba(64,87,109,.07)]"
                    style={{
                      height: 40,
                      minWidth: 120,
                      padding: "0 8px",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleChangeFontSize(i)}
                  >
                    <div style={{ flexGrow: 1 }}>{i}</div>
                    {fontSize.includes(i) && (
                      <div style={{ fontSize: 24, flexShrink: 0 }}>
                        <CheckIcon />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Popover>
          <div
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 12,
            }}
            onClick={increaseFontSize}
          >
            <PlusIcon />
          </div>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          fontSize: 24,
        }}
        onClick={() => actions.setSidebar("CHOOSING_COLOR_TEXT_SHAPE")}
      >
        <TextAUnderlineIcon />
        <div
          style={{
            bottom: 1,
            left: "5%",
            width: "90%",
            position: "absolute",
          }}
        >
          <div
            style={{
              paddingTop: "22.2222%",
              height: 0,
              position: "relative",
              width: "100%",
            }}
          >
            <span
              style={{
                borderRadius: 4,
                overflow: "hidden",
                position: "absolute",
                inset: 0,
                backgroundRepeat: "no-repeat",
                ...backgroundIconDivider,
              }}
            />
          </div>
        </div>
      </div>
      <SettingButton
        style={{ fontSize: 24 }}
        disabled={!fontStyles(fontFamily).includes("bold")}
        isActive={isBold}
        onClick={() => toggleStyle("BOLD")}
      >
        <TextBBoldIcon />
      </SettingButton>
      <SettingButton
        style={{ fontSize: 24 }}
        disabled={!fontStyles(fontFamily).includes("italic")}
        isActive={isItalic}
        onClick={() => toggleStyle("ITALIC")}
      >
        <TextItalicIcon />
      </SettingButton>
      <SettingButton
        style={{ fontSize: 24 }}
        isActive={isUnderline}
        onClick={() => toggleStyle("UNDERLINE")}
      >
        <TextUnderlineIcon />
      </SettingButton>
      <SettingButton
        style={{ fontSize: 24 }}
        isActive={isUppercase}
        onClick={() => toggleStyle("UPPERCASE")}
      >
        <TextAaIcon />
      </SettingButton>
      <div
        style={{ height: 24, width: `1px`, background: "rgba(57,76,96,.15)" }}
      />

      <SettingButton
        style={{ fontSize: 24 }}
        onClick={() => updateTextAlign("left")}
      >
        <TextAlignLeftIcon />
      </SettingButton>
      <SettingButton
        style={{ fontSize: 24 }}
        onClick={() => updateTextAlign("center")}
      >
        <TextAlignCenterIcon />
      </SettingButton>
      <SettingButton
        style={{ fontSize: 24 }}
        onClick={() => updateTextAlign("right")}
      >
        <TextAlignRightIcon />
      </SettingButton>
      <SettingButton
        style={{ fontSize: 24 }}
        onClick={() => updateTextAlign("justify")}
      >
        <TextAlignJustifyIcon />
      </SettingButton>
      <div
        style={{ height: 24, width: `1px`, background: "rgba(57,76,96,.15)" }}
      />
      <SettingButton
        style={{ fontSize: 24 }}
        isActive={isBulletList}
        onClick={toggleBulletList}
      >
        <ListBulletsIcon />
      </SettingButton>
      <SettingButton
        style={{ fontSize: 24 }}
        isActive={isOrderedList}
        onClick={toggleOrderedList}
      >
        <ListNumbersIcon />
      </SettingButton>

      <SettingButton
        ref={spacingRef}
        style={{ fontSize: 24 }}
        onClick={() => setOpenSpacingSetting(true)}
      >
        <LineSpacingIcon />
      </SettingButton>
      <Popover
        anchorEl={spacingRef.current}
        offsets={{
          "bottom-end": { x: 0, y: 8 },
        }}
        open={openSpacingSetting}
        placement={"bottom-end"}
        onClose={() => setOpenSpacingSetting(false)}
      >
        <div style={{ padding: 16, minWidth: 220, display: "grid", rowGap: 8 }}>
          <Slider
            label={"Letter spacing"}
            max={800}
            min={-200}
            value={letterSpacing[0] * 1000 || 0}
            onChange={(v) => handleChangeLetterSpacing(v / 1000)}
          />
          <Slider
            label={"Line spacing"}
            max={2.5}
            min={0.5}
            step={0.01}
            value={lineHeight[0] || 1.4}
            onChange={handleChangeLineHeight}
          />
        </div>
      </Popover>
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
              {shapeStyles.map((style) => (
                <div
                  className={`${style.type !== border?.style ? "hover:shadow-[inset_0_0_0_1px_rgba(28,39,48,.5)]" : ""}`}
                  key={style.type}
                  style={{
                    fontSize: 24,
                    borderRadius: 4,
                    boxShadow:
                      style.type === border?.style
                        ? "inset 0 0 0 2px #3d8eff"
                        : "inset 0 0 0 1px rgba(43,59,74,.3)",
                    padding: 8,
                    cursor: "pointer",
                  }}
                  onClick={() => updateBorderStyle(style.type)}
                >
                  {style.icon}
                </div>
              ))}
            </div>
          </div>

          <Slider
            label={"Border Weight"}
            value={border?.weight || 0}
            onChange={updateBorderWeight}
          />

          <Slider
            label={"Corner Rounding"}
            value={roundedCorners}
            onChange={updateRoundedCorners}
          />
        </div>
      </Popover>
      <div
        style={{ height: 24, width: `1px`, background: "rgba(57,76,96,.15)" }}
      />

      <SettingButton onClick={() => actions.setSidebar("TEXT_EFFECT")}>
        <span style={{ padding: "0 4px" }}>Effects</span>
      </SettingButton>
      <div
        style={{ height: 24, width: `1px`, background: "rgba(57,76,96,.15)" }}
      />
      {sidebar === "FONT_FAMILY" && (
        <FontSidebar
          open={true}
          selected={fontFamily}
          onChangeFontFamily={applyFont}
        />
      )}

      {sidebar === "CHOOSING_COLOR_TEXT_SHAPE" && (
        <ColorSidebarTextShape
          open={true}
          selected={color[0]}
          onSelect={handleUpdateColor}
        />
      )}

      {sidebar === "TEXT_EFFECT" && <TextEffectSidebar open={true} />}
      {sidebar === "FONT_FAMILY" && (
        <FontSidebar
          open={true}
          selected={fontFamily}
          onChangeFontFamily={applyFont}
        />
      )}
    </div>
  );
};

export default ShapeSettings;
