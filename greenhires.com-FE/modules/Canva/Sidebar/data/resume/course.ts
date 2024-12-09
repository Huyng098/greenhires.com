import { SerializedLayerTree } from "@lidojs/design-core";

export const CourseComponent: SerializedLayerTree[] = [
  {
    rootId: "sections.courses.name",
    layers: {
      "sections.courses.name": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-size: 20px;font-weight: 700;text-align: center;color: rgb(0, 0, 0);"><strong>COURSE</strong></p>',
          position: { x: 420, y: 795.9248120300751 },
          boxSize: {
            width: 154.77245895665138,
            height: 28.360119047619055,
            x: 608.4320831493314,
            y: 170.35714285714283,
          },
          scale: 1,
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
    rootId: "sections.courses.items[{humantree_id}].name",
    layers: {
      "sections.courses.items[{humantree_id}].name": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-size: 10px;font-weight: 300;text-align: left;color: rgb(0, 0, 0);">NAME</p>',
          position: { x: 484.84250134110303, y: 843.8617021276596 },
          boxSize: {
            width: 100,
            height: 14,
            x: 362.57616095391563,
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
    rootId: "sections.courses.items[{humantree_id}].institution",
    layers: {
      "sections.courses.items[{humantree_id}].institution": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-size: 10px;font-weight: 300;text-align: left;color: rgb(0, 0, 0);">INSTITUTION</p>',
          position: { x: 484.84250134110303, y: 900.8617021276596 },
          boxSize: {
            width: 100,
            height: 14,
            x: 362.57616095391563,
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
    rootId: "sections.courses.items[{humantree_id}].startDate&endDate",
    layers: {
      "sections.courses.items[{humantree_id}].startDate&endDate": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-size: 10px;font-weight: 300;text-align: left;color: rgb(0, 0, 0);">START DATE - END DATE</p>',
          position: { x: 484.84250134110303, y: 830.8617021276596 },
          boxSize: {
            width: 400,
            height: 14,
            x: 362.57616095391563,
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

export const CourseLayout: SerializedLayerTree = {
  rootId: "courses.layout",
  layers: {
    "courses.layout": {
      type: { resolvedName: "ShapeLayer" },
      props: {
        text: '<p style="text-align: center;font-family: Roboto;font-size: 5px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;">COURSE</p>',
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
          y: 721,
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
