import { ForwardedRef, forwardRef } from "react";
import { TInput } from ".";

const Component = (
  {
    defaultValue,
    required,
    disabled,
    placeholder,
    hasError,
    className,
    ...props
  }: TInput,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <input
      ref={ref}
      {...props}
      disabled={disabled}
      required={required}
      maxLength={50}
      defaultValue={defaultValue}
      placeholder="Untitled"
      className="text-xl w-fit font-medium outline-none bg-transparent
      focus:border-b-[2px] focus:border-secondary-main"
    />
  );
};

export const BottomInput = forwardRef<HTMLInputElement, TInput>(Component);
