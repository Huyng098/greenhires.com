export type TemplateLayoutio = {
  name: string;
  previews: string[];
};

export const layoutList: TemplateLayoutio[] = [
  {
    name: "Layout 1",
    previews: ["/images/layouts/1.png"],
  },
  {
    name: "Layout 2",
    previews: ["/images/layouts/2.png"],
  },
  {
    name: "Layout 3",
    previews: ["/images/layouts/3.png"],
  },
  {
    name: "Layout 4",
    previews: ["/images/layouts/4.png"],
  },
  {
    name: "Layout 5",
    previews: ["/images/layouts/5.png"],
  },
  {
    name: "Layout 6",
    previews: ["/images/layouts/6.png"],
  },
  {
    name: "Layout 7",
    previews: ["/images/layouts/7.png"],
  },
  {
    name: "Layout 8",
    previews: ["/images/layouts/8.png"],
  },
  {
    name: "Layout 9",
    previews: ["/images/layouts/9.png"],
  },
];

interface ILayoutSectionProps {
  imagePath: string;
  numOfSection: number;
}
export interface ILayoutSection {
  [key: string]: ILayoutSectionProps;
}

export const LAYOUT_SECTIONS: ILayoutSection = {
  "Layout 1": {
    imagePath: "/images/layouts/sections/layout-1/",
    numOfSection: 3,
  },
  "Layout 2": {
    imagePath: "/images/layouts/sections/layout-2/",
    numOfSection: 3,
  },
  "Layout 3": {
    imagePath: "/images/layouts/sections/layout-3/",
    numOfSection: 2,
  },
  "Layout 4": {
    imagePath: "/images/layouts/sections/layout-4/",
    numOfSection: 3,
  },
  "Layout 5": {
    imagePath: "/images/layouts/sections/layout-5/",
    numOfSection: 5,
  },
  "Layout 6": {
    imagePath: "/images/layouts/sections/layout-6/",
    numOfSection: 3,
  },
  "Layout 7": {
    imagePath: "/images/layouts/sections/layout-7/",
    numOfSection: 3,
  },
  "Layout 8": {
    imagePath: "/images/layouts/sections/layout-8/",
    numOfSection: 2,
  },
  "Layout 9": {
    imagePath: "/images/layouts/sections/layout-9/",
    numOfSection: 5,
  },
};
