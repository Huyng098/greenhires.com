import { RGBAColor } from "../types";

export const rgbColorRegex =
  /rgba?\((?<r>[.\d]+)[, ]+(?<g>[.\d]+)[, ]+(?<b>[.\d]+)(?:\s?[,/]\s?(?<a>[.\d]+%?))?\)/i;
export const parseRgba = (color: string) => {
  const result = rgbColorRegex.exec(color);
  if (result?.groups) {
    return {
      r: parseInt(result.groups.r, 10),
      g: parseInt(result.groups.g, 10),
      b: parseInt(result.groups.b, 10),
      a: typeof result.groups.a !== "undefined" ? parseInt(result.groups.a) : 1,
    } as RGBAColor;
  }
};
