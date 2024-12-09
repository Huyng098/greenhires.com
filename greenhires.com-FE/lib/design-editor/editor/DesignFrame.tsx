"use client";

import { useUpdateResumeRealtime } from "@/services/resume/query";
import { useResumeStore } from "@/stores/resume";
import { SavingContext } from "@/stores/saving";
import SquaresFourBoldIcon from "@duyank/icons/bold/SquaresFourBold";
import PlusIcon from "@duyank/icons/regular/Plus";
import {
  getTransformStyle,
  isElementInViewport,
  isPointInsideBox,
  rectangleInsideAnother,
  SerializedPage,
  visualCorners,
} from "@lidojs/design-core";
import { GlobalStyle } from "@lidojs/design-layers";
import { getPosition, isMouseEvent, isTouchEvent } from "@lidojs/design-utils";
import { debounce } from "lodash";
import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { isMobile } from "react-device-detect";
import { useEditor, useSelectedLayers } from "../hooks";
import useClickOutside from "../hooks/useClickOutside";
import { useDragLayer } from "../hooks/useDragLayer";
import { useSelectLayer } from "../hooks/useSelectLayer";
import useShortcut from "../hooks/useShortcut";
import { useTrackingShiftKey } from "../hooks/useTrackingShiftKey";
import { useZoomPage } from "../hooks/useZoomPage";
import LayerContextMenu from "../layers/core/context-menu/LayerContextMenu";
import SelectionBox from "../layers/core/SelectionBox";
import { useUsedFont } from "../layers/hooks/useUsedFont";
import PageSettings from "../settings/PageSettings";
import { Page } from "../types";
import DesignPage from "./DesignPage";
import { EditorContext } from "./EditorContext";
import { usePathname } from "next/navigation";

interface DesignFrameProps {
  data: SerializedPage[];
}

const DesignFrame: FC<DesignFrameProps> = ({ data }) => {
  const shiftKeyRef = useTrackingShiftKey();
  const frameRef = useRef<HTMLDivElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement[]>([]);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const { usedFonts } = useUsedFont();
  const {
    config: { assetPath },
  } = useContext(EditorContext);
  const [showPageSettings, setShowPageSettings] = useState(false);
  useShortcut(frameRef.current);
  const {
    state,
    query,
    actions,
    scale,
    pages,
    hoveredPage,
    hoveredLayer,
    selectStatus,
    rotateData,
    resizeData,
    controlBox,
    activePage,
    dragData,
    imageEditor,
    pageSize,
  } = useEditor((state, query) => {
    const hoveredPage = parseInt(Object.keys(state.hoveredLayer)[0]);
    const hoverLayerId = state.hoveredLayer[hoveredPage];
    return {
      scale: state.scale,
      pages: state.pages,
      hoveredPage,
      hoveredLayer: hoverLayerId
        ? state.pages[hoveredPage].layers[hoverLayerId]
        : null,
      selectStatus: state.selectData.status,
      rotateData: state.rotateData,
      resizeData: state.resizeData,
      controlBox: state.controlBox,
      activePage: state.activePage,
      dragData: state.dragData,
      imageEditor: state.imageEditor,
      pageSize: query.getPageSize(),
    };
  });
  const {
    pageTransform,
    onZoomStart,
    onZoomMove,
    onZoomEnd,
    onMoveStart,
    onMove,
    onMoveEnd,
    onMovePage,
    onMovePageEnd,
  } = useZoomPage(frameRef, pageRef, pageContainerRef);
  useEffect(() => {
    actions.setData(data);
  }, [data, actions]);

  useClickOutside(
    contextMenuRef,
    () => {
      actions.hideContextMenu();
    },
    "mousedown",
    { capture: true }
  );
  const boxRef = useRef<HTMLDivElement>(null);
  const { selectedLayerIds } = useSelectedLayers();
  const handleScroll = () => {
    if (!dragData.status && !selectStatus) {
      const viewport = frameRef.current as HTMLDivElement;
      //change active page
      if (
        pageRef.current[activePage] &&
        !isElementInViewport(viewport, pageRef.current[activePage])
      ) {
        pageRef.current.some((page, pageIndex) => {
          if (isElementInViewport(viewport, page)) {
            actions.selectLayers(pageIndex, "ROOT");
            return true;
          }
          return false;
        });
      }
    }
  };

  const { tmpSelected, onSelectStart } = useSelectLayer({
    frameRef: frameRef,
    pageListRef: pageRef,
    selectionBoxRef: boxRef,
  });

  const { onDragStart } = useDragLayer({
    frameRef,
    pageListRef: pageRef,
  });

  const handMouseDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (
        (isMouseEvent(e) && e.button === 2) ||
        imageEditor ||
        (isTouchEvent(e) && e.touches.length > 1)
      ) {
        return;
      }
      const isClickPage = pageRef.current.find((page) =>
        page.contains(e.target as Node)
      );
      const isClickOutPage = pageRef.current.find((page) =>
        (e.target as Node).contains(page)
      );
      const { clientX, clientY } = getPosition(e);
      if (!isClickPage && !isClickOutPage) {
        return;
      }

      let isInsideControlBox = false;
      if (controlBox) {
        const matrix = new WebKitCSSMatrix(
          getTransformStyle({
            rotate: controlBox.rotate,
          })
        );
        const rect = pageRef.current[activePage].getBoundingClientRect();
        actions.setPageDOMRect(rect);
        const controlBoxCorner = visualCorners(
          {
            width: controlBox.boxSize.width * scale,
            height: controlBox.boxSize.height * scale,
          },
          matrix,
          {
            x: rect.x + controlBox.position.x * scale,
            y: rect.y + controlBox.position.y * scale,
          }
        );
        isInsideControlBox = isPointInsideBox(
          { x: clientX, y: clientY },
          controlBoxCorner
        );
      }
      if (
        hoveredLayer &&
        hoveredLayer.id !== "ROOT" &&
        !selectedLayerIds.includes(hoveredLayer.id)
      ) {
        if (
          !isInsideControlBox ||
          (controlBox &&
            rectangleInsideAnother(hoveredLayer.data.props, controlBox))
        ) {
          actions.selectLayers(
            hoveredPage,
            hoveredLayer.id,
            shiftKeyRef.current ? "add" : "replace"
          );
        }
      }
      if (
        (hoveredLayer &&
          hoveredLayer.id !== "ROOT" &&
          !hoveredLayer.data.locked) ||
        isInsideControlBox
      ) {
        onDragStart(e);
        e.stopPropagation();
      } else if (isMouseEvent(e)) {
        onSelectStart(e);
        e.stopPropagation();
      } else if (isTouchEvent(e)) {
        onMoveStart(e);
      }
    },
    [hoveredLayer, controlBox, selectedLayerIds, dragData]
  );

  const cursorCSS = () => {
    if (rotateData.status) {
      const cursor = Math.round((rotateData.rotate || 0) / 10);
      return {
        cursor: `url('${assetPath}/cursors/rotate/${
          cursor === 36 ? 0 : cursor
        }.png') 12 12, auto`,
      };
    } else if (resizeData.status) {
      const rd = {
        bottomLeft: 45,
        left: 90,
        topLeft: 135,
        top: 180,
        topRight: 225,
        right: 270,
        bottomRight: 315,
        bottom: 0,
      };
      const rotate =
        (resizeData.rotate || 0) + rd[resizeData.direction || "bottom"] + 90;
      const file = Math.round((rotate % 180) / 10);
      return {
        cursor: `url('${assetPath}/cursors/resize/${file}.png') 12 12, auto`,
      };
    } else if (dragData.status) {
      return {
        cursor: "move",
      };
    }
    return {};
  };
  const resume_id = useResumeStore()((state) => state.resume.id);
  const { setSaving } = useContext(SavingContext);
  const { updateResumeRealtime } = useUpdateResumeRealtime();
  const debouncedApiCall = useCallback(
    debounce(
      () =>
        updateResumeRealtime({
          id: resume_id,
          resume_canva: query.serialize(),
        }),
      5000
    ),
    []
  );
  useEffect(() => {
    setSaving(true);
    debouncedApiCall();
  }, [state.pages[state.activePage]]);
  return (
    <Fragment>
      <div
        ref={frameRef}
        className="relative flex h-full overflow-auto"
        style={{
          ...cursorCSS(),
        }}
        tabIndex={0}
        onScroll={() => {
          handleScroll();
        }}
        onTouchEnd={onZoomEnd}
        onTouchMove={onZoomMove}
        onTouchStart={onZoomStart}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            minWidth: "100%",
            minHeight: "100%",
          }}
          onMouseDown={(e) => handMouseDown(e.nativeEvent)}
          onTouchStart={(e) => handMouseDown(e.nativeEvent)}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexGrow: 1,
              touchAction: "pinch-zoom",
            }}
          >
            <div
              ref={pageContainerRef}
              className="max-[900px]:transition-transform max-[900px]:ease-linear max-[900px]:duration-250 max-[900px]:delay-0"
              style={{
                display: "flex",
                position: "relative",
                flexDirection: "row",
                justifyContent: "center",
                margin: "auto",
                transform: `translateX(-${
                  isMobile ? window.innerWidth * activePage : 0
                }px)`,
              }}
            >
              <div
                className="max-[900px]:flex max-[900px]:ml-0]"
                style={{
                  marginLeft: 56,
                }}
                onTouchEnd={() => {
                  onMoveEnd();
                  onMovePageEnd();
                }}
                onTouchMove={(e) => {
                  onMove(e);
                  onMovePage(e);
                }}
              >
                <GlobalStyle fonts={usedFonts} mode={"editor"} />
                {pages.map((page: Page, index: number) => (
                  <div
                    key={index}
                    className={`max-[900px]:px-[16px] max-[900px]:w-[${window.innerWidth}px] max-[900px]:h-[${window.innerHeight}px] max-[900px]:overflow-hidden`}
                  >
                    <DesignPage
                      ref={(el) => {
                        if (el) {
                          pageRef.current[index] = el;
                        }
                      }}
                      height={pageSize.height}
                      pageIndex={index}
                      transform={pageTransform}
                      width={pageSize.width}
                    />
                  </div>
                ))}
                <div
                  className="max-[900px]:hidden"
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    background: "rgba(64,87,109,.07)",
                    color: "#0d1216",
                    width: pageSize.width * scale,
                    textAlign: "center",
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderRadius: 8,
                  }}
                  onClick={() => {
                    actions.addPage();
                  }}
                >
                  Add Page
                </div>
              </div>
              <div
                className="max-[900px]:w-0"
                style={{
                  width: 56,
                  pointerEvents: "none",
                }}
              />
            </div>
            <LayerContextMenu ref={contextMenuRef} />
            {selectStatus && (
              <SelectionBox
                ref={boxRef}
                selectedLayers={tmpSelected?.selectedLayers}
              />
            )}
          </div>
        </div>
        <div
          className="max-[900px]:pointer-events-auto max-[900px]:flex max-[900px]:absolute max-[900px]:bottom-[24px] max-[900px]:left-[24px] max-[900px]:bg-[#3d8eff] max-[900px]:w-[48px] max-[900px]:h-[48px] max-[900px]:items-center max-[900px]:justify-center max-[900px]:rounded-[50%] text-[#fff] max-[900px]:text-[24px]"
          style={{
            display: "none",
          }}
          onClick={() => {
            actions.addPage();
          }}
        >
          <PlusIcon />
        </div>
        <div
          className="max-[900px]:pointer-events-auto max-[900px]:flex max-[900px]:absolute max-[900px]:bottom-[24px] max-[900px]:left-[24px] max-[900px]:bg-[#3d8eff] max-[900px]:w-[48px] max-[900px]:h-[48px] max-[900px]:items-center max-[900px]:justify-center max-[900px]:rounded-[50%] text-[#fff] max-[900px]:text-[24px] shadow-[0_0_0_1px_rgba(64,87,109,.07),0_2px_12px_rgba(53,71,90,.2)]"
          style={{
            display: "none",
          }}
          onClick={() => {
            setShowPageSettings(true);
          }}
        >
          <SquaresFourBoldIcon />
        </div>
      </div>
      {resizeData.status && (
        <div
          style={{
            position: "fixed",
            top: `${(resizeData.cursor?.clientY || 0) + 36}px`,
            left: `${(resizeData.cursor?.clientX || 0) + 60}px`,
            whiteSpace: "nowrap",
            background: "#3a3a4c",
            padding: "3px 8px",
            borderRadius: 4,
            textAlign: "center",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          w: {Math.round(resizeData.boxSize?.width || 0)} h:{" "}
          {Math.round(resizeData.boxSize?.height || 0)}
        </div>
      )}
      {showPageSettings && (
        <PageSettings onClose={() => setShowPageSettings(false)} />
      )}
    </Fragment>
  );
};

export default DesignFrame;
