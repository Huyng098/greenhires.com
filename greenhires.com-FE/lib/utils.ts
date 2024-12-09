import {
  PAGE_HEIGHT,
  PAGE_PADDING_X,
  PAGE_PADDING_Y,
  PAGE_WIDTH,
} from "@/constants/general";
import { ShapeType } from "@lidojs/design-core";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePages(
  containerRef: React.RefObject<HTMLDivElement>,
  top: number = PAGE_PADDING_Y,
  right: number = PAGE_PADDING_X,
  bottom: number = PAGE_PADDING_Y,
  left: number = PAGE_PADDING_X
): HTMLDivElement[] {
  let pageList: HTMLDivElement[] = [];

  const width = PAGE_WIDTH - right - left;
  const height = PAGE_HEIGHT - top - bottom;
  const totalWidth = containerRef.current!.scrollWidth;
  const numPages = Math.ceil(totalWidth / PAGE_WIDTH);

  const content = containerRef.current!.innerHTML;
  for (let i = 0; i < numPages; i++) {
    const page = document.createElement("div");
    page.innerHTML = content;
    page.style.cssText = `
          width: ${width}px;
          height: ${height}px;
          column-fill: auto;
          column-gap: 0;
          column-width: ${width}px;
          transform: translateX(-${i * width}px);
        `;

    const pageClip = document.createElement("div");
    pageClip.style.cssText = `
          width: ${width}px;
          height: ${height}px;
          overflow: hidden;
        `;
    pageClip.appendChild(page);

    const pageWrapper = document.createElement("div");
    // pageWrapper.className = cn(
    //   "bg-repeat-x bg-contain bg-center",
    //   i === 0 ? "bg-first-page" : "bg-second-page"
    // );
    pageWrapper.style.cssText = `
          width: ${PAGE_WIDTH}px;
          height: ${PAGE_HEIGHT}px;
          margin: 0 auto;
          padding: ${top}px ${right}px ${bottom}px ${left}px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        `;
    pageWrapper.appendChild(pageClip);
    pageList.push(pageWrapper);
  }
  return pageList;
}

export function getSectionOrder(
  sections: string[],
  includedSections: string[],
  hasCustom: boolean = false
) {
  return sections.filter((section) => {
    if (hasCustom && section.startsWith("custom.")) return true;

    return includedSections.includes(section);
  });
}

export const isShapeType = (type: any): type is ShapeType => {
  const shapeTypes = [
    "circle",
    "rectangle",
    "triangle",
    "triangleUpsideDown",
    "parallelogram",
    "parallelogramUpsideDown",
    "trapezoid",
    "trapezoidUpsideDown",
    "cross",
    "arrowRight",
    "arrowLeft",
    "arrowTop",
    "arrowBottom",
    "rhombus",
    "chevron",
    "arrowPentagon",
    "pentagon",
    "hexagonVertical",
    "hexagonHorizontal",
    "octagon",
    "chatBubbleSquare",
    "chatBubbleRound",
  ];
  return shapeTypes.includes(type);
};

export function extractUrl(urlString: string): string | null {
  const regex = /url\(['"]?(.*?)['"]?\)/;
  const match = urlString.match(regex);
  return match ? match[1] : null;
}

export function isValidDate(date: any): boolean {
  if (!date) return false;
  return dayjs(date).isValid();
}
