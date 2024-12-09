import {
  forwardRef,
  ForwardRefRenderFunction,
  HTMLProps,
  PropsWithChildren,
} from "react";

interface SettingButtonProps extends HTMLProps<HTMLDivElement> {
  isActive?: boolean;
}

const SettingButton: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<SettingButtonProps>
> = ({ children, isActive, disabled, style, onClick, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`${disabled ? "" : "hover:bg-[rgba(64,87,109,.07)]"} ${isActive ? "bg-[rgba(57,76,96,.15)]" : "#fff"}`}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        height: 32,
        padding: "0 4px",
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? "rgba(36,49,61,.4)" : undefined,
        whiteSpace: "nowrap",
        ...style,
      }}
      onClick={(e) => !disabled && onClick && onClick(e)}
      {...props}
    >
      {children}
    </div>
  );
};
export default forwardRef<
  HTMLDivElement,
  PropsWithChildren<SettingButtonProps>
>(SettingButton);
