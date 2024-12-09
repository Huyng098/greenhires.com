import { SerializedLayerTree } from "@lidojs/design-core";

export const LanguageComponent: SerializedLayerTree[] = [
  {
    rootId: "sections.languages.name",
    layers: {
      "sections.languages.name": {
        type: { resolvedName: "TextLayer" },
        props: {
          key: "sections.skills.name",
          text: '<p style="text-align: left;font-family: Roboto;font-size: 7.793px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><strong><span style="color: rgb(50, 59, 76);">LANGUAGE</span></strong></p>',
          position: { x: 19.865690163195907, y: 795.9248120300751 },
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
          fontSizes: [20],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.languages.items[{humantree_id}].name",
    layers: {
      "sections.languages.items[{humantree_id}].name": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">NAME</span></p>',
          position: { x: 19.865690163195907, y: 843.8617021276596 },
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
    rootId: "sections.languages.items[{humantree_id}].level",
    layers: {
      "sections.languages.items[{humantree_id}].level": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">LEVEL</span></p>',
          position: { x: 19.865690163195907, y: 873.8617021276596 },
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
    rootId: "sections.languages.items[{humantree_id}].summary",
    layers: {
      "sections.languages.items[{humantree_id}].summary": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">SUMMARY</span></p>',
          position: { x: 19.865690163195907, y: 900.8617021276596 },
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

export const LanguageLayout: SerializedLayerTree = {
  rootId: "languages.layout",
  layers: {
    "languages.layout": {
      type: { resolvedName: "ShapeLayer" },
      props: {
        text: '<p style="text-align: center;font-family: Roboto;font-size: 5px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;">LANGUAGE</p>',
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
          x: 420,
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
