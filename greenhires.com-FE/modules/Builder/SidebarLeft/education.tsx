"use client";

import FreeStyleDatePicker from "@/components/Common/FreeStyleDatePicker";
import { RichInput } from "@/components/controls/texteditor";
import { ItemCRUDProps } from "@/interfaces/base";
import { Education as EducationType } from "@/interfaces/builder";

export const Education = ({
  item,
  updateFieldItem,
  scopedT,
}: ItemCRUDProps<EducationType>) => {
  return (
    <div className="flex flex-col gap-5 mt-4">
      <div className="flex gap-5 text-sm flex-col sm:flex-row">
        <RichInput
          content={item.school}
          id={`education-institution-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "school", value)}
          placeholder={scopedT("school")}
        />
        <RichInput
          content={item.typeOfStudy}
          id={`education-type-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "typeOfStudy", value)}
          placeholder={scopedT("typeofstudy")}
        />
      </div>
      <div className="flex gap-5 text-sm flex-col sm:flex-row">
        <RichInput
          content={item.major}
          id={`education-major-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "major", value)}
          placeholder={scopedT("major")}
        />
        <RichInput
          content={item.score}
          id={`education-score-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "score", value)}
          placeholder={scopedT("score")}
        />
      </div>
      <FreeStyleDatePicker
        format="MM-YYYY"
        value={item.yearGraduation as string}
        id={`education-year-graduation-${item.id}`}
        placeholder={scopedT("yeargraduation")}
        onDatePickerChange={(value) =>
          updateFieldItem(item.id, "yearGraduation", value)
        }
        onInputChange={(value) =>
          updateFieldItem(item.id, "yearGraduation", value)
        }
      />
      <div className="flex flex-col text-sm">
        <p className="mb-2">{scopedT("summary")}</p>
        <RichInput
          content={item.summary || ""}
          className="min-h-[60px]"
          id={`education-summary-${item.id}`}
          onChange={(value) => updateFieldItem(item.id, "summary", value)}
        />
      </div>
    </div>
  );
};
