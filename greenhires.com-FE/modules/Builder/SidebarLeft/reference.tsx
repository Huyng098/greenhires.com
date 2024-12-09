import { RichInput } from "@/components/controls/texteditor";
import { ItemCRUDProps } from "@/interfaces/base";
import { Reference as ReferenceType } from "@/interfaces/builder";

const Reference = ({
  item,
  updateFieldItem,
  scopedT,
}: ItemCRUDProps<ReferenceType>) => {
  return (
    <div className="flex flex-col gap-5 p-2">
      <div className="flex gap-5 flex-col sm:flex-row">
        <RichInput
          content={item.name}
          id={`reference-name-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "name", value)}
          placeholder={scopedT("name")}
        />
        <RichInput
          content={item.position}
          id={`reference-position-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "position", value)}
          placeholder={scopedT("position")}
        />
      </div>
      <div className="flex gap-5 flex-col sm:flex-row">
        <RichInput
          content={item.phone}
          id={`reference-phone-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "phone", value)}
          placeholder={scopedT("phone")}
        />
        <RichInput
          content={item.email}
          id={`reference-email-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "email", value)}
          placeholder={scopedT("email")}
        />
      </div>
    </div>
  );
};

export default Reference;
