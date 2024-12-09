import TransparencyIcon from "@duyank/icons/external/Transparency";
import LockKeyIcon from "@duyank/icons/regular/LockKey";
import LockKeyOpenIcon from "@duyank/icons/regular/LockKeyOpen";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Popover from "../common/popover/Popover";
import Slider from "../common/slider/Slider";
import { useEditor, useSelectedLayers } from "../hooks";
import { RootLayerProps } from "../layers";
import { isRootLayer } from "../ultils/layer/layers";
import SettingButton from "./SettingButton";
import LayerSidebar from "./sidebar/LayerSidebar";

const CommonSettings = () => {
  const transparencyButtonRef = useRef<HTMLDivElement>(null);
  const resizeButtonRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);
  const [openTransparencySetting, setOpenTransparencySetting] = useState(false);
  const [openResizeSetting, setOpenResizeSetting] = useState(false);
  const [lockSiteAspect, setLockSizeAspect] = useState(false);
  const { selectedLayers, selectedLayerIds } = useSelectedLayers();
  const { actions, activePage, sidebar, pageSize, isPageLocked } = useEditor(
    (state, query) => ({
      activePage: state.activePage,
      sidebar: state.sidebar,
      pageSize: query.getPageSize(),
      isPageLocked:
        state.pages[state.activePage] &&
        state.pages[state.activePage].layers.ROOT.data.locked,
    })
  );
  const [size, setSize] = useState(pageSize);
  useEffect(() => {
    setSize(pageSize);
  }, [pageSize]);
  const { transparency } = useMemo(() => {
    return Object.entries(selectedLayers).reduce(
      (acc, [, layer]) => {
        if (isRootLayer(layer)) {
          acc.transparency = Math.max(
            acc.transparency,
            typeof layer.data.props.image?.transparency !== "undefined"
              ? layer.data.props.image.transparency
              : 1
          );
        } else {
          acc.transparency = Math.max(
            acc.transparency,
            typeof layer.data.props.transparency !== "undefined"
              ? layer.data.props.transparency
              : 1
          );
        }
        return acc;
      },
      { transparency: 0 }
    );
  }, [selectedLayers]);
  const isLocked = !!selectedLayers.find((l) => l.data.locked);
  const toggleLock = () => {
    if (isLocked) {
      actions.unlock(activePage, selectedLayerIds);
    } else {
      actions.lock(activePage, selectedLayerIds);
    }
  };
  const updateTransparency = (transparency: number) => {
    selectedLayerIds.forEach((layerId) => {
      if (layerId === "ROOT") {
        actions.history
          .throttle(2000)
          .setProp<RootLayerProps>(activePage, layerId, {
            image: {
              transparency: transparency / 100,
            },
          });
      } else {
        actions.history.throttle(2000).setProp(activePage, layerId, {
          transparency: transparency / 100,
        });
      }
    });
  };
  useEffect(() => {
    setOpenTransparencySetting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedLayerIds)]);

  const handleChangeSize = (value: string, type: "width" | "height") => {
    const ratio = size.width / size.height;
    const v = parseInt(value, 10);
    if (type === "width") {
      if (lockSiteAspect) {
        (heightRef.current as HTMLInputElement).value = String(
          Math.round((v / ratio) * 10) / 10
        );
      }
      setSize({ ...size, width: v });
    }
    if (type === "height") {
      if (lockSiteAspect) {
        (widthRef.current as HTMLInputElement).value = String(
          Math.round(v * ratio * 10) / 10
        );
      }
      setSize({ ...size, height: v });
    }
  };

  const isDisabledResize = useMemo(
    () => size.width < 100 || size.height < 100,
    [size]
  );

  return (
    <Fragment>
      <div
        style={{
          display: "grid",
          alignItems: "center",
          gridAutoFlow: "column",
          gridGap: 8,
        }}
      >
        <SettingButton onClick={() => actions.setSidebar("LAYER_MANAGEMENT")}>
          <span style={{ padding: "0 4px" }}>Position</span>
        </SettingButton>

        {selectedLayerIds.length > 0 &&
          !isLocked &&
          !isPageLocked &&
          (!isRootLayer(selectedLayers[0]) ||
            (isRootLayer(selectedLayers[0]) &&
              selectedLayers[0].data.props.image)) && (
            <Fragment>
              <div
                style={{
                  height: 24,
                  width: `1px`,
                  background: "rgba(57,76,96,.15)",
                }}
              />
              <SettingButton
                ref={transparencyButtonRef}
                style={{ fontSize: 20 }}
                onClick={() => setOpenTransparencySetting(true)}
              >
                <TransparencyIcon />
              </SettingButton>
              <Popover
                anchorEl={transparencyButtonRef.current}
                offsets={{
                  "bottom-end": { x: 0, y: 8 },
                }}
                open={openTransparencySetting}
                placement={"bottom-end"}
                onClose={() => setOpenTransparencySetting(false)}
              >
                <div style={{ padding: 16 }}>
                  <Slider
                    defaultValue={transparency * 100}
                    label={"Transparency"}
                    onChange={updateTransparency}
                  />
                </div>
              </Popover>
            </Fragment>
          )}
        {!isPageLocked && (
          <Fragment>
            <div
              style={{
                height: 24,
                width: `1px`,
                background: "rgba(57,76,96,.15)",
              }}
            />
          </Fragment>
        )}
        <Popover
          anchorEl={resizeButtonRef.current}
          offsets={{
            "bottom-end": { x: 0, y: 8 },
          }}
          open={openResizeSetting}
          placement={"bottom-end"}
          onClose={() => setOpenResizeSetting(false)}
        >
          <div style={{ padding: 16, width: 240 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>Width</div>
                <div
                  style={{
                    border: "1px solid rgba(43,59,74,.3)",
                    height: 40,
                    padding: "0 12px",
                    width: 80,
                    borderRadius: 4,
                  }}
                >
                  <input
                    ref={widthRef}
                    style={{ width: "100%", minWidth: 8, height: "100%" }}
                    defaultValue={size.width}
                    onChange={(e) => handleChangeSize(e.target.value, "width")}
                  />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>Height</div>
                <div
                  style={{
                    border: "1px solid rgba(43,59,74,.3)",
                    height: 40,
                    padding: "0 12px",
                    width: 80,
                    borderRadius: 4,
                  }}
                >
                  <input
                    ref={heightRef}
                    style={{ width: "100%", minWidth: 8, height: "100%" }}
                    defaultValue={size.height}
                    onChange={(e) => handleChangeSize(e.target.value, "height")}
                  />
                </div>
              </div>
              <div
                style={{ fontSize: 20, cursor: "pointer", margin: "10px 0" }}
                onClick={() => setLockSizeAspect(!lockSiteAspect)}
              >
                {lockSiteAspect ? <LockKeyIcon /> : <LockKeyOpenIcon />}
              </div>
            </div>
            {isDisabledResize && (
              <div style={{ color: "#db1436" }}>
                Dimensions must be at least 100px and no more than 8000px.
              </div>
            )}
          </div>
        </Popover>
        {selectedLayerIds.length > 0 && (
          <SettingButton
            style={{ fontSize: 20 }}
            isActive={isLocked}
            onClick={toggleLock}
          >
            {isLocked && <LockKeyIcon />}
            {!isLocked && <LockKeyOpenIcon />}
          </SettingButton>
        )}
      </div>
      {sidebar === "LAYER_MANAGEMENT" && <LayerSidebar open={true} />}
    </Fragment>
  );
};

export default CommonSettings;
