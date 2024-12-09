"use client";
import { mergeDeepLeft } from "ramda";
import { createContext, useContext, useRef } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface GlobalRichInputProps {
  content?: string;
  topic?: string;
  onChange?: (value: string) => void;
  hideToolbar?: boolean;
  className?: string;
  editorClassName?: string;
  isHasAIOption?: boolean;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
}

export type BuilderStore = {
  workspace: {
    order: number;
    setOrder: (order: number) => void;
    isApplying:
      | "template"
      | "background"
      | "none"
      | "shape"
      | "layout"
      | "layout-section-style";
    setIsApply: (
      val:
        | "template"
        | "background"
        | "none"
        | "shape"
        | "layout"
        | "layout-section-style"
    ) => void;
    richtextProps: GlobalRichInputProps | null;
    setRichtextProps: (props: GlobalRichInputProps | null) => void;
  };
};

export const createStore = () =>
  create<BuilderStore>()(
    persist(
      immer((set) => ({
        workspace: {
          richtextProps: {
            content: "",
            topic: "",
            onChange: () => {},
            hideToolbar: false,
            className: "",
            editorClassName: "",
            isHasAIOption: false,
            positionX: 0,
            positionY: 0,
            width: 0,
            height: 0,
          },
          order: 0,
          isApplying: "none",
          setOrder: (order: number) =>
            set((state) => {
              state.workspace.order = order;
            }),
          setIsApply: (
            val:
              | "template"
              | "background"
              | "none"
              | "shape"
              | "layout"
              | "layout-section-style"
          ) =>
            set((state) => {
              state.workspace.isApplying = val;
            }),
          setRichtextProps: (props) =>
            set((state) => {
              state.workspace.richtextProps = props;
            }),
        },
      })),
      {
        name: "builder",
        merge: (persistedState, currentState) =>
          mergeDeepLeft(persistedState, currentState),
      }
    )
  );

const BuilderContext = createContext<ReturnType<typeof createStore> | null>(
  null
);

export const useBuilderStore = () => {
  if (!BuilderContext)
    throw new Error("useBuilderStore must be used within a BuilderProvider");
  return useContext(BuilderContext)!;
};

const BuilderProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useRef<ReturnType<typeof createStore>>();
  if (!store.current) {
    store.current = createStore();
  }
  return (
    <BuilderContext.Provider value={store.current}>
      {children}
    </BuilderContext.Provider>
  );
};

export default BuilderProvider;
