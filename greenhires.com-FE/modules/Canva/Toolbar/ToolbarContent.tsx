"use client";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useEditor } from "@/lib/design-editor/hooks";
import {
  Brain,
  Files,
  FileSvg,
  FrameCorners,
  Image,
  Layout,
  Shapes,
  Square,
  TextT,
  Upload,
} from "@phosphor-icons/react";

interface Props {
  menuContent:
    | "shape"
    | "upload"
    | "frame"
    | "graphic"
    | "template"
    | "layout"
    | "section"
    | "text"
    | "image"
    | undefined;
  setMenuContent: (
    content:
      | "shape"
      | "upload"
      | "frame"
      | "graphic"
      | "template"
      | "layout"
      | "section"
      | "text"
      | "image"
      | undefined
  ) => void;
}

export const ToolbarContent = ({ menuContent, setMenuContent }: Props) => {
  const { actions } = useEditor();

  const handleSetMenuContent = (content: string) => {
    actions.setSidebar();
    setMenuContent(content as any);
  };

  return (
    <div className="flex flex-col gap-5 p-5 pt-6">
      <Tooltip content="Template">
        <Button
          onClick={() => handleSetMenuContent("template")}
          className="bg-backgroundColor-second"
        >
          <Files
            size={26}
            className={`${menuContent === "template" && "text-secondary-main"}`}
          />
        </Button>
      </Tooltip>
      <Tooltip content="Shape">
        <Button
          onClick={() => handleSetMenuContent("shape")}
          className="bg-backgroundColor-second"
        >
          <Square
            size={26}
            className={`${menuContent === "shape" && "text-secondary-main"}`}
          />
        </Button>
      </Tooltip>
      <Tooltip content="Frame">
        <Button
          onClick={() => handleSetMenuContent("frame")}
          className="bg-backgroundColor-second"
        >
          <FrameCorners
            size={26}
            className={`${menuContent === "frame" && "text-secondary-main"}`}
          />
        </Button>
      </Tooltip>
      {/* <Tooltip content="Layout">
        <Button
          onClick={() => handleSetMenuContent("layout")}
          className="bg-backgroundColor-second"
        >
          <Layout
            size={26}
            className={`${menuContent === "layout" && "text-secondary-main"}`}
          />
        </Button>
      </Tooltip> */}
      <Tooltip content="Section">
        <Button
          onClick={() => handleSetMenuContent("section")}
          className="bg-backgroundColor-second"
        >
          <Shapes
            size={26}
            className={`${menuContent === "section" && "text-secondary-main"}`}
          />
        </Button>
      </Tooltip>
      <Tooltip content="Text">
        <Button
          onClick={() => handleSetMenuContent("text")}
          className="bg-backgroundColor-second"
        >
          <TextT
            size={26}
            className={`${menuContent === "text" && "text-secondary-main"}`}
          />
        </Button>
      </Tooltip>
      <Tooltip content="Image">
        <Button
          onClick={() => handleSetMenuContent("image")}
          className="bg-backgroundColor-second"
        >
          <Image
            size={26}
            className={`${menuContent === "image" && "text-secondary-main"}`}
          />
        </Button>
      </Tooltip>
      <Tooltip content="Graphic">
        <Button
          onClick={() => handleSetMenuContent("graphic")}
          className="bg-backgroundColor-second"
        >
          <FileSvg
            size={26}
            className={`${menuContent === "graphic" && "text-secondary-main"}`}
          />
        </Button>
      </Tooltip>
      <Tooltip content="Upload">
        <Button
          onClick={() => handleSetMenuContent("upload")}
          className="bg-backgroundColor-second"
        >
          <Upload
            size={26}
            className={`${menuContent === "upload" && "text-secondary-main"}`}
          />
        </Button>
      </Tooltip>
      <Button className="bg-gradient-to-t from-secondary-main to-primary-main ">
        <Brain size={26} />
      </Button>
    </div>
  );
};
