"use client";
import { requiredSectionKeys } from "@/interfaces/builder/baseSection";

import {
  Eye,
  EyeSlash,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react/dist/ssr";

import { DotsSixVertical } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import CustomStyle from "@/components/CustomStyle";
import { RichInput } from "@/components/controls/texteditor";
import { useState } from "react";

interface Props {
  identifier: string;
  section: any;
  setValue: (path: string, value: unknown) => void;
  handleDeleteCustomSection?: () => void;
  listeners?: any;
  attributes?: any;
}
export const SectionResumeTitle = ({
  identifier,
  section,
  setValue,
  handleDeleteCustomSection,
  listeners,
  attributes,
}: Props) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isCanEdit, setIsCanEdit] = useState<boolean>(false);

  const onToggleVisibilitySection = () =>
    setValue(`sections.${identifier}.visible`, !section?.visible);
  const changeSectionName = (text: string) => {
    if (identifier === "basics") setValue(`basics.name`, text);
    else {
      setValue(`sections.${identifier}.name`, text);
    }
  };

  if (!section) return null;
  return (
    <header className="mt-5 flex items-center gap-2 relative">
      {identifier !== "basics" && identifier !== "aboutme" && (
        <div
          {...listeners}
          {...attributes}
          className={cn(
            "absolute left-0 -translate-x-full cursor-grabbing",
            isHover ? "opacity-100" : "opacity-0"
          )}
        >
          <DotsSixVertical weight="bold" size={20} />
        </div>
      )}
      <div className="flex items-center justify-between w-full">
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="flex gap-2"
        >
          {isCanEdit ? (
            <RichInput
              className="min-w-20"
              id="section-title"
              content={section.name}
              onChange={(value) => changeSectionName(value)}
              isHasAIOption={false}
              hideToolbar={true}
              focus={isCanEdit}
              placeholder="..."
            />
          ) : (
            <div
              className="line-clamp-1 font-medium text-xl prose"
              dangerouslySetInnerHTML={{
                __html: section.name === "<p></p>" ? "-" : section.name,
              }}
            />
          )}
          {isHover && (
            <>
              <button
                onClick={() => setIsCanEdit(!isCanEdit)}
                className="hover:text-secondary-main"
              >
                <PencilSimple size={20} weight="light" />
              </button>
              {identifier !== "basics" && (
                <button
                  onClick={() => onToggleVisibilitySection()}
                  className="hover:text-secondary-main"
                >
                  {section?.visible ? (
                    <Eye size={20} weight="light" />
                  ) : (
                    <EyeSlash size={20} weight="light" />
                  )}
                </button>
              )}
              {handleDeleteCustomSection &&
                !requiredSectionKeys.includes(identifier) && (
                  <button
                    onClick={() => handleDeleteCustomSection()}
                    className="hover:text-red-500"
                  >
                    <Trash size={20} weight="light" />
                  </button>
                )}
            </>
          )}
        </div>
        <CustomStyle identifier={identifier} setValue={setValue} />
      </div>
    </header>
  );
};
