import { SerializedLayerTree } from "@lidojs/design-core";

export const AboutMeComponent: SerializedLayerTree[] = [
  {
    rootId: "sections.aboutme.name",
    layers: {
      "sections.aboutme.name": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="text-align: left;font-family: Roboto;font-size: 7.793px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><strong><span style="color: rgb(50, 59, 76);">ABOUT ME</span></p>',
          position: { x: 386, y: 22 },
          boxSize: {
            width: 100,
            height: 23,
            x: 362,
            y: 127,
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
    rootId: "sections.aboutme.content",
    layers: {
      "sections.aboutme.content": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">CONTENT</span></p>',
          position: { x: 386, y: 57 },
          boxSize: {
            width: 400,
            height: 98,
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
          colors: ["rgb(0, 0, 0)", "rgb(115, 115, 115)"],
          fontSizes: [10],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
];

export const AboutMeLayout: SerializedLayerTree = {
  rootId: "aboutme.layout",
  layers: {
    "aboutme.layout": {
      type: { resolvedName: "ShapeLayer" },
      props: {
        text: '<p style="text-align: center;font-family: Roboto;font-size: 5px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;">ABOUT ME</p>',
        color: "rgb(255, 255, 255)",
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
        colors: ["rgb(255, 255, 255)"],
        rotate: 0,
        boxSize: {
          x: 19,
          y: 18.5,
          width: 750,
          height: 123.2,
        },
        position: {
          x: 19,
          y: 18.5,
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
