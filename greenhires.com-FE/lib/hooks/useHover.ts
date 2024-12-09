import { debouncedUpdateResume } from "@/services/resume/query";
import { useResumeStore } from "@/stores/resume";
import { FocusEvent, useEffect, useRef, useState } from "react";

export const useHover = () => {
  const [isCanEdit, setIsCanEdit] = useState(false);
  const setValue = useResumeStore()((state) => state.setResume);
  const resume_id = useResumeStore()((state) => state.resume.id);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isHover, setIsHover] = useState(false);
  const handleEdit = () => {
    setIsCanEdit(true);
  };
  const handleChangeTitle = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (e.target.value) {
      setValue("title", e.target.value);
      debouncedUpdateResume({
        id: resume_id,
        title: e.target.value,
      });
    }
    setIsCanEdit(false);
  };
  useEffect(() => {
    if (isCanEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCanEdit]);
  return {
    inputRef,
    isCanEdit,
    isHover,
    setIsHover,
    handleChangeTitle,
    handleEdit,
    setIsCanEdit,
  };
};
