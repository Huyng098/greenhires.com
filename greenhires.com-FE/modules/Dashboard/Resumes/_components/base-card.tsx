import classNames from "classnames";
import React from "react";

type Props = {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
};

export const BaseCard = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className, onClick, ...props }: Props, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={classNames(
        "transition ease-in-out delay-550 duration-300 hover:scale-105 p-0 ",
        "relative rounded-lg flex flex-col aspect-[794/1123] items-center justify-center bg-secondary/50 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
