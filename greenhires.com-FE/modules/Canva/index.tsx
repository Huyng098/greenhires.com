"use client";
import { Category } from "@/interfaces/general/category";
import {
  Editor,
  GetFontQuery,
  PageControl
} from "@/lib/design-editor";
import { getAllTextFont } from "@/services/canva";
import qs from "query-string";
import { useCallback, useMemo, useState } from "react";
import AppLayerSettings from "./Editor/AppLayerSettings";
import EditorContent from "./Editor/EditorContent";
import SidebarContent from "./Sidebar";
import ToolbarCanva from "./Toolbar/ToolbarCanva";
import { ToolbarContent } from "./Toolbar/ToolbarContent";

interface CanvaFramesProps {
  categories: Category[];
}

export default function CanvaFrames({ categories }: CanvaFramesProps) {
  const getFonts = useCallback(async (query: GetFontQuery) => {
    const query_str = qs.stringify(query, {
      skipNull: true,
      skipEmptyString: true,
    });
    return getAllTextFont(query_str).then((res) => res.items);
  }, []);

  const config = useMemo(
    () => ({
      assetPath: "/assets",
      frame: {
        defaultImage: {
          url: `/assets/images/frame-placeholder.png`,
          width: 1200,
          height: 800,
        },
      },
    }),
    []
  );

  const [menuContent, setMenuContent] = useState<
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
  >("template");

  return (
    <Editor config={config} getFonts={getFonts}>
      <div className="flex w-full h-full bg-backgroundColor-main">
        <ToolbarContent
          menuContent={menuContent}
          setMenuContent={setMenuContent}
        />

        <SidebarContent
          menuContent={menuContent}
          setMenuContent={setMenuContent}
          categories={categories}
        />

        <div
          style={{
            flexGrow: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <ToolbarCanva />
          <AppLayerSettings />
          <div
            style={{
              flexGrow: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <EditorContent />
          </div>

          <div
            style={{
              height: 40,
              background: "#fff",
              borderTop: "1px solid rgba(57,76,96,.15)",
              display: "grid",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <PageControl />
          </div>
        </div>
      </div>
    </Editor>
  );
}
