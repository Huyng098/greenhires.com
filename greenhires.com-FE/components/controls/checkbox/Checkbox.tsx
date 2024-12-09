import classNames from "classnames";
import { TCheckbox } from ".";
import { ForwardedRef, forwardRef } from "react";

export const Component = (
  { id, label, className, ...props }: TCheckbox,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <div className="flex cursor-pointer select-none items-center text-sm font-medium text-body-color">
      <input
        {...props}
        ref={ref}
        id={id}
        type="checkbox"
        className={classNames("cursor-pointer", className)}
      />
      <label htmlFor={id} className="px-4 cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export const Checkbox = forwardRef<HTMLInputElement, TCheckbox>(Component);
