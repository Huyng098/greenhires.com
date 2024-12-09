import { SerializedLayerTree } from "@lidojs/design-core";

export const BasicsComponent: SerializedLayerTree[] = [
  {
    rootId: "basics.headline",
    layers: {
      "basics.headline": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="text-align: left;font-family: Roboto;font-size: 7.793px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><strong><span style="color: rgb(50, 59, 76);">HEADLINE</span></p>',
          position: { x: 58, y: 200 },
          boxSize: {
            width: 140,
            height: 30,
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
    rootId: "basics.firstname&lastname",
    layers: {
      "basics.firstname&lastname": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="text-align: left;font-family: Roboto;font-size: 7.793px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><strong><span style="color: rgb(50, 59, 76);">FIRSTNAME & LASTNAME</span></p>',
          position: { x: 58, y: 230 },
          boxSize: {
            width: 400,
            height: 30,
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
    rootId: "basics.email",
    layers: {
      "basics.email": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">EMAIL</span></p>',
          position: { x: 58, y: 320 },
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
    rootId: "basics.phone",
    layers: {
      "basics.phone": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">PHONE</span></p>',
          position: { x: 58, y: 260 },
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
    rootId: "basics.country",
    layers: {
      "basics.country": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">COUNTRY</span></p>',
          position: { x: 160, y: 280 },
          boxSize: {
            width: 60,
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
    rootId: "basics.city",
    layers: {
      "basics.city": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">CITY</span></p>',
          position: { x: 58, y: 280 },
          boxSize: {
            width: 100,
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
    rootId: "basics.address",
    layers: {
      "basics.address": {
        type: { resolvedName: "TextLayer" },
        props: {
          text: '<p style="font-family: Roboto;font-size: 10px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);">ADDRESS</span></p>',
          position: { x: 58, y: 300 },
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
];

export const PictureComponent: SerializedLayerTree[] = [
  {
    rootId: "basics.picture",
    layers: {
      "basics.picture": {
        type: { resolvedName: "FrameLayer" },
        props: {
          scale: 0.24800000000000014,
          rotate: 0,
          color: "rgb(127, 127, 127)",
          boxSize: {
            x: 49.5,
            y: 38.999999999999936,
            width: 124.00000000000006,
            height: 124.00000000000006,
          },
          clipPath:
            "M 500 250.002 c 0 138.065 -111.931 249.996 -250 249.996 c -138.071 0 -250 -111.931 -250 -249.996 C 0 111.93 111.929 0 250 0 s 250 111.93 250 250.002 Z",
          position: {
            x: 200,
            y: 38.999999999999936,
          },
        },
        locked: false,
        child: [],
        parent: "COMPONENT",
      },
    },
  },
];

export const BasicsLayout: SerializedLayerTree = {
  rootId: "basics.layout",
  layers: {
    "basics.layout": {
      type: { resolvedName: "ShapeLayer" },
      props: {
        text: '<p style="text-align: center;font-family: Roboto;font-size: 5px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;">BASIC</p>',
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

export const PictureLayout: SerializedLayerTree = {
  rootId: "picture.layout",
  layers: {
    "picture.layout": {
      type: { resolvedName: "ShapeLayer" },
      props: {
        text: '<p style="text-align: center;font-family: Roboto;font-size: 5px;color: rgb(0, 0, 0);line-height: 1.4;letter-spacing: 0em;">PICTURE</p>',
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
};
