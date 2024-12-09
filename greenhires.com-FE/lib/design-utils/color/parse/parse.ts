import { rgb2hsv } from "../rgb2hsv";
import { HSVAColor } from "../types";
import { hexColorRegex, parseHex } from "./parse-hex";
import { parseRgba, rgbColorRegex } from "./parse-rgba";

function nameToRGB(color: string) {
  // Create fake div
  let fakeDiv = document.createElement("div");
  fakeDiv.style.color = color;
  document.body.appendChild(fakeDiv);

  // Get color of div
  let cs = window.getComputedStyle(fakeDiv),
    pv = cs.getPropertyValue("color");

  // Remove div after obtaining desired color value
  document.body.removeChild(fakeDiv);
  return pv;
}

export const parseColor = (color: string): HSVAColor => {
  let rgbColor;
  if (rgbColorRegex.test(color)) {
    rgbColor = parseRgba(color);
  } else if (hexColorRegex.test(color)) {
    rgbColor = parseHex(color);
  }

  if (rgbColor) {
    return rgb2hsv(rgbColor);
  }
  try {
    const rgbColor = parseRgba(nameToRGB(color));
    if (!rgbColor) {
      throw new Error(`Cannot parse ${color}`);
    }
    return rgb2hsv(rgbColor);
  } catch {
    throw new Error(`Cannot parse ${color}`);
  }
};
