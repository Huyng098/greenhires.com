import ArrowsClockwiseIcon from "@duyank/icons/regular/ArrowsClockwise";
import { usePathname } from "next/navigation";
import React, { FC, useCallback, useContext } from "react";
import { EditorContext } from "../editor/EditorContext";
import { useEditor, useSelectedLayers } from "../hooks";
import { isSectionLayer } from "../ultils/layer/layers";

interface ResizeHandlerProps {
  rotate: number;
  onRotateStart: (e: TouchEvent | MouseEvent) => void;
}

const RotateHandle: FC<ResizeHandlerProps> = ({ rotate, onRotateStart }) => {
  const { selectedLayerIds } = useSelectedLayers();
  const { actions, state, isRotating } = useEditor((state, query) => ({
    isGroup: state.selectedLayers[state.activePage].length > 1,
    isDragging: state.dragData.status,
    isResizing: state.resizeData.status,
    isRotating: state.rotateData.status,
    isUpdatingLine: state.updateLineData.status,
    controlBox: state.controlBox,
    pageSize: query.getPageSize(),
    isPageLocked: state.pages[state.activePage].layers.ROOT.data.locked,
    isOpenMenu: !!state.openMenu,
    scale: state.scale,
  }));
  const layers = state.pages[state.activePage].layers;
  const {
    config: { assetPath },
  } = useContext(EditorContext);
  const handleRotateStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.stopPropagation();
      onRotateStart(e.nativeEvent);
    },
    [onRotateStart]
  );
  const roundRotate = Math.round(rotate / 10);

  const handleAddNewItem = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    actions.addANewItem(selectedLayerIds[0]);
  };
  const pathname = usePathname();
  return (
    <div
      style={{
        bottom: rotate < 230 && rotate > 130 ? "50%" : -65,
        position: "absolute",
        left: rotate < 230 && rotate > 130 ? `calc(100% + 48px)` : "50%",
        transform:
          rotate < 230 && rotate > 130 ? "translateY(50%)" : "translateX(-50%)",
        pointerEvents: "auto",
        display: isRotating ? "none" : "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {selectedLayerIds.length === 1 &&
        isSectionLayer(layers[selectedLayerIds[0]]) &&
        !(
          selectedLayerIds[0].includes("sections.aboutme") ||
          selectedLayerIds[0].includes("sections.basics")
        ) &&
        !pathname.includes("resume") && (
          <div
            className="hover:bg-[rgba(64,87,109,.07)]"
            style={{
              lineHeight: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              fontSize: 12,
              border: "1px solid #828282a6",
              color: "#828282a6",
              padding: "0 8px",
              fontWeight: 500,
              backgroundColor: "white",
              width: "126px",
              borderRadius: "3px",
            }}
            onMouseDown={(e) => handleAddNewItem(e)}
          >
            + Add a new item
          </div>
        )}
      <div>
        <div
          style={{
            background: "white",
            boxShadow:
              "0 0 4px 1px rgba(57,76,96,.15), 0 0 0 1px rgba(43,59,74,.3)",
            width: 24,
            height: 24,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            color: "#0d1216",
            cursor: `url('${assetPath}/cursors/rotate/${roundRotate === 36 ? 0 : roundRotate}.png') 12 12, auto`,
          }}
          onMouseDown={handleRotateStart}
          onTouchStart={handleRotateStart}
        >
          <ArrowsClockwiseIcon />
        </div>
      </div>
      {isRotating && (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 36,
            whiteSpace: "nowrap",
            background: "#1E1E2D",
            padding: "3px 8px",
            borderRadius: 4,
            textAlign: "center",
            color: "white",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {Math.round(rotate)}°
        </div>
      )}
    </div>
  );
};

export default RotateHandle;
