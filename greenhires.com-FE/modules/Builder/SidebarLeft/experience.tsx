"use client";
import FreeStyleDatePicker from "@/components/Common/FreeStyleDatePicker";
import { RichInput } from "@/components/controls/texteditor";
import { ItemCRUDProps } from "@/interfaces/base";
import { Experience as ExperienceType } from "@/interfaces/builder";

export const Experience = ({
  item,
  updateFieldItem,
  scopedT,
}: ItemCRUDProps<ExperienceType>) => {
  return (
    <div>
      <div className="mt-4 flex flex-col gap-5">
        <div className="flex gap-5 text-sm flex-col sm:flex-row">
          <RichInput
            content={item.company}
            topic="Company"
            id={`experience-company-${item.id}`}
            isHasAIOption={false}
            hideToolbar={true}
            onChange={(value) => updateFieldItem(item.id, "company", value)}
            placeholder={scopedT("company")}
          />
          <RichInput
            content={item.position}
            topic="position"
            id={`experience-position-${item.id}`}
            isHasAIOption={false}
            hideToolbar={true}
            onChange={(value) => updateFieldItem(item.id, "position", value)}
            placeholder={scopedT("position")}
          />
        </div>
        <div className="flex gap-5 flex-col sm:flex-row">
          <FreeStyleDatePicker
            format="MM-YYYY"
            value={item.startDate as string}
            id={`experience-startDate-${item.id}`}
            placeholder={scopedT("startdate")}
            onDatePickerChange={(value) =>
              updateFieldItem(item.id, "startDate", value)
            }
            onInputChange={(value) =>
              updateFieldItem(item.id, "startDate", value)
            }
          />
          <FreeStyleDatePicker
            format="MM-YYYY"
            value={item.endDate as string}
            id={`experience-endDate-${item.id}`}
            placeholder={scopedT("enddate")}
            onDatePickerChange={(value) =>
              updateFieldItem(item.id, "endDate", value)
            }
            onInputChange={(value) =>
              updateFieldItem(item.id, "endDate", value)
            }
          />
        </div>

        <div className="flex flex-col text-sm">
          <p className="mb-2">{scopedT("summary")}</p>
          <RichInput
            content={item.summary || ""}
            className="min-h-[60px]"
            topic="experience"
            id={`experience-summary-${item.id}`}
            onChange={(value) => updateFieldItem(item.id, "summary", value)}
          />
        </div>
      </div>
    </div>
  );
};
