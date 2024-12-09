"use client";
import {
  SectionItem,
  SectionKey,
  SectionWithItem,
} from "@/interfaces/builder/baseSection";
import { useResumeStore } from "@/stores/resume";
import { produce } from "immer";
// @ts-ignore
import get from "lodash.get";
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

type Props = {
  component: string;
  id?: string;
};

export const useResumeCRUD = <T extends SectionItem>({ component }: Props) => {
  const setValue = useResumeStore()((state) => state.setResume);
  const deleteCustomSection = useResumeStore()((state) => state.removeSection);
  const section = useResumeStore()((state) => {
    return get(state.resume.resume_data?.sections, component);
  }) as SectionWithItem<T> | null;

  const updateFieldItem = (id: string, attribute: string, value: unknown) => {
    if (!section) return;
    const index = section.items.findIndex((item) => item.id === id);
    if (index === -1) return;
    setValue(`sections.${component}.items[${index}].${attribute}`, value);
  };

  const updateBasics = (key: string, value: unknown) => {
    setValue(key, value);
  };

  const createOrDuplicateItem = (values: T) => {
    if (!section) return;
    const id = uuidv4();
    const newValues = produce(section.items, (draft: T[]): void => {
      draft.push({ ...values, id: id });
    });
    setValue(`sections.${component}.items`, newValues);
  };

  const deleteItem = (identifier: SectionKey, id: string) => {
    if (!section) return;
    const newValues = produce(section.items, (draft: T[]): void => {
      const index = draft.findIndex((item) => item.id === id);
      if (index === -1) return;
      draft.splice(index, 1);
    });
    setValue(`sections.${identifier}.items`, newValues);
  };
  return {
    section,
    setValue,
    updateBasics,
    updateFieldItem,
    createOrDuplicateItem,
    deleteItem,
    deleteCustomSection,
  };
};
