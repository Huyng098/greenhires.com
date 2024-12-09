import CheckIcon from "@duyank/icons/regular/Check";
import { useRef, useState } from "react";
import Popover from "../common/popover/Popover";
import Slider from "../common/slider/Slider";
import { useEditor } from "../hooks";
import SettingButton from "./SettingButton";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

const PageControl = () => {
  const labelScaleOptionRef = useRef<HTMLDivElement>(null);
  const [openScaleOptions, setOpenScaleOptions] = useState(false);
  const { actions, activePage, totalPages, scale } = useEditor((state) => ({
    activePage: state.activePage,
    totalPages: state.pages.length,
    scale: state.scale,
  }));

  const handleChangeScale = (value: number) => {
    actions.setScale(value / 100);
  };
  return (
    <div
      className="justify-between"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        fontWeight: 300,
      }}
    >
      <div>
        <Button variant="ghost" size="icon" className="h-full">
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-full">
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div>
        Page {activePage + 1} / {totalPages}
      </div>
      <div
        style={{
          flexShrink: 0,
          display: "grid",
          gridAutoFlow: "column",
          gridColumnGap: 8,
          alignItems: "center",
        }}
      >
        <div style={{ width: 200, paddingRight: 8 }}>
          <Slider
            hideInput={true}
            hideLabel={true}
            max={500}
            min={10}
            value={scale * 100}
            onChange={handleChangeScale}
          />
        </div>
        <SettingButton
          ref={labelScaleOptionRef}
          onClick={() => setOpenScaleOptions(true)}
        >
          <div style={{ width: 48, textAlign: "center" }}>
            {Math.round(scale * 100)}%
          </div>
        </SettingButton>
        <Popover
          anchorEl={labelScaleOptionRef.current}
          open={openScaleOptions}
          placement={"top-end"}
          onClose={() => setOpenScaleOptions(false)}
        >
          <div style={{ padding: "8px 0" }}>
            {[300, 200, 150, 100, 75, 50, 25, 10].map((s) => (
              <div
                key={s}
                style={{
                  padding: "0 8px",
                  display: "flex",
                  height: 40,
                  minWidth: 100,
                  alignItems: "center",
                  cursor: "pointer",
                  backgroundColor: "rgba(64,87,109,.07)",
                }}
                onClick={() => {
                  actions.setScale(s / 100);
                  setOpenScaleOptions(false);
                }}
              >
                <span
                  style={{
                    padding: "0 8px",
                    whiteSpace: "nowrap",
                    flexGrow: 1,
                  }}
                >
                  {s}%
                </span>
                {s / 100 === scale && <CheckIcon />}
              </div>
            ))}
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default PageControl;
