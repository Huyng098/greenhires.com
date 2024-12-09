import { v4 as uuidv4 } from "uuid";
export const defaultResumeCanva = [
  {
    locked: false,
    layers: {
      ROOT: {
        type: { resolvedName: "RootLayer" },
        props: {
          boxSize: { width: 794, height: 1123 },
          position: { x: 0, y: 0 },
          rotate: 0,
          color: "rgb(255, 255, 255)",
          image: null,
        },
        locked: false,
        child: [],
        parent: null,
      },
    },
  },
];

export const getDefaultResumeCanva = (
  pgNumber: number,
  resumeId?: string,
  resolvedName: string = "ResumeLayer"
) => {
  const id = uuidv4();
  
  return [
    {
      locked: false,
      layers: {
        ROOT: {
          type: { resolvedName: "RootLayer" },
          props: {
            boxSize: { width: 794, height: 1123 },
            position: { x: 0, y: 0 },
            rotate: 0,
            color: "rgb(255, 255, 255)",
            image: null,
          },
          locked: false,
          child: [id],
          parent: null,
        },
        [id]: {
          type: { resolvedName },
          props: {
            pageNumber: pgNumber,
            ...(resumeId && { resumeId }),
            position: { x: 0, y: 0 },
            boxSize: { width: 794, height: 1123 },
          },
          locked: true,
          child: [],
          parent: "ROOT",
        },
      },
    },
  ];
};
