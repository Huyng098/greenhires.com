"use client";
import FreeStyleDatePicker from "@/components/Common/FreeStyleDatePicker";
import { RichInput } from "@/components/controls/texteditor";
import { ItemCRUDProps } from "@/interfaces/base";
import { Certification as CertificationType } from "@/interfaces/builder";

export const Certification = ({
  item,
  updateFieldItem,
  scopedT,
}: ItemCRUDProps<CertificationType>) => {
  return (
    <div>
      <div className="mt-4 flex flex-col gap-5">
        <div className="flex  gap-5 text-sm ">
          <RichInput
            content={item.title}
            id={`certification-name-${item.id}`}
            isHasAIOption={false}
            hideToolbar={true}
            onChange={(value) => updateFieldItem(item.id, "title", value)}
            placeholder={scopedT("name")}
          />
        </div>
        <div className="flex justify-between gap-5 text-sm flex-col sm:flex-row">
          <FreeStyleDatePicker
            format="MM-YYYY"
            value={item.date as string}
            id={`certification-date-${item.id}`}
            placeholder={scopedT("date")}
            onDatePickerChange={(value) =>
              updateFieldItem(item.id, "date", value)
            }
            onInputChange={(value) => updateFieldItem(item.id, "date", value)}
          />
          <RichInput
            content={item.issuer}
            id={`certification-issuer-${item.id}`}
            isHasAIOption={false}
            hideToolbar={true}
            onChange={(value) => updateFieldItem(item.id, "issuer", value)}
            placeholder={scopedT("issuer")}
          />
        </div>
        <div className="flex flex-col text-sm">
          <p className="mb-2">{scopedT("summary")}</p>
          <RichInput
            content={item.summary || ""}
            className="min-h-[60px]"
            topic="Certification"
            id={`certification-summary-${item.id}`}
            onChange={(value) => updateFieldItem(item.id, "summary", value)}
          />
        </div>
      </div>
    </div>
  );
};
