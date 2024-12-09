import {
  forwardRef,
  ForwardRefRenderFunction,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";
import PopoverWrapper, { PopoverProps } from "./PopoverWrapper";

const Popover: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<PopoverProps & { element?: HTMLDivElement | null }>
> = ({ open, children, element, ...props }, ref) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!element && typeof window !== "undefined") {
      const newContainer = window.document.createElement("div");
      window.document.body.appendChild(newContainer);
      setContainer(newContainer);

      return () => {
        //window.document.body.removeChild(newContainer);
        // window.document.body.removeChild(newContainer);
      };
    }
  }, [element, open]);
  const child = (
    <PopoverWrapper ref={ref} open={open} {...props}>
      {children}
    </PopoverWrapper>
  );
  return open ? ReactDOM.createPortal(child, element! || container) : null;
};

export default forwardRef<
  HTMLDivElement,
  PropsWithChildren<PopoverProps & { element?: HTMLDivElement | null }>
>(Popover);
