import { SerializedLayerTree } from "@lidojs/design-core";

export const ReferenceComponent: SerializedLayerTree[] = [
  {
    rootId: "sections.references.name",
    layers: {
      "sections.references.name": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;font-weight: 600;"><strong>REFERENCE</strong></p>',
          position: { x: 430, y: 950 },
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
    rootId: "sections.references.items[{humantree_id}].name",
    layers: {
      "sections.references.items[{humantree_id}].name": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 6px;font-weight: 300;">NAME</p>',
          position: { x: 430, y: 980 },
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
    rootId: "sections.references.items[{humantree_id}].position",
    layers: {
      "sections.references.items[{humantree_id}].position": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 6px;font-weight: 300;"><strong>POSITION</strong></p>',
          position: { x: 429, y: 995 },
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
    rootId: "sections.references.items[{humantree_id}].phone",
    layers: {
      "sections.references.items[{humantree_id}].phone": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 6px;font-weight: 300;">PHONE</p>',
          position: { x: 429, y: 1025 },
          boxSize: {
            width: 230,
            height: 15,
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
    rootId: "sections.references.items[{humantree_id}].email",
    layers: {
      "sections.references.items[{humantree_id}].email": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 6px;font-weight: 300;"><strong>EMAIL</strong></p>',
          position: { x: 429, y: 1010 },
          boxSize: {
            width: 230,
            height: 15,
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

export const ReferenceLayout: SerializedLayerTree = {
  rootId: "references.layout",
  layers: {
    "references.layout": {
      type: { resolvedName: "ShapeLayer" },
      props: {
        text: '<p style="text-align: center;font-family: Roboto;font-size: 5px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;">REFERENCE</p>',
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
          y: 710,
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
