"use client";
import {
  CustomSectionGroup,
  defaultSection,
  SectionKey,
} from "@/interfaces/builder/baseSection";
import { ResumeDto } from "@/interfaces/builder/resume";
import { debouncedUpdateResume } from "@/services/resume/query";
import { produce } from "immer";
//@ts-ignore
import _set from "lodash.set";
import { createContext, useContext, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { temporal, TemporalState } from "zundo";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useStoreWithEqualityFn } from "zustand/traditional";
interface ResumeStore {
  // State
  resume: ResumeDto;
  pages: HTMLDivElement[];
  // Actions
  setResume: (path: string, value: unknown) => void;
  setPages: (pages: HTMLDivElement[]) => void;
  addCustomSection: () => void;
  addSectionByKey: (sectionKey: SectionKey) => void;
  removeSection: (sectionKey: SectionKey) => void;
}

export const createStore = (resume: ResumeDto) =>
  create<ResumeStore>()(
    temporal(
      immer((set) => ({
        resume: resume,
        pages: [],
        setResume: (path, value) => {
          set((state) => {
            if (path === "visibility") {
              state.resume.visibility = value as "public" | "private";
            } else if (path === "title") {
              state.resume.title = value as string;
              state.resume.slug = (value as string)
                .replaceAll(" ", "-")
                .toLowerCase();
            } else if (path === "language") {
              state.resume.language = value as string;
            }
            state.resume.resume_data = _set(
              state.resume.resume_data,
              path,
              value
            );
            debouncedUpdateResume(JSON.parse(JSON.stringify(state.resume)));
          });
        },
        setPages: (pages: HTMLDivElement[]) => {
          set(
            produce((state) => {
              state.pages = pages;
            })
          );
        },
        addCustomSection: () => {
          const section: CustomSectionGroup = {
            ...defaultSection,
            key: uuidv4(),
            name: `Custom Section`,
            items: [],
          };
          set((state) => {
            state.resume.resume_data = _set(
              state.resume.resume_data,
              `sections.custom.${section.key}`,
              section
            );
            state.resume.resume_data.metadata.section_order.push(
              `custom.${section.key}`
            );
            debouncedUpdateResume(JSON.parse(JSON.stringify(state.resume)));
          });
        },
        addSectionByKey: (sectionKey: SectionKey) => {
          set((state) => {
            const definedSection = {
              ...defaultSection,
              key: sectionKey,
              name: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
              items: [],
            };
            state.resume.resume_data = _set(
              state.resume.resume_data,
              `sections.${sectionKey}`,
              definedSection
            );
            debouncedUpdateResume(JSON.parse(JSON.stringify(state.resume)));
          });
        },

        removeSection: (sectionKey: SectionKey) => {
          if (sectionKey.startsWith("custom.")) {
            const id = sectionKey.split("custom.")[1];
            set((state) => {
              delete state.resume.resume_data.sections.custom[id];
              state.resume.resume_data.metadata.section_order =
                state.resume.resume_data.metadata.section_order.filter(
                  (section) => section !== sectionKey
                );
              debouncedUpdateResume(JSON.parse(JSON.stringify(state.resume)));
            });
          }
        },
      })),
      {
        limit: 100,
        wrapTemporal: (fn) => devtools(fn),
        partialize: ({ resume }) => ({ resume }),
      }
    )
  );

const ResumeContext = createContext<ReturnType<typeof createStore> | null>(
  null
);

export const useResumeStore = () => {
  if (!ResumeContext)
    throw new Error("useResumeStore must be used within a ResumeProvider");
  return useContext(ResumeContext)!;
};

export const useTemporalResumeStore = <T,>(
  selector: (state: TemporalState<Pick<ResumeStore, "resume">>) => T,
  equality?: (a: T, b: T) => boolean
) => useStoreWithEqualityFn(useResumeStore().temporal, selector, equality);

const ResumeProvider = ({
  resume,
  children,
}: {
  resume: ResumeDto;
  children: React.ReactNode;
}) => {
  const store = useRef<ReturnType<typeof createStore>>();
  
  if (!store.current) {
    store.current = createStore(resume);
  }

  return (
    <ResumeContext.Provider value={store.current}>
      {children}
    </ResumeContext.Provider>
  );
};

export default ResumeProvider;
