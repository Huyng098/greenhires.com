"use client";

import { RichInput } from "@/components/controls/texteditor";
import { ItemCRUDProps } from "@/interfaces/base";
import { Skill as SkillType } from "@/interfaces/builder";

export const Skill = ({
  item,
  updateFieldItem,
  scopedT,
}: ItemCRUDProps<SkillType>) => {
  return (
    <div>
      <div className="mt-4 flex flex-col gap-5">
        <div className="flex gap-5 text-sm flex-col sm:flex-row">
          <RichInput
            id={`skill-name-${item.id}`}
            content={item.name}
            onChange={(value) => updateFieldItem(item.id, "name", value)}
            isHasAIOption={false}
            hideToolbar={true}
            placeholder={scopedT("name")}
          />
          <RichInput
            id={`skill-description-${item.id}`}
            content={item.description}
            onChange={(value) => updateFieldItem(item.id, "description", value)}
            isHasAIOption={false}
            hideToolbar={true}
            placeholder={scopedT("description")}
          />
        </div>
        {/* <div className="flex items-center gap-5 flex-col sm:flex-row">
          <div className="w-1/2">
            <LevelBar
              id={`skill-level-${item.id}`}
              label="Level —"
              onChange={(e) =>
                updateFieldItem(item.id, "level", parseInt(e.target.value))
              }
              items={levelBar}
              defaultValue={item.level}
            />
          </div>
          <div className="w-1/2 text-sm">
            <p className="mb-[3px]"> Display bar </p>
            <ISelectNormal
              id={`skill-displayBar-${item.id}`}
              placeholder={scopedT("displaybar")}
              options={displayBar}
              onChange={(e) => {
                updateFieldItem(item.id, "displayBar", e.target.value);
              }}
              isHideLabel={true}
              defaultValue={item.displayBar}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};
