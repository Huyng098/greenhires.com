import { SerializedLayerTree } from "@lidojs/design-core";

export const AwardComponent: SerializedLayerTree[] = [
  {
    rootId: "sections.awards.name",
    layers: {
      "sections.awards.name": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="text-align: left;font-family: Roboto;font-size: 7.793px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><strong><span style="color: rgb(50, 59, 76);">AWARD</span></strong></p>',
          position: { x: 58, y: 517 },
          boxSize: {
            width: 154,
            height: 28,
            x: 608,
            y: 170,
          },
          scale: 2,
          rotate: 0,
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
          colors: ["rgb(0, 0, 0)", "rgb(0, 0, 0)"],
          fontSizes: [10],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.awards.items[{humantree_id}].title",
    layers: {
      "sections.awards.items[{humantree_id}].title": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">TITLE</span></p>',
          position: { x: 58, y: 550 },
          boxSize: {
            width: 250,
            height: 14,
            x: 362,
            y: 127,
          },
          scale: 1,
          rotate: 0,
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
          colors: ["rgb(0, 0, 0)", "rgb(0, 0, 0)"],
          fontSizes: [10],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.awards.items[{humantree_id}].date",
    layers: {
      "sections.awards.items[{humantree_id}].date": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">DATE</span></p>',
          position: { x: 58, y: 560 },
          boxSize: {
            width: 200,
            height: 14,
            x: 362,
            y: 127,
          },
          scale: 1,
          rotate: 0,
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
          colors: ["rgb(0, 0, 0)", "rgb(0, 0, 0)"],
          fontSizes: [10],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.awards.items[{humantree_id}].awarder",
    layers: {
      "sections.awards.items[{humantree_id}].awarder": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">AWARDER</span></p>',
          position: { x: 58, y: 575 },
          boxSize: {
            width: 200,
            height: 14,
            x: 362,
            y: 127,
          },
          scale: 1,
          rotate: 0,
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
          colors: ["rgb(0, 0, 0)", "rgb(0, 0, 0)"],
          fontSizes: [10],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.awards.items[{humantree_id}].summary",
    layers: {
      "sections.awards.items[{humantree_id}].summary": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">SUMMARY</span></p>',
          position: { x: 58, y: 585 },
          boxSize: {
            width: 300,
            height: 40,
            x: 362,
            y: 127,
          },
          scale: 1,
          rotate: 0,
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
          colors: ["rgb(0, 0, 0)", "rgb(0, 0, 0)"],
          fontSizes: [10],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
];

export const AwardLayout: SerializedLayerTree = {
  rootId: "awards.layout",
  layers: {
    "awards.layout": {
      type: { resolvedName: "ShapeLayer" },
      props: {
        text: '<p style="text-align: center;font-family: Roboto;font-size: 5px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;">AWARD</p>',
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
          x: 34,
          y: 600,
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
