"use client";
import { useCallback, useRef, useState } from "react";

import useDevices from "@/lib/hooks/useDevices";
import PreviewModal from "@/modules/Canva/Editor/PreviewModal";
import { Panel } from "react-resizable-panels";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PAGE_GAP, PAGE_HEIGHT } from "@/constants/general";
import { useEditor } from "@/lib/design-editor";
import PageControlLiveEdit from "@/lib/design-editor/settings/PageControlLiveEdit";
import { useAuthStore } from "@/stores/auth";
import classNames from "classnames";
import AppLayerSettingsLiveEdit from "./AppLayerSettingsLiveEdit";
import EditorContentLiveEdit from "./EditorContentLiveEdit";

export default function PDFComponent({
  resizableLayout,
}: {
  resizableLayout: number[];
}) {
  const [openPreview, setOpenPreview] = useState(false);
  const { isDesktop } = useDevices();
  const theme = useAuthStore()((state) => state.user?.theme);
  const { actions, scale, activePage } = useEditor((state) => ({
    activePage: state.activePage,
    totalPages: state.pages.length,
    scale: state.scale,
  }));
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = event.currentTarget;

      let estimatedPage = scrollTop / (PAGE_HEIGHT * scale + PAGE_GAP);
      let normalizedPage = estimatedPage - Math.floor(estimatedPage);
      if (normalizedPage > 0.6) {
        estimatedPage = Math.ceil(estimatedPage);
      } else {
        estimatedPage = Math.floor(estimatedPage);
      }

      if (estimatedPage !== activePage) {
        actions.setActivePage(estimatedPage);
      }
    },
    [activePage, scale]
  );

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const clickToPage = useCallback(
    (page: number) => {
      if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTo({
          top: (PAGE_HEIGHT * scale + PAGE_GAP) * page,
          behavior: "smooth",
        });
      }
    },
    [scale, scrollViewportRef]
  );
  
  return (
    <Panel
      className={`h-full ${!isDesktop && "hidden"}`}
      defaultSize={resizableLayout[1]}
      minSize={55}
    >
      <div className="flex h-full w-full">
        <div
          style={{
            flexGrow: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          {openPreview && (
            <PreviewModal onClose={() => setOpenPreview(false)} />
          )}
          <AppLayerSettingsLiveEdit />
          <ScrollArea
            ref={scrollViewportRef}
            onScroll={handleScroll}
            className={classNames(
              "flex flex-1",
              theme ? `${theme}` : "bg-slate-400 shadow"
            )}
          >
            <EditorContentLiveEdit />

            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <div
            style={{
              height: 40,
              alignItems: "center",
            }}
          >
            <PageControlLiveEdit
              clickToPage={clickToPage}
              openPreview={() => setOpenPreview(true)}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}
