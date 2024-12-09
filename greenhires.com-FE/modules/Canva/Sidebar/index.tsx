"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/interfaces/general/category";
import { useEditor } from "@/lib/design-editor";
import { cn } from "@/lib/utils";
import { X } from "@phosphor-icons/react";
import FrameContent from "./FrameContent";
import GraphicContent from "./GraphicContent";
import ImageContent from "./ImageContent";
import { SampleContent } from "./SampleContent";
import { SectionContent } from "./SectionContent";
import ShapeContent from "./ShapeContent";
import TextContent from "./TextContent";
import UploadContent from "./UploadContent";

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
  categories: Category[];
}

export default function SidebarContent({
  menuContent,
  setMenuContent,
  categories,
}: Props) {
  const { sidebar } = useEditor((state) => ({
    sidebar: state.sidebar,
  }));

  return (
    <>
      {(menuContent || sidebar) && (
        <ScrollArea
          className={cn(
            "h-full flex min-w-[350px] bg-primary-main"
            // sidebar ? "animate-slide-right" : "animate-slide-left"
          )}
        >
          <div className="flex justify-end cursor-pointer text-white hover:text-red-400 pr-4 pt-3">
            <X
              size={20}
              weight="light"
              onClick={() => setMenuContent(undefined)}
            />
          </div>
          {menuContent === "template" && (
            <SampleContent categories={categories} type="Template" />
          )}
          {menuContent === "layout" && (
            <SampleContent categories={categories} type="Layout" />
          )}
          {menuContent === "section" && <SectionContent />}
          {menuContent === "text" && <TextContent />}
          {menuContent === "image" && <ImageContent />}
          {menuContent === "frame" && <FrameContent />}
          {menuContent === "graphic" && <GraphicContent />}
          {menuContent === "shape" && <ShapeContent />}
          {menuContent === "upload" && <UploadContent />}

          <div
            style={{
              width: 350,
              position: "absolute",
              overflow: "hidden",
              top: 0,
              left: 0,
              height: "100%",
              pointerEvents: "none",
              zIndex: 2,
            }}
            id={"settings"}
          />
        </ScrollArea>
      )}
    </>
  );
}
