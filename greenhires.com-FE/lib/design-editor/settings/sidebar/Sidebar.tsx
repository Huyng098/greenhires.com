import {
  forwardRef,
  ForwardRefRenderFunction,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";

export interface SidebarProps {
  open: boolean;
}

const Sidebar: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<SidebarProps>
> = ({ open, children }, ref) => {
  const [container, setContainer] = useState(
    window.document.getElementById("settings")
  );
  const child = (
    <div
      ref={ref}
      className="max-[900px]:w-100 ax-[900px]:fixed max-[900px]:bottom-0 max-[900px]:left-0 max-[900px]:top-0 max-[900px]:bg-[#fff] "
      style={{
        borderRight: "1px solid rgba(57,76,96,.15)",
        background: "#fff",
        width: "100%",
        height: "100%",
        position: "absolute",
        overflowY: "auto",
        pointerEvents: "auto",
      }}
    >
      {children}
    </div>
  );
  useEffect(() => {
    const settingsElement = window.document.getElementById("settings");
    setContainer(settingsElement);
  }, []);
  if (!container) {
    return null;
  }
  return open ? ReactDOM.createPortal(child, container) : null;
};
export default forwardRef<HTMLDivElement, PropsWithChildren<SidebarProps>>(
  Sidebar
);
