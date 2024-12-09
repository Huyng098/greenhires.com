"use client";
import FreeStyleDatePicker from "@/components/Common/FreeStyleDatePicker";
import { RichInput } from "@/components/controls/texteditor";
import { ItemCRUDProps } from "@/interfaces/base";
import { Award as AwardType } from "@/interfaces/builder";

export const Award = ({
  item,
  updateFieldItem,
  scopedT,
}: ItemCRUDProps<AwardType>) => {
  return (
    <div className="mt-4 flex flex-col gap-5">
      <div className="flex gap-5 text-sm ">
        <RichInput
          content={item.title}
          topic="Company"
          id={`award-title-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "title", value)}
          placeholder={scopedT("title")}
        />
      </div>
      <div className="flex justify-between gap-5 text-sm flex-col sm:flex-row">
        <FreeStyleDatePicker
          format="MM-YYYY"
          value={item.date as string}
          id={`award-date-${item.id}`}
          placeholder={scopedT("date")}
          onDatePickerChange={(value) =>
            updateFieldItem(item.id, "date", value)
          }
          onInputChange={(value) => updateFieldItem(item.id, "date", value)}
        />
        <RichInput
          content={item.awarder}
          id={`award-awarder-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "awarder", value)}
          placeholder={scopedT("awarder")}
        />
      </div>
      <div className="flex flex-col text-sm">
        <p className="mb-2">{scopedT("summary")}</p>
        <RichInput
          className="min-h-[60px]"
          topic="Award"
          id={`award-summary-${item.id}`}
          content={item.summary || ""}
          onChange={(value) => updateFieldItem(item.id, "summary", value)}
        />
      </div>
    </div>
  );
};
