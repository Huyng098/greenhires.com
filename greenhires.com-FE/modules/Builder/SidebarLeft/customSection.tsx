import FreeStyleDatePicker from "@/components/Common/FreeStyleDatePicker";
import { RichInput } from "@/components/controls/texteditor";
import { ItemCRUDProps } from "@/interfaces/base";
import { CustomSection as CustomSectionType } from "@/interfaces/builder";

const CustomSection = ({
  item,
  updateFieldItem,
  scopedT,
}: ItemCRUDProps<CustomSectionType>) => {
  return (
    <div className="flex flex-col gap-5 p-2">
      <div className="flex gap-5 flex-col sm:flex-row">
        <RichInput
          content={item.name}
          id={`sectionname-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "name", value)}
          placeholder={scopedT("name")}
        />
      </div>
      <div className="flex  gap-5 flex-col sm:flex-row">
        <FreeStyleDatePicker
          format="MM-YYYY"
          value={item.startDate as string}
          id={`custom-startDate-${item.id}`}
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
          id={`custom-endDate-${item.id}`}
          placeholder={scopedT("enddate")}
          onDatePickerChange={(value) =>
            updateFieldItem(item.id, "endDate", value)
          }
          onInputChange={(value) => updateFieldItem(item.id, "endDate", value)}
        />
      </div>
      <div className="flex flex-col text-sm">
        <p className="mb-2">{scopedT("summary")}</p>
        <RichInput
          id={`sectionsummary-${item.id}`}
          topic="Custom Section"
          label={scopedT("summary")}
          content={item.summary || ""}
          onChange={(value) => updateFieldItem(item.id, "summary", value)}
        />
      </div>
    </div>
  );
};

export default CustomSection;
