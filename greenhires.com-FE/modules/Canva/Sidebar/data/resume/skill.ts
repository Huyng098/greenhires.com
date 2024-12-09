import { SerializedLayerTree } from "@lidojs/design-core";

export const SkillComponent: SerializedLayerTree[] = [
  {
    rootId: "sections.skills.name",
    layers: {
      "sections.skills.name": {
        type: { resolvedName: "TextLayer" },
        props: {
          key: "sections.skills.name",
          text: '<p style="text-align: left;font-family: Roboto;font-size: 7.793px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><strong><span style="color: rgb(50, 59, 76);">SKILL</span></p>',
          position: { x: 5.942594051227196, y: 928.4378653334118 },
          boxSize: {
            width: 154.77245895665138,
            height: 28.360119047619055,
            x: 608.4320831493314,
            y: 170.35714285714283,
          },
          scale: 2,
          rotate: 0,
          fonts: [],
          colors: ["rgb(0, 0, 0)"],
          fontSizes: [28],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.skills.items[{humantree_id}].name",
    layers: {
      "sections.skills.items[{humantree_id}].name": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">NAME</span></p>',
          position: { x: 5.942594051227196, y: 968.5198623943439 },
          boxSize: {
            width: 400,
            height: 14,
            x: 608.4320831493314,
            y: 127.00375939849624,
          },
          scale: 1,
          rotate: 0,
          fonts: [],
          colors: ["rgb(0, 0, 0)"],
          fontSizes: [10],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.skills.items[{humantree_id}].level",
    layers: {
      "sections.skills.items[{humantree_id}].level": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">LEVEL</span></p>',
          position: { x: 5.942594051227196, y: 996.5198623943439 },
          boxSize: {
            width: 400,
            height: 14,
            x: 608.4320831493314,
            y: 127.00375939849624,
          },
          scale: 1,
          rotate: 0,
          fonts: [],
          colors: ["rgb(0, 0, 0)"],
          fontSizes: [10],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.skills.items[{humantree_id}].description",
    layers: {
      "sections.skills.items[{humantree_id}].description": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-size: 10px;font-weight: 300;text-align: left;color: rgb(0, 0, 0);">DESCRIPTION</p>',
          position: { x: 5.942594051227196, y: 1026 },
          boxSize: {
            width: 400,
            height: 14,
            x: 608.4320831493314,
            y: 127.00375939849624,
          },
          scale: 1,
          rotate: 0,
          fonts: [],
          colors: ["rgb(0, 0, 0)"],
          fontSizes: [10],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
];

export const SkillLayout: SerializedLayerTree = {
  rootId: "skills.layout",
  layers: {
    "skills.layout": {
      type: { resolvedName: "ShapeLayer" },
      props: {
        text: '<p style="text-align: center;font-family: Roboto;font-size: 5px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;">SKILL</p>',
        fonts: [
          {
            name: "Roboto",
            fonts: [
              {
                name: "Roboto",
                fonts: [
                  {
                    style: "regular",
                    urls: ["fonts/Roboto/Roboto[wdth,wght].woff2"],
                  },
                  {
                    style: "italic",
                    urls: ["fonts/Roboto/Roboto-Italic[wdth,wght].woff2"],
                  },
                ],
              },
            ],
          },
        ],
        scale: 3.721875,
        shape: "rectangle",
        border: {
          color: "rgb(0, 0, 0)",
          style: "solid",
          weight: 1,
        },
        colors: ["rgb(0, 0, 0)"],
        rotate: 0,
        boxSize: {
          x: 34,
          y: 253,
          width: 320,
          height: 111,
        },
        position: {
          x: 34,
          y: 473,
        },
        fontSizes: [5],
        gradientBackground: null,
      },
      locked: false,
      child: [],
      parent: "LAYOUT",
    },
  },
};
