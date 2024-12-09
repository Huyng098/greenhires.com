import CaretRightIcon from "@duyank/icons/regular/CaretRight";
import { FC, PropsWithChildren, ReactElement, useState } from "react";

interface ContextMenuItemProps {
  name: string;
  icon: ReactElement;
  shortcut?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const ContextMenuItem: FC<PropsWithChildren<ContextMenuItemProps>> = ({
  name,
  icon,
  shortcut,
  disabled = false,
  children,
  onClick,
}) => {
  const [showSub, setShowSub] = useState(false);
  return (
    <div
      className={disabled ? "" : "hover:bg-[rgba(64,87,109,.07)]"}
      style={{
        padding: "8px 16px 8px 8px",
        display: "flex",
        alignItems: "center",
        position: "relative",
        color: disabled ? "rgba(36,49,61,.4)" : "rgb(13, 18, 22)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={() => !disabled && onClick && onClick()}
      onMouseLeave={() => setShowSub(false)}
      onMouseOut={() => setShowSub(false)}
      onMouseOver={() => setShowSub(true)}
    >
      <div
        style={{
          fontSize: 20,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          marginLeft: 8,
          fontSize: 14,
          flexGrow: 1,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
      <div
        className="max-[900px]:hidden"
        style={{
          width: 48,
          paddingLeft: 8,
        }}
      />
      {(children || shortcut) && (
        <div
          className="max-[900px]:hidden"
          style={{
            height: 24,
            lineHeight: "24px",
            fontSize: shortcut ? 12 : 20,
            padding: shortcut ? "0 8px" : 0,
            marginLeft: 8,
            background: shortcut ? "rgba(64,87,109,.07)" : undefined,
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          {shortcut}
          {children && <CaretRightIcon />}
        </div>
      )}
      {showSub && children}
    </div>
  );
};

export default ContextMenuItem;
