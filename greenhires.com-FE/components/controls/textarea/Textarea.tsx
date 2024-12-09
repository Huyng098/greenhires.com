import classNames from "classnames";
import { TTextarea } from ".";
import { ForwardedRef, forwardRef } from "react";

const Component = (
  { id, label, required, className, value, ...props }: TTextarea,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block mb-1 text-base">
        {label}
        {required && <> *</>}
      </label>
      <textarea
        {...props}
        ref={ref}
        id={id}
        required={required}
        className={classNames(
          className,
          "w-full px-4 py-2 border-[1px] border-[#c4c4c4] rounded bg-transparent",
          "hover:border-black focus:border-[1px] focus:border-secondary focus:outline-none"
        )}
      >
        {value}
      </textarea>
    </div>
  );
};

export const Textarea = forwardRef<HTMLTextAreaElement, TTextarea>(Component);
