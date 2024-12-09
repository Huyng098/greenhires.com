"use client";
import { PanelResizeHandle } from "@/components/Common/ResizablePanel";
import { Category } from "@/interfaces/general/category";
import { Editor, GetFontQuery } from "@/lib/design-editor";
import { getAllTextFont } from "@/services/canva";
import { useBuilderStore } from "@/stores/builder";
import qs from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PanelGroup } from "react-resizable-panels";
import PDFComponent from "./Panel/PDFComponent";
import ResumeComponents from "./Panel/ResumeComponents";
import { ToolbarPDF } from "./SidebarRight/toolbar";
import { fetchResumeById } from "@/services/resume/api";
import { getSampleById } from "@/services/sample/api";

export default function BuilderComponent({
  resizableLayout,
  categories,
  pathname,
}: {
  resizableLayout: number[];
  categories: Category[];
  pathname: string;
}) {
  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  };
  const [isLeftDragging, setIsLeftDragging] = useState(false);
  const { workspace } = useBuilderStore()();

  const getFonts = useCallback(async (query: GetFontQuery) => {
    const query_str = qs.stringify(query, {
      skipNull: true,
      skipEmptyString: true,
    });
    return getAllTextFont(query_str).then((res) => res.items);
  }, []);

  const handleTest = async () => {
    const resume = await getSampleById("cf70f300-5421-418b-a979-d123b65e79ad");
    console.log(resume);
  };
  useEffect(() => {
    handleTest();
  });

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

  return (
    <Editor config={config} getFonts={getFonts}>
      <PanelGroup
        direction="horizontal"
        onLayout={onLayout}
        style={{
          backgroundColor: "#f0f9ff",
        }}
      >
        {!workspace.order ? (
          <>
            <ResumeComponents
              categories={categories}
              resizableLayout={resizableLayout}
            />
            <PanelResizeHandle
              isDragging={isLeftDragging}
              onDragging={setIsLeftDragging}
            />
            <PDFComponent resizableLayout={resizableLayout} />
            <ToolbarPDF />
          </>
        ) : (
          <>
            <ToolbarPDF />
            <PDFComponent resizableLayout={resizableLayout} />
            <PanelResizeHandle
              isDragging={isLeftDragging}
              onDragging={setIsLeftDragging}
            />
            <ResumeComponents
              categories={categories}
              resizableLayout={resizableLayout}
            />
          </>
        )}
      </PanelGroup>
    </Editor>
  );
}
