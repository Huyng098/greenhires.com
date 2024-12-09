import { Fragment, useState } from "react";
import { TLevelBar } from "./types";

export const LevelBar = ({
  id,
  label,
  className,
  items,
  ...props
}: TLevelBar) => {
  const [value, setValue] = useState((props.defaultValue as number) || 1);
  return (
    <div className="block w-full">
      <label className="text-sm">
        {label}{" "}
        <span style={{ color: `${items[value - 1].color}` }}>
          {items[value - 1].label}
        </span>
      </label>
      <div
        className={`flex relative overflow-hidden h-[40px] rounded-md transition-background duration-200 ease-in transform translate-z-0 pointer-events-auto`}
      >
        {items.map((item, index) => (
          <Fragment key={index}>
            <label
              onClick={() => setValue(item.value)}
              style={{
                backgroundColor: `${items[value - 1].color}`,
              }}
              className="inline-block opacity-25 relative flex-1 cursor-pointer"
            >
              <input
                type="checkbox"
                {...props}
                value={item.value}
                className="absolute top-0 left-0 opacity-0 pointer-events-none"
              />
            </label>
            {index !== items.length - 1 && (
              <div
                className="w-[1px] h-full opacity-35"
                style={{
                  backgroundColor: `${items[value - 1].color}`,
                }}
              ></div>
            )}
          </Fragment>
        ))}
        <div
          style={{
            backgroundColor: `${items[value - 1].color}`,
            transform: `translateX(${(value - 1) * 100}%)`,
          }}
          className="absolute top-0 left-0 h-full rounded-md transition-transform duration-200 ease-in opacity-100 w-1/5"
        ></div>
      </div>
    </div>
  );
};
