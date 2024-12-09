"use client";

import { useBuilderStore } from "@/stores/builder";
import { Editor, EditorContentProps } from "@tiptap/react";
import classNames from "classnames";
import parse from "html-react-parser";
import { forwardRef, useEffect, useRef, useState } from "react";

interface RichInputProps
  extends Omit<
    EditorContentProps,
    "ref" | "editor" | "content" | "value" | "onChange" | "className"
  > {
  content?: string;
  topic?: string;
  onChange?: (value: string) => void;
  hideToolbar?: boolean;
  className?: string;
  editorClassName?: string;
  isHasAIOption?: boolean;
}

interface HolderProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const RichInputPlaceholder = forwardRef<Editor, RichInputProps>(
  (
    {
      content,
      topic,
      onChange,
      hideToolbar = false,
      className,
      editorClassName,
      isHasAIOption = true,
    },
    _ref
  ) => {
    const holderRef = useRef<HTMLDivElement>(null);
    const [holderProps, setHolderProps] = useState<HolderProps | null>(null);
    const setRichtextProps = useBuilderStore()(
      (state) => state.workspace.setRichtextProps
    );
    const handleOnClick = () => {
      if (!holderRef.current) return;
      const rect = holderRef.current.getBoundingClientRect();
      setRichtextProps({
        content,
        topic,
        onChange,
        hideToolbar,
        className,
        editorClassName,
        isHasAIOption,
        positionX: holderRef.current.offsetLeft,
        positionY: holderRef.current.offsetTop,
        width: rect.width,
        height: rect.height,
      });
    };

    return (
      <div
        ref={holderRef}
        className={classNames(
          "bg-white rounded-md border w-full relative",
          className
        )}
        onClick={handleOnClick}
      >
        <div className={classNames("p-2 px-3 w-full")}>
          {parse(content || "")}
        </div>
      </div>
    );
  }
);
