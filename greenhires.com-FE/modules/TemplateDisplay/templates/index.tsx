import { Template1 } from "./001";
import { Template2 } from "./002";
import { Template3 } from "./003";
import { Template4 } from "./004";
import { Template5 } from "./005";
import { Template6 } from "./006";
import { Template7 } from "./007";
import { Template8 } from "./008";
import { Template9 } from "./009";
import { Template11 } from "./011";
import { template2BgList } from "./002/bg-list";
import { Template13 } from "./013";
import { Template14 } from "./014";

import {
  Layout1,
  Layout2,
  Layout3,
  Layout4,
  Layout5,
  Layout6,
  Layout7,
  Layout8,
  Layout9,
} from "../layouts";
import { template14BgList } from "./014/bg-list";

const DEFAULT_BG = "url('/templates/bg-default.png')";

interface ITemplate {
  builder: any;
  firstPageBg: string;
  secondPageBg: string;
  fixedPageNumber?: boolean;
  paddingX?: number;
  paddingY?: number;
}

export const getTemplate = (template: string, mainColor: string): ITemplate => {
  switch (template) {
    case "Template 1":
      return {
        builder: Template1,
        firstPageBg: "url('/templates/1/bg.png')",
        secondPageBg: "url('/templates/1/bg.png')",
      };
    case "Template 2":
      return {
        builder: Template2,
        firstPageBg: template2BgList[mainColor],
        secondPageBg: template2BgList[mainColor],
      };
    case "Template 3":
      return {
        builder: Template3,
        firstPageBg: "url('/templates/3/bg-1.png')",
        secondPageBg: "url('/templates/3/bg-2.png')",
      };
    case "Template 4":
      return {
        builder: Template4,
        firstPageBg: "url('/templates/4/bg-1.png')",
        secondPageBg: DEFAULT_BG,
      };
    case "Template 5":
      return {
        builder: Template5,
        firstPageBg: "url('/templates/5/bg-1.png')",
        secondPageBg: "url('/templates/5/bg-1.png')",
      };
    case "Template 6":
      return {
        builder: Template6,
        firstPageBg: "url('/templates/6/bg-1.png')",
        secondPageBg: "url('/templates/6/bg-1.png')",
      };
    case "Template 7":
      return {
        builder: Template7,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
    case "Template 8":
      return {
        builder: Template8,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
    case "Template 9":
      return {
        builder: Template9,
        firstPageBg: "url('/templates/9/bg-a.png')",
        secondPageBg: "url('/templates/9/bg-a.png')",
      };
    case "Template 11":
      return {
        builder: Template11,
        firstPageBg: "",
        secondPageBg: "url('/templates/11/bg-2.jpg')",
      };
    case "Template 13":
      return {
        builder: Template13,
        firstPageBg: "url('/templates/13/bg-1.png')",
        secondPageBg: "url('/templates/13/bg-2.png')",
      };
    case "Template 14":
      return {
        builder: Template14,
        // firstPageBg: template14BgList[mainColor],
        // secondPageBg: template14BgList[mainColor],
        firstPageBg: "url('/templates/14/bg-a.png')",
        secondPageBg: "url('/templates/14/bg-a.png')",
      };

    // Layout
    case "Layout 1":
      return {
        builder: Layout1,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
    case "Layout 2":
      return {
        builder: Layout2,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
    case "Layout 3":
      return {
        builder: Layout3,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
    case "Layout 4":
      return {
        builder: Layout4,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
    case "Layout 5":
      return {
        builder: Layout5,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
    case "Layout 6":
      return {
        builder: Layout6,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
    case "Layout 7":
      return {
        builder: Layout7,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
    case "Layout 8":
      return {
        builder: Layout8,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
    case "Layout 9":
      return {
        builder: Layout9,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
    default:
      return {
        builder: Template1,
        firstPageBg: DEFAULT_BG,
        secondPageBg: DEFAULT_BG,
      };
  }
};
