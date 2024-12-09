import { Button } from "@/components/ui/button";
import { useEditor } from "@/lib/design-editor";
import { useBuilderStore } from "@/stores/builder";
import { X } from "@phosphor-icons/react";
import { Line, lines } from "./line";
import { Shape, shapes } from "./shape";

const ShapeContent = () => {
  const setIsApply = useBuilderStore()((state) => state.workspace.setIsApply);
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
    <div className="w-full h-full flex flex-col">
      <div className="p-[16px]">
        <div className="flex justify-between">
          <div className="text-primary-main pt-[8px] font-[700]">Arrow</div>
          <Button
            onClick={() => setIsApply("none")}
            variant="destructive"
            className="rounded-xl"
          >
            <X size={24} className="mr-4" />
            Close
          </Button>
        </div>
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
        <div className="text-primary pt-[8px] font-[700]">Shape</div>
        <div className="grow overflow-y-auto grid grid-cols-[repeat(4,minmax(0,1fr))] gap-8">
          {shapes.map((shape) => (
            <div
              key={shape.type}
              className="w-full pb-[100%] relative cursor-pointer text-black"
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
