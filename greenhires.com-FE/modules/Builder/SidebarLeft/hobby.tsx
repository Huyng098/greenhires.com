import { RichInput } from "@/components/controls/texteditor";
import { ItemCRUDProps } from "@/interfaces/base";
import { Hobby as HobbyType } from "@/interfaces/builder";
const Hobby = ({
  item,
  updateFieldItem,
  scopedT,
}: ItemCRUDProps<HobbyType>) => {
  return (
    <div className="flex flex-col gap-5 p-2 w-full">
      <RichInput
        content={item.name}
        id={`hobby-name-${item.id}`}
        isHasAIOption={false}
        hideToolbar={true}
        onChange={(value) => updateFieldItem(item.id, "name", value)}
        placeholder={scopedT("name")}
      />

      <div>
        <p className="mb-[3px]"> Summary </p>
        <RichInput
          content={item.summary || ""}
          className="min-h-[60px]"
          topic="Hobby"
          onChange={(value) => updateFieldItem(item.id, "summary", value)}
        />
      </div>
    </div>
  );
};

export default Hobby;
