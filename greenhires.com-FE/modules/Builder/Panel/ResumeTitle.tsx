"use client";
import { BottomInput } from "@/components/controls/input/BottomInput";
import { useHover } from "@/lib/hooks/useHover";
import { useResumeStore } from "@/stores/resume";
import { PencilSimple } from "@phosphor-icons/react";

export const ResumeTitle = () => {
  const title = useResumeStore()((state) => state.resume?.title);
  const {
    inputRef,
    isCanEdit,
    isHover,
    setIsHover,
    handleEdit,
    handleChangeTitle,
  } = useHover();
  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="flex w-full justify-center items-center gap-2"
    >
      {!isCanEdit ? (
        <h3 className="my-3 mr-2 text-center text-xl font-medium dark:text-white sm:text-xl">
          {title}
        </h3>
      ) : (
        <BottomInput
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              inputRef.current?.blur();
            }
          }}
          onBlur={(e) => handleChangeTitle(e)}
          defaultValue={title}
        />
      )}
      {isHover && (
        <button
          onClick={() => handleEdit()}
          className="hover:text-secondary-main"
        >
          <PencilSimple size={20} weight="thin" />
        </button>
      )}
    </div>
  );
};
