import { useEditor } from "@/lib/design-editor";
import { Line, lines } from "./data/line";
import { Shape, shapes } from "./data/shape";

const ShapeContent = () => {
  const { actions } = useEditor();
  const addLine = (props: Line["props"]) => {
    actions.addLineLayer({ props });
  };
  const addShape = (shape: Shape) => {
    actions.addShapeLayer({
      type: {
        resolvedName: "ShapeLayer",
      },
      props: {
        colors: ["rgb(0, 0, 0)"],
        fontSizes: [5],
        text: '<p style="font-family: Roboto;text-align:center;vertical-align:middle;font-size: 5px;color: rgb(255, 255, 255);line-height: 1.4;letter-spacing: 0em;"><span style="color: rgb(115, 115, 115);"></span></p>',

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
        shape: shape.type,
        position: {
          x: 0,
          y: 100,
        },
        boxSize: {
          width: shape.width,
          height: shape.height,
        },
        rotate: 0,
        color: "#5E6278",
      },
    });
  };
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <div className="p-[16px]">
        <div className="text-white pt-[8px] font-[700]">Arrow</div>
        <div className="grow overflow-y-auto grid grid-cols-[repeat(4,minmax(0,1fr))] gap-8">
          {lines.map((l, idx) => (
            <div
              key={idx}
              className="w-full pb-[100%] relative "
              onClick={() => addLine(l.props)}
            >
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                {l.icon}
              </div>
            </div>
          ))}
        </div>
        <div className="text-white pt-[8px] font-[700]">Shape</div>
        <div className="grow overflow-y-auto grid grid-cols-[repeat(4,minmax(0,1fr))] gap-8">
          {shapes.map((shape) => (
            <div
              key={shape.type}
              className="w-full pb-[100%] relative cursor-pointer"
              onClick={() => addShape(shape)}
            >
              {shape.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShapeContent;
