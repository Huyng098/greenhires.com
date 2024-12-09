import { FontData, SerializedPage } from "@lidojs/design-core";
// @ts-ignore
import { isEqual, uniqWith } from "lodash";
import { TextContentProps } from "../TextContent";

export const getUsedFonts = (data: SerializedPage[]) => {
  const fontList: FontData[] = [];
  data?.forEach((page) => {
    Object.entries(page.layers).forEach(([, layer]) => {
      if (layer.type.resolvedName === "TextLayer") {
        fontList.push(...(layer.props as unknown as TextContentProps).fonts);
      } else if (layer.type.resolvedName === "ShapeLayer") {
        if (layer.props.fonts) {
          fontList.push(...(layer.props as unknown as TextContentProps).fonts);
        }
      }
    });
  });
  return uniqWith(fontList, isEqual);
};
