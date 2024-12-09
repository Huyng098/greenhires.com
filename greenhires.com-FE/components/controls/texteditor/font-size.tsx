import { Toggle } from "@/components/ui/toggle";
import { Tooltip } from "@/components/ui/tooltip";
import { Check, TextAa } from "@phosphor-icons/react";
import { Popover } from "antd";
import { debounce } from "lodash";
import React, { ChangeEvent, FC, useCallback, useRef, useState } from "react";

interface IProps {
  onChangeFontSize: (size: string) => void;
}

const fontSizeList = [
  6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 88, 96,
  104, 120, 144,
];

const FontSizeTiptap: FC<IProps> = ({ onChangeFontSize }) => {
  const fontSizeRef = useRef<HTMLInputElement>(null);
  const [selectedFontSize, setSelectedFontSize] = useState<number>();

  const debouncedChange = useCallback(
    debounce((value) => {
      onChangeFontSize(value);
    }, 500),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedChange(e.target.value);
  };

  return (
    <div>
      <Popover
        rootClassName="z-[9999]"
        trigger="click"
        arrow={false}
        content={
          <div className="w-20">
            <span className="font-bold text-sm">Font size</span>
            <div className="max-h-48 overflow-y-auto">
              {fontSizeList.map((size, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedFontSize(size);
                    onChangeFontSize(String(size));
                  }}
                  className="flex gap-2 justify-between hover:bg-[#e2e8f0] p-1 rounded-sm cursor-pointer"
                >
                  <span>{size}</span>
                  {size === selectedFontSize && <Check size={18} />}
                </div>
              ))}
            </div>
            <div className="border rounded-sm p-1 mt-1">
              <input
                onChange={handleChange}
                className="h-full w-full"
                type="text"
                ref={fontSizeRef}
                onClick={() => fontSizeRef.current?.focus()}
                value={selectedFontSize}
              />
            </div>
          </div>
        }
      >
        <Toggle size="sm">
          <Tooltip content="Font size" className="mb-2">
            {selectedFontSize ? (
              <span>{selectedFontSize}</span>
            ) : (
              <TextAa size={18} />
            )}
          </Tooltip>
        </Toggle>
      </Popover>
    </div>
  );
};

export default FontSizeTiptap;
