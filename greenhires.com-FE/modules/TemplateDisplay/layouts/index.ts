export * from "./001";
export * from "./002";
export * from "./003";
export * from "./004";
export * from "./005";
export * from "./006";
export * from "./007";
export * from "./008";
export * from "./009";

export const getStyle = (style: any, key: string) => {
  const { border } = style?.[key] || {};
  const borderRadius = border?.borderRadius || 0;
  const borderType = border?.borderType || "none";
  const backgroundImage = border?.backgroundImage;
  const padding =
    borderType !== "none" ? `${Math.max(borderRadius / 3, 20)}px` : 0;

  return border && { borderRadius, backgroundImage, padding };
};
