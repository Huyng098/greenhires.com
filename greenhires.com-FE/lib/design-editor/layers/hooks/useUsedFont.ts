import { FontData } from "@lidojs/design-core";
import { uniqBy } from "lodash";
import { useEditor } from "../../hooks";
import { isShapeLayer, isTextLayer } from "../../ultils/layer/layers";

export const useUsedFont = () => {
  const { fontFamilyList } = useEditor((state) => {
    const fontFamilyList: FontData[] = [];
    state.pages.forEach((page) => {
      Object.entries(page.layers).forEach(([, layer]) => {
        if (isTextLayer(layer)) {
          fontFamilyList.push(...layer.data.props.fonts);
        } else if (isShapeLayer(layer)) {
          if (layer.data.props.fonts) {
            fontFamilyList.push(...layer.data.props.fonts);
          }
        }
      });
    });
    return {
      fontFamilyList: uniqBy(fontFamilyList, "name"),
    };
  });

  return { usedFonts: fontFamilyList };
};
