import { SerializedPage } from "@lidojs/design-core";
import { Page } from "../../types";
import { serializeLayers } from "./layers";

export const serialize = (pages: Page[]): SerializedPage[] => {
  return pages.map((page) => {
    return {
      layers: serializeLayers(page.layers, "ROOT"),
    };
  });
};
