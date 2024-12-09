import DuplicateIcon from "@duyank/icons/external/Duplicate";
import LayersIcon from "@duyank/icons/external/Layers";
import AlignBottomIcon from "@duyank/icons/regular/AlignBottom";
import AlignCenterHorizontalIcon from "@duyank/icons/regular/AlignCenterHorizontal";
import AlignCenterVerticalIcon from "@duyank/icons/regular/AlignCenterVertical";
import AlignLeftIcon from "@duyank/icons/regular/AlignLeft";
import AlignRightIcon from "@duyank/icons/regular/AlignRight";
import AlignTopIcon from "@duyank/icons/regular/AlignTop";
import BoundingBoxIcon from "@duyank/icons/regular/BoundingBox";
import CaretCircleDoubleDownIcon from "@duyank/icons/regular/CaretCircleDoubleDown";
import CaretCircleDoubleUpIcon from "@duyank/icons/regular/CaretCircleDoubleUp";
import CaretCircleDownIcon from "@duyank/icons/regular/CaretCircleDown";
import CaretCircleUpIcon from "@duyank/icons/regular/CaretCircleUp";
import ClipboardIcon from "@duyank/icons/regular/Clipboard";
import CopyIcon from "@duyank/icons/regular/Copy";
import LockKeyIcon from "@duyank/icons/regular/LockKey";
import SelectionBackgroundIcon from "@duyank/icons/regular/SelectionBackground";
import SelectionForegroundIcon from "@duyank/icons/regular/SelectionForeground";
import ShapesIcon from "@duyank/icons/regular/Shapes";
import TrashIcon from "@duyank/icons/regular/Trash";
import XIcon from "@duyank/icons/regular/X";
import { getTransformStyle } from "@lidojs/design-core";
import { useForwardedRef } from "@lidojs/design-utils";
import { Check, Palette } from "@phosphor-icons/react";
import { cloneDeep } from "lodash";
import {
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useEditor, useSelectedLayers } from "../../../hooks";
import {
  isFrameLayer,
  isGroupLayer,
  isImageLayer,
  isSectionLayer,
  isVideoLayer,
} from "../../../ultils/layer/layers";
import { copy } from "../../../ultils/menu-actions/copy";
import { duplicate } from "../../../ultils/menu-actions/duplicate";
import { paste } from "../../../ultils/menu-actions/paste";
import { ImageLayerProps } from "../../ImageLayer";
import { RootLayerProps } from "../../RootLayer";
import { VideoLayerProps } from "../../VideoLayer";
import ContextMenuItem from "./ContextMenuItem";
import SubMenu from "./SubMenu";

const LayerContextMenu: ForwardRefRenderFunction<HTMLDivElement> = (_, ref) => {
  const { selectedLayerIds, selectedLayers } = useSelectedLayers();
  const menuRef = useForwardedRef<HTMLDivElement>(ref);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: -9999,
    y: -9999,
  });
  const { state, openMenu, actions, pageIndex, pageSize, rootLayer } =
    useEditor((state, query) => ({
      openMenu: state.openMenu,
      pageIndex: state.activePage,
      pageSize: query.getPageSize(),
      rootLayer:
        state.pages[state.activePage] &&
        state.pages[state.activePage].layers.ROOT,
    }));
  const imageLayer = selectedLayers.find((l) => l.data.type === "Image");
  const videoLayer = selectedLayers.find((l) => l.data.type === "Video");
  const handleCopy = async () => {
    await copy(state, { pageIndex, layerIds: selectedLayerIds });
    actions.hideContextMenu();
  };
  const handlePaste = useCallback(async () => {
    await paste({ actions });
    actions.hideContextMenu();
  }, [actions]);
  const handleDuplicate = () => {
    duplicate(state, { pageIndex, layerIds: selectedLayerIds, actions });
    actions.hideContextMenu();
  };
  const handleDelete = useCallback(() => {
    if (!selectedLayerIds.includes("ROOT")) {
      actions.deleteLayer(pageIndex, selectedLayerIds);
      actions.hideContextMenu();
    }
  }, [actions, pageIndex, selectedLayerIds]);
  const handleLock = () => {
    actions.lock(pageIndex, selectedLayerIds);
    actions.hideContextMenu();
  };
  const handleSetAsBackground = () => {
    if (imageLayer) {
      const ratio = pageSize.width / pageSize.height;
      const image = (imageLayer.data.props as ImageLayerProps).image;
      const imageRatio = image.boxSize.width / image.boxSize.height;
      const background = { ...cloneDeep(image), rotate: 0 };
      if (ratio > imageRatio) {
        background.boxSize.width = pageSize.width;
        background.boxSize.height = pageSize.width / imageRatio;
        background.position.y =
          (background.boxSize.height - pageSize.height) / -2;
        background.position.x = 0;
      } else {
        background.boxSize.height = pageSize.height;
        background.boxSize.width = pageSize.height * imageRatio;
        background.position.x =
          (background.boxSize.width - pageSize.width) / -2;
        background.position.y = 0;
      }
      actions.setProp<RootLayerProps>(pageIndex, "ROOT", {
        image: background,
        video: null,
      });
      actions.history.merge().deleteLayer(pageIndex, imageLayer.id);
    }
    actions.hideContextMenu();
  };

  const handleSetAsImageLayer = () => {
    if (rootLayer) {
      const rootProps = rootLayer.data.props as RootLayerProps;
      const image = rootProps.image;
      if (image) {
        const ratio = pageSize.width / pageSize.height;
        const imageRatio = image.boxSize.width / image.boxSize.height;
        const imageSize = { boxSize: { width: 0, height: 0 } };
        if (ratio < imageRatio) {
          imageSize.boxSize.width = pageSize.width * 0.8;
          imageSize.boxSize.height = imageSize.boxSize.width / imageRatio;
        } else {
          imageSize.boxSize.height = pageSize.height * 0.8;
          imageSize.boxSize.width = imageSize.boxSize.height * imageRatio;
        }
        actions.addImageLayer(
          { url: image.url, thumb: image.thumb },
          imageSize.boxSize
        );
        actions.history.merge().setProp<RootLayerProps>(pageIndex, "ROOT", {
          image: null,
        });
        actions.hideContextMenu();
      }
    }
  };

  const handleSetAsBackgroundVideo = () => {
    if (videoLayer) {
      const ratio = pageSize.width / pageSize.height;
      const video = (videoLayer.data.props as VideoLayerProps).video;
      const videoRatio = video.boxSize.width / video.boxSize.height;
      const background = { ...cloneDeep(video), rotate: 0 };
      if (ratio > videoRatio) {
        background.boxSize.width = pageSize.width;
        background.boxSize.height = pageSize.width / videoRatio;
        background.position.y =
          (background.boxSize.height - pageSize.height) / -2;
        background.position.x = 0;
      } else {
        background.boxSize.height = pageSize.height;
        background.boxSize.width = pageSize.height * videoRatio;
        background.position.x =
          (background.boxSize.width - pageSize.width) / -2;
        background.position.y = 0;
      }

      actions.setProp<RootLayerProps>(pageIndex, "ROOT", {
        video: background,
        image: null,
      });
      actions.history.merge().deleteLayer(pageIndex, videoLayer.id);
    }
    actions.hideContextMenu();
  };

  const handleSetAsVideoLayer = () => {
    if (rootLayer) {
      const rootProps = rootLayer.data.props as RootLayerProps;
      const video = rootProps.video;
      if (video) {
        const ratio = pageSize.width / pageSize.height;
        const videoRatio = video.boxSize.width / video.boxSize.height;
        const videoSize = { boxSize: { width: 0, height: 0 } };
        if (ratio < videoRatio) {
          videoSize.boxSize.width = pageSize.width * 0.8;
          videoSize.boxSize.height = videoSize.boxSize.width / videoRatio;
        } else {
          videoSize.boxSize.height = pageSize.height * 0.8;
          videoSize.boxSize.width = videoSize.boxSize.height * videoRatio;
        }
        actions.addVideoLayer({ url: video.url }, videoSize.boxSize);
        actions.history.merge().setProp<RootLayerProps>(pageIndex, "ROOT", {
          video: null,
        });
        actions.hideContextMenu();
      }
    }
  };
  const handleUsingMainColor = () => {
    actions.setUsingMainColor(selectedLayers[0].id);
    actions.hideContextMenu();
  };

  const handleDetachImage = () => {
    if (isFrameLayer(selectedLayers[0])) {
      const props = selectedLayers[0].data.props;
      const image = props.image;
      if (image) {
        const ratio = pageSize.width / pageSize.height;
        const imageRatio = image.boxSize.width / image.boxSize.height;
        const imageSize = { boxSize: { width: 0, height: 0 } };
        if (ratio < imageRatio) {
          imageSize.boxSize.width = pageSize.width * 0.8;
          imageSize.boxSize.height = imageSize.boxSize.width / imageRatio;
        } else {
          imageSize.boxSize.height = pageSize.height * 0.8;
          imageSize.boxSize.width = imageSize.boxSize.height * imageRatio;
        }
        actions.addImageLayer(
          { url: image.url, thumb: image.thumb },
          imageSize.boxSize
        );
        actions.history
          .merge()
          .setProp<RootLayerProps>(pageIndex, selectedLayers[0].id, {
            image: null,
          });
        actions.hideContextMenu();
      }
    }
  };

  const backwardDisabled =
    rootLayer?.data.child.findIndex((i) => selectedLayerIds.includes(i)) === 0;
  const forwardDisabled =
    rootLayer?.data.child.findLastIndex((i) => selectedLayerIds.includes(i)) ===
    (rootLayer?.data.child.length || 0) - 1;
  const handleForward = () => {
    if (!forwardDisabled) {
      actions.bringForward(pageIndex, selectedLayerIds);
      actions.hideContextMenu();
    }
  };
  const handleToFront = () => {
    if (!forwardDisabled) {
      actions.bringToFront(pageIndex, selectedLayerIds);
      actions.hideContextMenu();
    }
  };
  const handleBackward = () => {
    if (!backwardDisabled) {
      actions.sendBackward(pageIndex, selectedLayerIds);
      actions.hideContextMenu();
    }
  };
  const handleToBack = () => {
    if (!backwardDisabled) {
      actions.sendToBack(pageIndex, selectedLayerIds);
      actions.hideContextMenu();
    }
  };
  const handleShowLayers = () => {
    actions.setSidebar("LAYER_MANAGEMENT");
    actions.hideContextMenu();
  };

  const handleAlign = (
    alignment: "left" | "right" | "center" | "top" | "bottom" | "middle"
  ) => {
    actions.setAlign(alignment);
    actions.hideContextMenu();
  };
  const handleUngroup = () => {
    if (selectedLayerIds.length === 1) {
      actions.ungroup(selectedLayerIds[0]);
    }
    actions.hideContextMenu();
  };

  const handleGroup = () => {
    actions.group(selectedLayerIds);
    actions.hideContextMenu();
  };
  useEffect(() => {
    const update = () => {
      const contentRect = menuRef.current?.getBoundingClientRect() as DOMRect;

      const offset = {
        x: -9999,
        y: -9999,
      };
      if (openMenu) {
        offset.x = 0;
        offset.y = 0;
        if (contentRect.width + openMenu.clientX > window.innerWidth) {
          offset.x = -contentRect.width;
        }
        if (contentRect.height + openMenu.clientY > window.innerHeight) {
          offset.y = window.innerHeight - contentRect.height - openMenu.clientY;
        }
      }
      setOffset(offset);
    };
    update();
    const hideMenu = () => {
      actions.hideContextMenu();
    };
    window.addEventListener("resize", hideMenu);
    return () => {
      window.removeEventListener("resize", hideMenu);
    };
  }, [actions, menuRef, openMenu]);
  if (!openMenu) {
    return null;
  }
  const containerGroupLayer = !!selectedLayers.find((l) => isGroupLayer(l));
  return (
    <div
      ref={menuRef}
      className="max-[900px]:bottom-0 max-[900px]:top-auto max-[900px]:transform-none max-[900px]:flex max-[900px]:right-0 max-[900px]:p-0"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "white",
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 4,
        zIndex: 30,
        boxShadow: "0 0 0 1px rgba(64,87,109,.07),0 2px 12px rgba(53,71,90,.2)",
        transform: getTransformStyle({
          position: {
            x: openMenu.clientX + offset.x,
            y: openMenu.clientY + offset.y,
          },
        }),
      }}
    >
      <div
        className="max-[900px]:shrink max-[900px]:text-[24px] max-[900px]:w-[48px] max-[900px]:h-[48px] max-[900px]:rounded-[50%] max-[900px]:bg-[#EBECF0] max-[900px]:flex max-[900px]:items-center max-[900px]:justify-center max-[900px]:cursor-pointer max-[900px]:m-[16px]"
        style={{
          display: "none",
        }}
        onClick={() => actions.hideContextMenu()}
      >
        <XIcon />
      </div>
      <div className="max-[900px]:overflow-x-auto  max-[900px]:grow max-[900px]:p-[16px] max-[900px]:flex">
        {!selectedLayerIds.includes("ROOT") &&
          !(
            selectedLayerIds.length === 1 && isSectionLayer(selectedLayers[0])
          ) && (
            <ContextMenuItem
              icon={<CopyIcon />}
              name={"Copy"}
              shortcut={"Ctrl+C"}
              onClick={handleCopy}
            />
          )}
        {!selectedLayerIds.includes("ROOT") &&
          !(
            selectedLayerIds.length === 1 && isSectionLayer(selectedLayers[0])
          ) && (
            <Fragment>
              <ContextMenuItem
                icon={<ClipboardIcon />}
                name={"Paste"}
                shortcut={"Ctrl+V"}
                onClick={handlePaste}
              />
              <ContextMenuItem
                icon={<DuplicateIcon />}
                name={"Duplicate"}
                shortcut={"Ctrl+D"}
                onClick={handleDuplicate}
              />
              <ContextMenuItem
                icon={<TrashIcon />}
                name={"Delete"}
                shortcut={"Delete"}
                onClick={handleDelete}
              />
            </Fragment>
          )}

        {!selectedLayerIds.includes("ROOT") && (
          <Fragment>
            <div
              style={{
                marginTop: 8,
                marginBottom: 8,
                height: 1,
                borderBottom: "1px solid rgba(57,76,96,.15)",
                width: "100%",
              }}
            />
            <ContextMenuItem icon={<LayersIcon />} name={"Layer"}>
              <SubMenu
                transform={{
                  x: openMenu.clientX + offset.x,
                  y: openMenu.clientY + offset.y,
                }}
              >
                <ContextMenuItem
                  disabled={forwardDisabled}
                  icon={<CaretCircleUpIcon />}
                  name={"Bring Forward"}
                  shortcut={"Ctrl+]"}
                  onClick={handleForward}
                />
                <ContextMenuItem
                  disabled={forwardDisabled}
                  icon={<CaretCircleDoubleUpIcon />}
                  name={"Bring to Front"}
                  shortcut={"Ctrl+Alt+]"}
                  onClick={handleToFront}
                />
                <ContextMenuItem
                  disabled={backwardDisabled}
                  icon={<CaretCircleDownIcon />}
                  name={"Send Backward"}
                  shortcut={"Ctrl+["}
                  onClick={handleBackward}
                />
                <ContextMenuItem
                  disabled={backwardDisabled}
                  icon={<CaretCircleDoubleDownIcon />}
                  name={"Send to Back"}
                  shortcut={"Ctrl+Alt+["}
                  onClick={handleToBack}
                />
                <ContextMenuItem
                  icon={<LayersIcon />}
                  name={"Show Layers"}
                  onClick={handleShowLayers}
                />
              </SubMenu>
            </ContextMenuItem>
            <ContextMenuItem icon={<AlignLeftIcon />} name={"Align"}>
              <SubMenu
                transform={{
                  x: openMenu.clientX + offset.x,
                  y: openMenu.clientY + offset.y,
                }}
              >
                <ContextMenuItem
                  icon={<AlignLeftIcon />}
                  name={"Left"}
                  onClick={() => handleAlign("left")}
                />
                <ContextMenuItem
                  icon={<AlignCenterHorizontalIcon />}
                  name={"Center"}
                  onClick={() => handleAlign("center")}
                />
                <ContextMenuItem
                  icon={<AlignRightIcon />}
                  name={"Right"}
                  onClick={() => handleAlign("right")}
                />
                <ContextMenuItem
                  icon={<AlignTopIcon />}
                  name={"Top"}
                  onClick={() => handleAlign("top")}
                />
                <ContextMenuItem
                  icon={<AlignCenterVerticalIcon />}
                  name={"Middle"}
                  onClick={() => handleAlign("middle")}
                />
                <ContextMenuItem
                  icon={<AlignBottomIcon />}
                  name={"Bottom"}
                  onClick={() => handleAlign("bottom")}
                />
              </SubMenu>
            </ContextMenuItem>
            <div
              style={{
                marginTop: 8,
                marginBottom: 8,
                height: 1,
                borderBottom: "1px solid rgba(57,76,96,.15)",
                width: "100%",
              }}
            />
          </Fragment>
        )}

        {selectedLayerIds.length > 1 && (
          <ContextMenuItem
            icon={<BoundingBoxIcon />}
            name={"Group"}
            onClick={handleGroup}
          />
        )}
        {containerGroupLayer && (
          <ContextMenuItem
            icon={<ShapesIcon />}
            name={"Ungroup"}
            onClick={handleUngroup}
          />
        )}
        {!selectedLayerIds.includes("ROOT") && (
          <ContextMenuItem
            icon={<LockKeyIcon />}
            name={"Lock"}
            onClick={handleLock}
          />
        )}
        {selectedLayerIds.length === 1 &&
          !(
            isImageLayer(selectedLayers[0]) || isVideoLayer(selectedLayers[0])
          ) && (
            <div className="flex justify-between items-center">
              <ContextMenuItem
                icon={<Palette weight="light" />}
                name={"Main color"}
                onClick={handleUsingMainColor}
              />
              {(
                state.pages[state.activePage].layers[selectedLayerIds[0]].data
                  .props as any
              ).usingMainColor && <Check className="mr-4" weight="light" />}
            </div>
          )}
        {selectedLayerIds.length === 1 &&
          isFrameLayer(selectedLayers[0]) &&
          selectedLayers[0].data.props.image && (
            <ContextMenuItem
              icon={<SelectionBackgroundIcon />}
              name={"Detach Image"}
              onClick={handleDetachImage}
            />
          )}
        {videoLayer && selectedLayerIds.length === 1 && (
          <ContextMenuItem
            icon={<SelectionForegroundIcon />}
            name={"Set as Background Video"}
            onClick={handleSetAsBackgroundVideo}
          />
        )}
        {selectedLayerIds.length === 1 &&
          selectedLayerIds.includes("ROOT") &&
          (rootLayer?.data.props as RootLayerProps)?.video && (
            <ContextMenuItem
              icon={<SelectionBackgroundIcon />}
              name={"Set Background as Video Layer"}
              onClick={handleSetAsVideoLayer}
            />
          )}
        {imageLayer && selectedLayerIds.length === 1 && (
          <ContextMenuItem
            icon={<SelectionForegroundIcon />}
            name={"Set as Background Image"}
            onClick={handleSetAsBackground}
          />
        )}
        {selectedLayerIds.length === 1 &&
          selectedLayerIds.includes("ROOT") &&
          (rootLayer?.data.props as RootLayerProps)?.image && (
            <ContextMenuItem
              icon={<SelectionBackgroundIcon />}
              name={"Set Background as Image Layer"}
              onClick={handleSetAsImageLayer}
            />
          )}
      </div>
    </div>
  );
};

export default forwardRef<HTMLDivElement>(LayerContextMenu);
