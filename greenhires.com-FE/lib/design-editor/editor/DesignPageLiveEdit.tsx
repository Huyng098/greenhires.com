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

// @ts-ignore
import {
  getPosition,
  mergeWithoutArray,
  useLinkedRef,
} from "@lidojs/design-utils";
import { cloneDeep } from "lodash";
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  useEffect,
  useRef,
} from "react";
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
  isImageLayer,
  isTextLayer,
  isVideoLayer,
} from "../ultils/layer/layers";

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

const DesignPageLiveEdit: ForwardRefRenderFunction<
  HTMLDivElement,
  PageProps
> = ({ pageIndex, width, height, transform }, ref) => {
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

  return (
    <PageProvider pageIndex={pageIndex}>
      <div
        ref={ref}
        style={{
          position: "relative",
          marginTop: "30px",
          marginBottom: "30px",
          boxShadow: "0 8px 16px rgba(14,19,24,.07)",
          width: width * scale * transform.scale,
          height: height * scale * transform.scale,
          transform: getTransformStyle({
            position: transform,
            scale: transform.scale,
          }),
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
            <PageElement />
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
              />
            ))}
          {!imageEditor &&
            hoveredLayer &&
            !selectedLayerIds.includes(hoveredLayer.id) && (
              <LayerBorderBox
                ref={(el) => {
                  if (el) layerBorderRef.current[hoveredLayer.id] = el;
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
                    selectedLayerIds.length === 1 &&
                    selectedLayers[0].data.type === "Line"
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

export default forwardRef<HTMLDivElement, PageProps>(DesignPageLiveEdit);
