import { SerializedLayerTree } from "@lidojs/design-core";

export const CustomSectionComponent: SerializedLayerTree[] = [
  {
    rootId: "sections.custom.{custom_id}.name",
    layers: {
      "sections.custom.{custom_id}.name": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;font-weight: 600;"><strong>CUSTOM SECTION</strong></p>',
          position: { x: 10, y: 750 },
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
    rootId: "sections.custom.{custom_id}.items[{humantree_id}].name",
    layers: {
      "sections.custom.{custom_id}.items[{humantree_id}].name": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 6px;font-weight: 300;">NAME</p>',
          position: { x: 10, y: 780 },
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
    rootId: "sections.custom.{custom_id}.items[{humantree_id}].summary",
    layers: {
      "sections.custom.{custom_id}.items[{humantree_id}].summary": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 6px;font-weight: 300;">SUMMARY</p>',
          position: { x: 9, y: 858 },
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
    rootId:
      "sections.custom.{custom_id}.items[{humantree_id}].startDate&endDate",
    layers: {
      "sections.custom.{custom_id}.items[{humantree_id}].startDate&endDate": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 6px;font-weight: 300;">STARTDATE - ENDDATE</p>',
          position: { x: 9, y: 880 },
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

export const CustomSectionLayout: SerializedLayerTree = {
  rootId: "customsection.layout",
  layers: {
    "customsection.layout": {
      type: { resolvedName: "ShapeLayer" },
      props: {
        text: '<p style="text-align: center;font-family: Roboto;font-size: 5px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;">CUSTOM SECTION</p>',
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
          height: 200,
        },
        position: {
          x: 19,
          y: 860,
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
