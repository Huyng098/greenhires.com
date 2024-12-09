import { Color } from "@/lib/design-utils";
import { ColorPicker } from "@lidojs/color-picker";
import { Popover } from "antd";
import React, { FC } from "react";

interface IProps {
  trigger?: "hover" | "click";
  color: string;
  onChange: (value: string) => void;
}

const ColorPickerPopover: FC<IProps> = ({
  trigger = "click",
  color,
  onChange,
}) => {
  return (
    <Popover
      content={
        <ColorPicker color={new Color(color).toHex()} onChange={onChange} />
      }
      trigger={trigger}
      getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
    >
      <button
        style={{
          width: "24px",
          height: "24px",
          background:
            "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
        }}
      ></button>
    </Popover>
  );
};

export default ColorPickerPopover;
