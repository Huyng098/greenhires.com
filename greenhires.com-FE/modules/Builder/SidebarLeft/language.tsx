"use client";

import { RichInput } from "@/components/controls/texteditor";
import { levelLanguage } from "@/constants/levelBar";
import { ItemCRUDProps } from "@/interfaces/base";
import { Language as LanguageType } from "@/interfaces/builder";
import { Typography } from "@mui/material";
import { CaretDown } from "@phosphor-icons/react";
import { Dropdown, MenuProps } from "antd";

export const Language = ({
  item,
  updateFieldItem,
  scopedT,
}: ItemCRUDProps<LanguageType>) => {
  const items: MenuProps["items"] = levelLanguage?.map((level) => ({
    label: (
      <Typography
        key={level.label}
        onClick={() => updateFieldItem(item.id, "level", level.label)}
      >
        {level.label}
      </Typography>
    ),
    key: level.value,
  }));

  return (
    <div>
      <div className="mt-4 flex flex-col gap-5">
        <div className="flex gap-5 text-sm flex-col sm:flex-row">
          <RichInput
            content={item.name}
            id={`language-name-${item.id}`}
            isHasAIOption={false}
            hideToolbar={true}
            onChange={(value) => updateFieldItem(item.id, "name", value)}
            placeholder={scopedT("name")}
          />
          <div className="relative w-full">
            <RichInput
              content={item.level}
              id={`language-level-${item.id}`}
              isHasAIOption={false}
              hideToolbar={true}
              onChange={(value) => updateFieldItem(item.id, "level", value)}
              placeholder={scopedT("level")}
            />
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              className="absolute right-2 top-[30%]"
              placement="bottomRight"
            >
              <CaretDown size={20} className="cursor-pointer" weight="light" />
            </Dropdown>
          </div>
        </div>
        <div className="flex flex-col text-sm">
          <p className="mb-2">{scopedT("summary")}</p>
          <RichInput
            content={item.summary || ""}
            className="min-h-[60px]"
            topic="Language"
            id={`language-description-${item.id}`}
            onChange={(value) => updateFieldItem(item.id, "summary", value)}
          />
        </div>
      </div>
    </div>
  );
};
