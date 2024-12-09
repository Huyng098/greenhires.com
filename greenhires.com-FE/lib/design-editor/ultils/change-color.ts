import { hex2rgbString } from "@/lib/design-utils";
import { SerializedPage } from "@lidojs/design-core";

export const changeColorLayers = (
  pages: SerializedPage[],
  color: string | null
) => {
  if (!color) return pages;
  const rgb_color = hex2rgbString(color);
  return pages.map((page) => {
    Object.keys(page.layers).forEach((key) => {
      const layer = page.layers[key];
      if (layer.props.usingMainColor) {
        page.layers[key].props = {
          ...layer.props,
          ...(layer.props.color
            ? { color: rgb_color }
            : { colors: [rgb_color] }),
        };
      }
    });
    return page;
  });
};
