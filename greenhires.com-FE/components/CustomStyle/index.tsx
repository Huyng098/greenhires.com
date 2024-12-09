import * as React from "react";
import CustomStyleContainer from "./CustomStyle";
import { Popover } from "antd";
import { PaintBrushBroad } from "@phosphor-icons/react";
import { useResumeStore } from "@/stores/resume";

export interface ICustomStyle {
  identifier: string;
  setValue: (path: string, value: unknown) => void;
}

const CustomStyle: React.FC<ICustomStyle> = ({ identifier, setValue }) => {
  const isSample = useResumeStore()((state) => state.resume.isSample);

  const isShowButton = React.useMemo(() => isSample, [isSample]);

  if (!isShowButton) return null;

  return (
    <Popover
      content={
        <CustomStyleContainer identifier={identifier} setValue={setValue} />
      }
      trigger="click"
      rootClassName="z-[10000]"
    >
      <button className="hover:text-secondary-main">
        <PaintBrushBroad size={24} />
      </button>
    </Popover>
  );
};

export default CustomStyle;
