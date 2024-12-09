import { SerializedLayerTree } from "@lidojs/design-core";

export const CertificationComponent: SerializedLayerTree[] = [
  {
    rootId: "sections.certifications.name",
    layers: {
      "sections.certifications.name": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;font-weight: 600;"><strong>CERTIFICATION</strong></p>',
          position: { x: 421, y: 500 },
          boxSize: {
            width: 230,
            height: 20,
            x: 0,
            y: 0,
          },
          scale: 1.6664659843467788,
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
          fontSizes: [10],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.certifications.items[{humantree_id}].title",
    layers: {
      "sections.certifications.items[{humantree_id}].title": {
        type: { resolvedName: "TextLayer" },
        props: {
          item: true,
          text: '<p style="font-family: Roboto;font-size: 6px;font-weight: 300;">TITLE</p>',
          position: { x: 429, y: 545 },
          boxSize: {
            width: 230,
            height: 30,
            x: 0,
            y: 0,
          },
          scale: 1.6664659843467788,
          rotate: 0,
          fonts: [],
          colors: ["rgb(0, 0, 0)"],
          fontSizes: [6],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.certifications.items[{humantree_id}].issuer",
    layers: {
      "sections.certifications.items[{humantree_id}].issuer": {
        type: { resolvedName: "TextLayer" },
        props: {
          item: true,
          text: '<p style="font-family: Roboto;font-size: 6px;font-weight: 300;">ISSUER</p>',
          position: { x: 429, y: 625 },
          boxSize: {
            width: 230,
            height: 15,
            x: 0,
            y: 0,
          },
          scale: 1.6664659843467788,
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
          fontSizes: [6],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.certifications.items[{humantree_id}].date",
    layers: {
      "sections.certifications.items[{humantree_id}].date": {
        type: { resolvedName: "TextLayer" },
        props: {
          item: true,
          text: '<p style="font-family: Roboto;font-size: 6px;font-weight: 400;">DATE</p>',
          position: { x: 430, y: 530 },
          boxSize: {
            width: 230,
            height: 12,
            x: 0,
            y: 0,
          },
          scale: 1.6664659843467788,
          rotate: 0,
          fonts: [],
          colors: ["rgb(0, 0, 0)"],
          fontSizes: [6],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
  {
    rootId: "sections.certifications.items[{humantree_id}].summary",
    layers: {
      "sections.certifications.items[{humantree_id}].summary": {
        type: { resolvedName: "TextLayer" },
        props: {
          item: true,
          text: '<p style="font-family: Roboto;font-size: 6px;font-weight: 300;">SUMMARY</p>',
          position: { x: 429, y: 588 },
          boxSize: {
            width: 230,
            height: 30,
            x: 0,
            y: 0,
          },
          scale: 1.6664659843467788,
          rotate: 0,
          fonts: [],
          colors: ["rgb(0, 0, 0)"],
          fontSizes: [6],
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
];

export const CertificationLayout: SerializedLayerTree = {
  rootId: "certifications.layout",
  layers: {
    "certifications.layout": {
      type: { resolvedName: "ShapeLayer" },
      props: {
        text: '<p style="text-align: center;font-family: Roboto;font-size: 5px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;">CERTIFICATION</p>',
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
          y: 353,
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
