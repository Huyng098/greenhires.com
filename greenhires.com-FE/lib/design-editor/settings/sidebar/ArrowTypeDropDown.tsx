import CheckIcon from "@duyank/icons/regular/Check";
import { ArrowType } from "@lidojs/design-core";
import { FC, useRef, useState } from "react";
import Popover from "../../common/popover/Popover";
import SettingButton from "../SettingButton";

const icon = {
  none: (
    <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M5 12v-.75h16a.75.75 0 0 1 0 1.5H5V12z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
      <path d="M5 9.5v5L3 12l2-2.5z" fill="currentColor"></path>
    </svg>
  ),
  bar: (
    <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M3.25 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
      <path
        clipRule="evenodd"
        d="M3.75 8a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0v-6.5A.75.75 0 0 1 3.75 8z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  ),
  arrow: (
    <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M2.97 12.53a.75.75 0 0 1 0-1.06l4.773-4.773a.75.75 0 0 1 1.06 1.06L5.311 11.25H20.5a.75.75 0 0 1 0 1.5H5.31l3.493 3.493a.75.75 0 1 1-1.06 1.06L2.97 12.53z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  ),
  triangle: (
    <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M9.75 12a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
      <path
        d="M2.624 11.584a.5.5 0 0 0 0 .832l7.599 5.066a.5.5 0 0 0 .777-.416V6.934a.5.5 0 0 0-.777-.416l-7.599 5.066z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  outlineCircle: (
    <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M9.75 12a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
      <path
        clipRule="evenodd"
        d="M4.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0zM7 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  ),
  circle: (
    <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M9.75 12a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
      <path d="M3 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" fill="currentColor"></path>
    </svg>
  ),
  outlineSquare: (
    <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M9.75 12a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
      <path
        clipRule="evenodd"
        d="M4.5 9.5v5h5v-5h-5zM3.5 8a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  ),
  square: (
    <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M9.75 12a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5h-10a.75.75 0 0 1-.75-.75z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
      <path
        d="M3 8.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-7z"
        fill="currentColor"
      ></path>
    </svg>
  ),
  outlineDiamond: (
    <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M11.25 12a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
      <path
        clipRule="evenodd"
        d="M8 8.931 4.931 12 8 15.069 11.069 12 8 8.931zm.324-1.797a.459.459 0 0 0-.648 0l-4.542 4.542a.458.458 0 0 0 0 .648l4.542 4.542c.179.179.47.179.648 0l4.542-4.542a.458.458 0 0 0 0-.648L8.324 7.134z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  ),
  diamond: (
    <svg height="24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        clipRule="evenodd"
        d="M11.25 12a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
      <path
        d="M7.676 7.134a.458.458 0 0 1 .648 0l4.542 4.542a.458.458 0 0 1 0 .648l-4.542 4.542a.458.458 0 0 1-.648 0l-4.542-4.542a.459.459 0 0 1 0-.648l4.542-4.542z"
        fill="currentColor"
      ></path>
    </svg>
  ),
};

const arrowTypeList: ArrowType[] = [
  "none",
  "bar",
  "arrow",
  "triangle",
  "outlineCircle",
  "circle",
  "outlineSquare",
  "square",
  "outlineDiamond",
  "diamond",
];

type Props = {
  position?: "start" | "end";
  value: ArrowType;
  onChange: (v: ArrowType) => void;
};
const ArrowTypeDropDown: FC<Props> = ({
  position = "start",
  value = "none",
  onChange,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <SettingButton ref={ref} onClick={() => setOpen(true)}>
        <div
          style={{ transform: position === "start" ? undefined : `scaleX(-1)` }}
        >
          {icon[value]}
        </div>
      </SettingButton>
      <Popover
        anchorEl={ref.current}
        open={open}
        placement={"bottom"}
        onClose={() => setOpen(false)}
      >
        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          {arrowTypeList.map((type) => (
            <div
              key={type}
              className="hover:bg-[rgba(64,87,109,.07)]"
              style={{
                height: 40,
                minWidth: 120,
                padding: "0 8px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => onChange(type)}
            >
              <div
                style={{
                  flexShrink: 0,
                  transform: position === "start" ? undefined : `scaleX(-1)`,
                }}
              >
                {icon[type]}
              </div>
              <div
                style={{
                  fontSize: 24,
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                {type === value && <CheckIcon />}
              </div>
            </div>
          ))}
        </div>
      </Popover>
    </>
  );
};

export default ArrowTypeDropDown;
