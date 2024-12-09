import React, { FC, useEffect, useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Slider from "@/lib/design-editor/common/slider/Slider";
import { Radio, Space } from "antd";
import Line from "./Line";
import Dashed from "./Dashed";
import TripleDashed from "./TripleDashed";
import Dotted from "./Dotted";
import None from "./None";
import { ICustomStyle } from ".";
import { useResumeStore } from "@/stores/resume";
import { BORDER_MAPPING, BorderTypes, getBorder } from "./utils";
import ColorPickerPopover from "./ColorPicker";

const borderOptions = [
  { value: "none", component: <None /> },
  { value: "line", component: <Line /> },
  { value: "dashed", component: <Dashed /> },
  { value: "triple-dashed", component: <TripleDashed /> },
  { value: "dotted", component: <Dotted /> },
];

const CustomStyleContainer: FC<ICustomStyle> = ({ identifier, setValue }) => {
  const style = useResumeStore()((state) => state.resume.resume_data.css);
  const parsedStyle = useMemo(() => (style ? JSON.parse(style) : {}), [style]);
  const { border } = parsedStyle?.[identifier] || {};

  const [selectedBorder, setSelectedBorder] = useState<BorderTypes>(
    border?.borderType || "none"
  );
  const [borderWidth, setBorderWidth] = useState<number>(
    border?.borderWidth || 1
  );
  const [borderRadius, setBorderRadius] = useState<number>(
    border?.borderRadius || 1
  );
  const [borderColor, setBorderColor] = useState<string>(
    decodeURIComponent(border?.borderColor || "") || "#000000"
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(
    decodeURIComponent(border?.backgroundColor || "") || "#ffffff"
  );

  useEffect(() => {
    const encodeColor = {
      borderColor: encodeURIComponent(borderColor),
      backgroundColor: encodeURIComponent(backgroundColor),
    };
    const updatedStyle = {
      ...parsedStyle,
      [identifier]:
        selectedBorder === "none"
          ? null
          : {
              border: {
                ...encodeColor,
                backgroundImage: getBorder({
                  ...BORDER_MAPPING[selectedBorder],
                  ...encodeColor,
                  borderRadius,
                  borderWidth,
                }),
                borderType: selectedBorder,
                borderRadius,
                borderWidth,
              },
            },
    };

    setValue("css", JSON.stringify(updatedStyle));
  }, [
    selectedBorder,
    borderWidth,
    borderRadius,
    borderColor,
    backgroundColor,
    parsedStyle,
    identifier,
    setValue,
  ]);

  return (
    <Box p={2}>
      <Box display="flex" gap={1}>
        <Radio.Group
          optionType="button"
          onChange={(e) => setSelectedBorder(e.target.value)}
          value={selectedBorder}
        >
          <Space>
            {borderOptions.map(({ value, component }) => (
              <Radio
                key={value}
                value={value}
                className="flex items-center text-lg"
              >
                {component}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Box>
      <Box mt={2}>
        <Slider
          label="Border Weight"
          min={0}
          max={25}
          value={borderWidth}
          defaultValue={borderWidth}
          onChange={setBorderWidth}
        />
      </Box>
      <Box mt={2}>
        <Slider
          label="Corner Rounding"
          min={0}
          max={100}
          value={borderRadius}
          onChange={setBorderRadius}
        />
      </Box>
      <Box mt={2} display="flex" gap={2}>
        <Typography fontSize={14}>Border Color</Typography>
        <ColorPickerPopover color={borderColor} onChange={setBorderColor} />
      </Box>
      <Box mt={2} display="flex" gap={2}>
        <Typography fontSize={14}>Background Color</Typography>
        <ColorPickerPopover
          color={backgroundColor}
          onChange={setBackgroundColor}
        />
      </Box>
    </Box>
  );
};

export default CustomStyleContainer;
