import DuplicateIcon from "@duyank/icons/external/Duplicate";
import CaretDownIcon from "@duyank/icons/regular/CaretDown";
import CaretUpIcon from "@duyank/icons/regular/CaretUp";
import DownloadIcon from "@duyank/icons/regular/Download";
import FilePlusIcon from "@duyank/icons/regular/FilePlus";
import LockKeyIcon from "@duyank/icons/regular/LockKey";
import LockKeyOpenIcon from "@duyank/icons/regular/LockKeyOpen";
import TrashIcon from "@duyank/icons/regular/Trash";
import {
  autoCorrectDegree,
  boundingRect,
  BoxData,
  Direction,
  getControlBoxSizeFromLayers,
  getImageSize,
  getTransformStyle,
  getVideoSize,
  getVirtualDomHeight,
  isPointInsideBox,
  LayerComponentProps,
  LayerId,
  RotateCallbackData,
  useDragLine,
  useResizeLayer,
  useRotateLayer,
  visualCorners,
} from "@lidojs/design-core";

import { toPng } from "html-to-image";
// @ts-ignore
import { cn } from "@/lib/utils";
import { useUploadCanva } from "@/services/user";
import {
  getPosition,
  mergeWithoutArray,
  useLinkedRef,
} from "@lidojs/design-utils";
import { FileUpload } from "@mui/icons-material";
import { cloneDeep } from "lodash";
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  useEffect,
  useRef,
} from "react";
import Dropzone from "react-dropzone";
import ImageEditor from "../common/image-editor/ImageEditor";
import TextEditor from "../common/text-editor/TextEditor";
import ControlBox from "../control-layer/ControlBox";
import Guideline from "../control-layer/Guideline";
import LineControl from "../control-layer/LineControl";
import Toolbar from "../control-layer/Toolbar";
import { useEditor, useSelectedLayers } from "../hooks";
import { ImageLayerProps, VideoLayerProps } from "../layers";
import LayerBorderBox from "../layers/core/LayerBorderBox";
import PageProvider from "../layers/core/PageContext";
import PageElement from "../layers/core/PageElement";
import { useDisabledFeatures } from "../layers/hooks/useDisabledFeatures";
import { LayerDataRef } from "../types";
import {
  isGroupLayer,
  isImageLayer,
  isSectionLayer,
  isShapeLayer,
  isTextLayer,
  isVideoLayer,
} from "../ultils/layer/layers";
import { getShapeTextSize } from "@/lib/design-layers/layers/shape-text";
import { ShapeLayerProps } from "@/lib/design-screen/layers/ShapeLayer";

export interface PageProps {
  pageIndex: number;
  width: number;
  height: number;
  transform: {
    x: number;
    y: number;
    scale: number;
  };
}

const DesignPage: ForwardRefRenderFunction<HTMLDivElement, PageProps> = (
  { pageIndex, width, height, transform },
  ref
) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const [controlBoxRef] = useLinkedRef<HTMLDivElement>(null);
  const layerBorderRef = useRef<Record<LayerId, HTMLDivElement>>({});
  const [controlBoxData, getControlBoxData, setControlBoxData] =
    useLinkedRef<BoxData>();
  const [layerData, getLayerData, setLayerData] = useLinkedRef<LayerDataRef>(
    {}
  );
  const { selectedLayerIds, selectedLayers } = useSelectedLayers();
  const disabled = useDisabledFeatures();

  const {
    actions,
    hoveredLayer,
    scale,
    activePage,
    controlBox,
    imageEditor,
    textEditor,
    totalPages,
    isLocked,
    state,
  } = useEditor((state) => {
    const hoverLayerId = state.hoveredLayer[pageIndex];
    return {
      activePage: state.activePage,
      controlBox: state.controlBox,
      scale: state.scale,
      isLocked:
        state.pages[pageIndex] &&
        state.pages[pageIndex].layers.ROOT.data.locked,
      hoveredLayer: hoverLayerId
        ? state.pages[pageIndex].layers[hoverLayerId]
        : null,
      selectStatus: state.selectData.status,
      imageEditor: state.imageEditor,
      textEditor: state.textEditor,
      totalPages: state.pages.length,
    };
  });

  const { uploadImageRQ } = useUploadCanva();

  const openContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hoveredLayer && hoveredLayer.data.locked) {
      return;
    }
    if (controlBox && pageRef.current && hoveredLayer) {
      const matrix = new WebKitCSSMatrix(
        getTransformStyle({
          rotate: controlBox.rotate,
        })
      );
      const rect = pageRef.current.getBoundingClientRect();
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
      if (!isPointInsideBox({ x: e.clientX, y: e.clientY }, controlBoxCorner)) {
        actions.selectLayers(pageIndex, hoveredLayer.id);
      }
    } else if (hoveredLayer) {
      actions.selectLayers(pageIndex, hoveredLayer.id);
    }
    actions.showContextMenu(getPosition(e.nativeEvent));
  };

  useEffect(() => {
    if (controlBoxData.current) {
      setControlBoxData({
        boxSize: {
          width: controlBoxData.current.boxSize.width * scale,
          height: controlBoxData.current.boxSize.height * scale,
        },
        position: {
          x: controlBoxData.current.position.x * scale,
          y: controlBoxData.current.position.y * scale,
        },
        rotate: controlBoxData.current.rotate,
        scale: controlBoxData.current.scale,
      });
    }
    if (layerData.current) {
      Object.entries(layerData.current).forEach(([layerId, layer]) => {
        if (layer.centerX) {
          layerData.current[layerId].centerX = layer.centerX * scale;
        }
        if (layer.centerY) {
          layerData.current[layerId].centerY = layer.centerY * scale;
        }
        layerData.current[layerId].position.x = layer.position.x * scale;
        layerData.current[layerId].position.y = layer.position.y * scale;
        layerData.current[layerId].boxSize.width = layer.boxSize.width * scale;
        layerData.current[layerId].boxSize.height =
          layer.boxSize.height * scale;
      });
    }
  }, [controlBoxData, layerData, scale, setControlBoxData]);

  const handleAutoGrow = (direction: Direction, data: BoxData) => {
    if (
      disabled.scalable ||
      !["top", "left", "right", "bottom"].includes(direction) ||
      selectedLayerIds.length > 1 ||
      !isTextLayer(selectedLayers[0])
    ) {
      return data;
    } else {
      const { clientHeight } = getVirtualDomHeight(
        selectedLayers[0].data.editor?.dom as Element,
        data.boxSize.width,
        data.scale || 1
      );
      return mergeWithoutArray(data, {
        boxSize: { height: clientHeight },
      });
    }
  };
  const newLayerData = (change: BoxData) => {
    const layerData = getLayerData();
    const oldData = getControlBoxData() as BoxData;
    const ratio = change.boxSize.width / oldData.boxSize.width;
    const response: Record<LayerId, BoxData> = {};
    selectedLayers.forEach(({ id }) => {
      const layer = layerData[id];
      const newSize = {
        width: layer.boxSize.width * ratio,
        height: layer.boxSize.height * ratio,
      };
      response[id] = {
        position: {
          x:
            oldData.position.x -
            (oldData.position.x - layer.position.x) * ratio +
            (change.position.x - oldData.position.x),
          y:
            oldData.position.y -
            (oldData.position.y - layer.position.y) * ratio +
            (change.position.y - oldData.position.y),
        },
        boxSize: newSize,
        scale:
          typeof layer.scale !== "undefined" ? layer.scale * ratio : undefined,
        rotate: layer.rotate,
      };
    });
    return response;
  };

  const convertBoxSizeToLayerSize = (
    direction: Direction,
    useShift: boolean,
    data: BoxData
  ) => {
    if (selectedLayerIds.length === 1) {
      return {
        layers: {
          [selectedLayerIds[0]]: data,
        },
        lockAspect:
          (!useShift &&
            !["top", "left", "right", "bottom"].includes(direction) &&
            (isImageLayer(selectedLayers[0]) ||
              isVideoLayer(selectedLayers[0]))) ||
          (useShift &&
            (!isImageLayer(selectedLayers[0]) ||
              !isVideoLayer(selectedLayers[0]))),
      };
    } else {
      return {
        layers: newLayerData(data),
        lockAspect: true,
      };
    }
  };

  const handleResize = (
    direction: Direction,
    useShift: boolean,
    data: BoxData
  ) => {
    const normalizeSize = handleAutoGrow(direction, data);
    const resizeData = convertBoxSizeToLayerSize(
      direction,
      useShift,
      normalizeSize
    );
    actions.setControlBox(normalizeSize);
    Object.entries(resizeData.layers).forEach(([layerId, newSize]) => {
      const l = selectedLayers.find((l) => l.id === layerId);
      if (l) {
        if (isImageLayer(l)) {
          const changeX = newSize.boxSize.width - l.data.props.boxSize.width;
          const changeY = newSize.boxSize.height - l.data.props.boxSize.height;
          const props = l.data.props;
          if (!resizeData.lockAspect) {
            const imageSize = getImageSize(props, props.image, direction, {
              width: changeX,
              height: changeY,
            });
            actions.history.merge().setProp(pageIndex, layerId, {
              ...imageSize,
              position: {
                x: newSize.position.x,
                y: newSize.position.y,
              },
            });
          } else {
            const ratio = newSize.boxSize.width / l.data.props.boxSize.width;
            actions.history
              .merge()
              .setProp<ImageLayerProps>(pageIndex, layerId, {
                ...newSize,
                image: {
                  boxSize: {
                    width: l.data.props.image.boxSize.width * ratio,
                    height: l.data.props.image.boxSize.height * ratio,
                  },
                  position: {
                    x: l.data.props.image.position.x * ratio,
                    y: l.data.props.image.position.y * ratio,
                  },
                  rotate: 0,
                },
              });
          }
        } else if (isVideoLayer(l)) {
          const changeX = newSize.boxSize.width - l.data.props.boxSize.width;
          const changeY = newSize.boxSize.height - l.data.props.boxSize.height;
          const props = l.data.props;
          if (!resizeData.lockAspect) {
            const videoSize = getVideoSize(props, props.video, direction, {
              width: changeX,
              height: changeY,
            });
            actions.history.merge().setProp(pageIndex, layerId, {
              ...videoSize,
              position: {
                x: newSize.position.x,
                y: newSize.position.y,
              },
            });
          } else {
            const ratio = newSize.boxSize.width / l.data.props.boxSize.width;
            actions.history
              .merge()
              .setProp<VideoLayerProps>(pageIndex, layerId, {
                ...newSize,
                video: {
                  boxSize: {
                    width: l.data.props.video.boxSize.width * ratio,
                    height: l.data.props.video.boxSize.height * ratio,
                  },
                  position: {
                    x: l.data.props.video.position.x * ratio,
                    y: l.data.props.video.position.y * ratio,
                  },
                  rotate: 0,
                },
              });
          }
        } else if (
          (direction === "left" || direction === "right") &&
          (isSectionLayer(l) || isGroupLayer(l))
        ) {
          console.log("isLayer: ", l);
          const dwidth = newSize.boxSize.width - l.data.props.boxSize.width;
          l.data.child.forEach((childId) => {
            const child = state.pages[pageIndex].layers[childId];
            console.log("Tại sao: ", child);
            if (isTextLayer(child)) {
              const { clientHeight } = getVirtualDomHeight(
                child.data.editor?.dom as Element,
                data.boxSize.width,
                data.scale || 1
              );
              console.log("Hello: ", clientHeight);
            }
            const childProps = child.data.props;
            actions.history.merge().setProp(pageIndex, childId, {
              ...childProps,
              boxSize: {
                height: childProps.boxSize.height,
                width: childProps.boxSize.width + dwidth,
              },
            });
          });
          actions.history.merge().setProp(pageIndex, layerId, newSize);
        } else if (isShapeLayer(l)) {
          const {
            width: textWidth,
            height: textHeight,
            x: textPosX,
            y: textPosY,
          } = getShapeTextSize(l.data.props.shape, {
            width: newSize.boxSize.width,
            height: newSize.boxSize.height,
          });
          actions.history.merge().setProp<ShapeLayerProps>(pageIndex, layerId, {
            ...newSize,
            textWidth,
            textHeight,
            textPosX,
            textPosY,
          });
          actions.setTextEditorSize(textWidth, textHeight, textPosX, textPosY);
        } else {
          actions.history.merge().setProp(pageIndex, layerId, newSize);
        }
      }
    });
  };

  const { startResizing } = useResizeLayer({
    options: {
      scalable: !disabled.scalable,
    },
    frameScale: scale,
    getLayerData,
    controlBox,
    getControlBoxData,
    lockAspect: (data) => {
      const isSelectedImage =
        selectedLayers.length === 1 && isImageLayer(selectedLayers[0]);
      const isSelectedVideo =
        selectedLayers.length === 1 && isVideoLayer(selectedLayers[0]);
      return (
        (data.shiftKey && !isSelectedImage && !isSelectedVideo) ||
        selectedLayerIds.length > 1 ||
        ((isSelectedImage || isSelectedVideo) &&
          !data.shiftKey &&
          !["top", "left", "right", "bottom"].includes(data.direction))
      );
    },
    onResizeStart: (e, { direction }) => {
      const { clientX, clientY } = getPosition(e);
      actions.setResizeData(
        true,
        selectedLayerIds,
        direction,
        controlBox?.rotate,
        controlBox?.boxSize,
        {
          clientX,
          clientY,
        }
      );
      setControlBoxData(controlBox!);
      const layers: LayerDataRef = {};
      selectedLayers.forEach(
        ({
          id,
          data: {
            props: { boxSize, position, rotate, scale },
            type,
          },
        }) => {
          layers[id] = cloneDeep({
            boxSize,
            position,
            rotate,
            scale,
            type,
          });
        }
      );
      setLayerData(layers);
      actions.history.new();
    },
    onResize: (e, { direction, useShift }, data) => {
      const { clientX, clientY } = getPosition(e);
      actions.setResizeData(
        true,
        selectedLayerIds,
        direction,
        data.rotate,
        data.boxSize,
        {
          clientX,
          clientY,
        }
      );
      handleResize(direction, useShift, data);
    },
    onResizeStop: (_, { direction, useShift }, data) => {
      actions.setResizeData(false);
      handleResize(direction, useShift, data);
    },
  });
  const { startUpdating: startChangeLine } = useDragLine({
    getLayerData,
    frameScale: scale,
    pageOffset: {
      x: pageRef.current?.getBoundingClientRect().x || 0,
      y: pageRef.current?.getBoundingClientRect().y || 0,
    },
    onDragStart: (_, linePosition) => {
      const layers: LayerDataRef = {};
      selectedLayers.forEach(
        ({
          id,
          data: {
            props: { boxSize, position, rotate, scale },
            type,
          },
        }) => {
          layers[id] = cloneDeep({
            boxSize,
            position,
            rotate,
            scale,
            type,
          });
          actions.setUpdateLineData(true, id, linePosition);
          actions.setControlBox({
            boxSize,
            position,
            rotate,
            scale,
          });
        }
      );
      setLayerData(layers);
      actions.history.new();
    },
    onDrag: (_, __, data) => {
      actions.setProp(activePage, selectedLayers[0].id, data);
      actions.setControlBox(data);
    },
    onDragStop: (_, __, data) => {
      actions.setProp(activePage, selectedLayers[0].id, data);
      actions.setControlBox(data);
      actions.setUpdateLineData(false);
    },
  });
  useEffect(() => {
    const layerRecords = selectedLayers
      .filter((layer) => layer.id !== "ROOT")
      .reduce(
        (acc, layer) => {
          acc[layer.id] = layer.data.props;
          return acc;
        },
        {} as Record<LayerId, LayerComponentProps>
      );

    actions.setControlBox(getControlBoxSizeFromLayers(layerRecords));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedLayerIds), scale]);

  const handleRotate = (
    rotate: number,
    { controlBox, layers }: RotateCallbackData
  ) => {
    actions.setRotateData(true, rotate);
    actions.setControlBox(controlBox);
    Object.entries(layers).forEach(([layerId, data]) => {
      actions.history.merge().setProp(pageIndex, layerId, data);
    });
  };
  const handleRotateEnd = (
    rotate: number,
    { controlBox, layers }: RotateCallbackData
  ) => {
    actions.setRotateData(false);
    actions.setControlBox(controlBox);
    Object.entries(layers).forEach(([layerId, data]) => {
      actions.history.merge().setProp(pageIndex, layerId, data);
    });
  };
  const { startRotate } = useRotateLayer({
    getLayerData,
    frameScale: scale,
    pageOffset: {
      x: pageRef.current?.getBoundingClientRect().x || 0,
      y: pageRef.current?.getBoundingClientRect().y || 0,
    },
    getControlBoxData,
    setControlBoxData,
    onRotateStart: () => {
      const layerData: LayerDataRef = {};
      selectedLayers.forEach((layer) => {
        const { centerX, centerY } = boundingRect(
          layer.data.props.boxSize,
          layer.data.props.position,
          layer.data.props.rotate
        );
        layerData[layer.id] = cloneDeep({
          position: layer.data.props.position,
          boxSize: layer.data.props.boxSize,
          rotate: layer.data.props.rotate,
          scale: layer.data.props.scale,
          centerX: centerX,
          centerY: centerY,
          type: layer.data.type,
        });
      });
      setControlBoxData(controlBox!);
      setLayerData(layerData);
      actions.setRotateData(true, autoCorrectDegree(controlBox!.rotate));
      actions.history.new();
    },
    onRotate: handleRotate,
    onRotateEnd: handleRotateEnd,
  });

  const handleDownload = async (pageIndex: number) => {
    if (displayRef.current) {
      try {
        const dataUrl = await toPng(displayRef.current);
        const link = document.createElement("a");
        link.download = `design-id-page-${pageIndex + 1}.png`;
        link.href = dataUrl;
        link.click();
      } catch (e) {
        window.alert("Cannot download: " + (e as Error).message);
      }
    }
  };

  const handleUploadImage = async (files: File[]) => {
    if (files.length !== 1) return;
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);
    // NOTE: need to update the api to not use type
    formData.append("type", "canva");
    try {
      const res = await uploadImageRQ(formData);
      const newImage = new Image();
      newImage.onerror = (err) => window.alert(err);
      newImage.src = res.url;
      newImage.crossOrigin = "anonymous";
      newImage.onload = () => {
        actions.addImageLayer(
          { url: res.url, thumb: res.url },
          { width: newImage.naturalWidth, height: newImage.naturalHeight }
        );
      };
    } catch (e) {
      window.alert("Cannot upload image: " + (e as Error).message);
    }
  };

  return (
    <PageProvider pageIndex={pageIndex}>
      <div
        className="max-[900px]:hidden"
        style={{
          fontWeight: "bold",
          marginTop: 24,
          height: 28,
          display: "flex",
          alignItems: "center",
          marginBottom: 4,
          width: width * scale,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ flexGrow: 1 }}>Page {pageIndex + 1}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 20,
            color: "#0d1216",
            height: 28,
            opacity: 0.7,
          }}
        >
          <div
            className={`${
              pageIndex === 0 ? "" : "hover:bg-[rgba(64, 87, 109, 0.07)]"
            }`}
            style={{
              marginLeft: 8,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              cursor: pageIndex === 0 ? "not-allowed" : "pointer",
              color: pageIndex === 0 ? "rgba(36,49,61,.4)" : "#0d1216",
            }}
            onClick={() => actions.movePageUp(pageIndex)}
          >
            <CaretUpIcon />
          </div>
          <div
            className={`${
              pageIndex === totalPages - 1
                ? ""
                : "hover:bg-[rgba(64, 87, 109, 0.07)]"
            }`}
            style={{
              marginLeft: 8,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              cursor: pageIndex === totalPages - 1 ? "not-allowed" : "pointer",
              color:
                pageIndex === totalPages - 1 ? "rgba(36,49,61,.4)" : "#0d1216",
            }}
            onClick={() => actions.movePageDown(pageIndex)}
          >
            <CaretDownIcon />
          </div>
          <div
            className="hover:bg-[rgba(64, 87, 109, 0.07)]"
            style={{
              marginLeft: 8,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => {
              isLocked
                ? actions.unlockPage(pageIndex)
                : actions.lockPage(pageIndex);
            }}
          >
            {!isLocked && <LockKeyOpenIcon />}
            {isLocked && <LockKeyIcon />}
          </div>
          <div
            className="hover:bg-[rgba(64, 87, 109, 0.07)]"
            style={{
              marginLeft: 8,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => actions.duplicatePage(pageIndex)}
          >
            <DuplicateIcon />
          </div>
          <div
            className="hover:bg-[rgba(64, 87, 109, 0.07)]"
            style={{
              marginLeft: 8,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => handleDownload(pageIndex)}
          >
            <DownloadIcon />
          </div>
          <div
            className={`${
              isLocked || totalPages <= 1
                ? ""
                : "hover:bg-[rgba(64, 87, 109, 0.07)]"
            }`}
            style={{
              marginLeft: 8,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              cursor: isLocked || totalPages <= 1 ? "not-allowed" : "pointer",
              color:
                isLocked || totalPages <= 1 ? "rgba(36,49,61,.4)" : "#0d1216",
            }}
            onClick={() =>
              !isLocked && totalPages > 1 && actions.deletePage(pageIndex)
            }
          >
            <TrashIcon />
          </div>
          <div
            className="hover:bg-[rgba(64, 87, 109, 0.07)]"
            style={{
              marginLeft: 8,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => actions.addPage(pageIndex)}
          >
            <FilePlusIcon />
          </div>
        </div>
      </div>
      <div
        ref={ref}
        id={`canva-page-${pageIndex}`}
        className="max-[900px]:shadow-none"
        style={{
          position: "relative",
          margin: 0,
          boxShadow: "0 2px 8px rgba(14,19,24,.07)",
          width: width * scale * transform.scale,
          height: height * scale * transform.scale,
        }}
      >
        <div
          ref={pageRef}
          style={{
            userSelect: "none",
            background: "white",
            overflow: "hidden",
            transformOrigin: "0 0",
            width: width,
            height: height,
            transform: `scale(${scale * transform.scale})`,
          }}
          onContextMenu={openContextMenu}
        >
          <div
            ref={displayRef}
            className={`max-[900px]:w-[${width * scale}px] max-[900px]:h-[${
              height * scale
            }px]`}
            style={{
              width,
              height,
              position: "relative",
              left: 0,
              top: 0,
              zIndex: 1,
            }}
          >
            <Dropzone
              accept={{
                "image/jpeg": ["image/jpg", "image/jpeg"],
                "image/png": ["image/png"],
              }}
              maxFiles={1}
              noClick={true}
              onDrop={handleUploadImage}
              onDropRejected={() =>
                window.alert("Only support jpg, png files and 1 file at a time")
              }
            >
              {({ getRootProps, isDragActive }) => (
                <div {...getRootProps()}>
                  <PageElement />
                  {isDragActive && (
                    <div
                      className={cn(
                        "absolute inset-0 flex flex-col justify-center items-center gap-2",
                        "border-4 border-dashed rounded-md border-sky-500"
                      )}
                    >
                      <FileUpload
                        sx={{
                          fontSize: 40,
                          fill: "#3b82f6",
                        }}
                      />
                      <div className="font-semibold">
                        Drag & Drop your image here
                      </div>
                      <div className="text-xs text-gray-500">
                        (only support jpg, png)
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          {!imageEditor &&
            pageIndex === activePage &&
            controlBox &&
            selectedLayers.length > 1 && (
              <LayerBorderBox
                boxSize={controlBox.boxSize}
                position={controlBox.position}
                rotate={controlBox.rotate}
                type={"dashed"}
              />
            )}
          {/*!imageEditor &&
            pageIndex === activePage &&
            controlBox &&
            selectedLayers.length === 1 &&
            selectedLayers[0].data.parent &&
            selectedLayers[0].data.parent !== "ROOT" &&
            (() => {
              const { dx, dy } = deltaPositionGroup(state, selectedLayers[0]);
              return (
                <LayerBorderBox
                  boxSize={controlBox.boxSize}
                  position={{
                    x: selectedLayers[0].data.props.position.x,
                    y: selectedLayers[0].data.props.position.y,
                  }}
                  rotate={controlBox.rotate}
                  dx={dx}
                  dy={dy}
                  type={"dashed"}
                />
              );
            })()*/}

          {!imageEditor &&
            pageIndex === activePage &&
            selectedLayers.map((layer) => (
              <LayerBorderBox
                key={layer.id}
                ref={(el) => {
                  if (el) layerBorderRef.current[layer.id] = el;
                }}
                boxSize={layer.data.props.boxSize}
                layerType={layer.data.type}
                position={layer.data.props.position}
                rotate={layer.data.props.rotate}
                type={
                  selectedLayers.length === 1 &&
                  selectedLayers[0].data.type === "Group" &&
                  textEditor
                    ? "dashed"
                    : "solid"
                }
              />
            ))}
          {!imageEditor &&
            pageIndex === activePage &&
            selectedLayers.length === 1 &&
            selectedLayers[0].data.type === "Group" &&
            textEditor && <></>}
          {!imageEditor &&
            hoveredLayer &&
            !selectedLayerIds.includes(hoveredLayer.id) && (
              <LayerBorderBox
                ref={(el) => {
                  if (el) {
                    layerBorderRef.current[hoveredLayer.id] = el;
                  }
                }}
                boxSize={hoveredLayer.data.props.boxSize}
                position={hoveredLayer.data.props.position}
                rotate={hoveredLayer.data.props.rotate}
              />
            )}
          {!imageEditor &&
            pageIndex === activePage &&
            selectedLayerIds.length > 0 && (
              <Fragment>
                {controlBox &&
                  !(
                    (selectedLayerIds.length === 1 &&
                      selectedLayers[0].data.type === "Line") ||
                    (selectedLayerIds.length === 1 &&
                      selectedLayers[0].data.parent !== "ROOT")
                  ) && (
                    <ControlBox
                      ref={controlBoxRef}
                      boxSize={controlBox.boxSize}
                      disabled={disabled}
                      locked={disabled.locked}
                      position={controlBox.position}
                      rotate={controlBox.rotate}
                      scale={controlBox.scale}
                      onResizeStart={startResizing}
                      onRouteStart={startRotate}
                    />
                  )}
                {controlBox &&
                  selectedLayerIds.length === 1 &&
                  selectedLayers[0].data.type === "Line" && (
                    <LineControl
                      boxSize={selectedLayers[0].data.props.boxSize}
                      disabled={disabled}
                      locked={disabled.locked}
                      position={selectedLayers[0].data.props.position}
                      rotate={selectedLayers[0].data.props.rotate}
                      onChangeStart={startChangeLine}
                      onRouteStart={startRotate}
                    />
                  )}
                <Toolbar />
              </Fragment>
            )}
          {pageIndex === activePage && <Guideline />}
        </div>
        {imageEditor && imageEditor.pageIndex === pageIndex && <ImageEditor />}
        {textEditor && textEditor.pageIndex === pageIndex && <TextEditor />}
      </div>
    </PageProvider>
  );
};

export default forwardRef<HTMLDivElement, PageProps>(DesignPage);
