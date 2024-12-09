import FreeStyleDatePicker from "@/components/Common/FreeStyleDatePicker";
import { RichInput } from "@/components/controls/texteditor";
import { ItemCRUDProps } from "@/interfaces/base";
import { Course as CourseType } from "@/interfaces/builder";

const Course = ({
  item,
  updateFieldItem,
  scopedT,
}: ItemCRUDProps<CourseType>) => {
  return (
    <div className="flex flex-col gap-5 p-2">
      <div className="flex  gap-5 flex-col sm:flex-row">
        <RichInput
          content={item.name}
          id={`coursename-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "name", value)}
          placeholder={scopedT("name")}
        />
        <RichInput
          content={item.institution}
          id={`courseinstitution-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "institution", value)}
          placeholder={scopedT("institution")}
        />
      </div>
      <div className="flex gap-5 flex-col sm:flex-row">
        <FreeStyleDatePicker
          format="MM-YYYY"
          value={item.startDate as string}
          id={`course-startDate-${item.id}`}
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
          id={`course-endDate-${item.id}`}
          placeholder={scopedT("enddate")}
          onDatePickerChange={(value) =>
            updateFieldItem(item.id, "endDate", value)
          }
          onInputChange={(value) => updateFieldItem(item.id, "endDate", value)}
        />
      </div>
    </div>
  );
};

export default Course;
