import { DotsSixVertical } from "@phosphor-icons/react";
import classNames from "classnames";
import * as PanelPrimitive from "react-resizable-panels";

export const PanelGroup = PanelPrimitive.PanelGroup;

export const Panel = PanelPrimitive.Panel;

type PanelResizeHandleProps = React.ComponentProps<
  typeof PanelPrimitive.PanelResizeHandle
> & {
  isDragging?: boolean;
};

export const PanelResizeHandle = ({
  className,
  isDragging,
  onDragging,
  ...props
}: PanelResizeHandleProps) => (
  <PanelPrimitive.PanelResizeHandle
    className={classNames("relative h-full", className)}
    onDragging={onDragging}
    {...props}
  >
    <div className="flex h-full items-center justify-center">
      <div
        className={classNames(
          "absolute inset-y-0 left-0 z-50 w-1 rounded-lg pl-1 transition-all hover:bg-secondary hover:opacity-100",
          isDragging && "bg-secondary-main opacity-100"
        )}
      />
    </div>

    <div className="pointer-events-none absolute inset-y-0 left-[-6px] z-50 flex items-center justify-center">
      <DotsSixVertical size={16} opacity={1.15} />
    </div>
  </PanelPrimitive.PanelResizeHandle>
);
