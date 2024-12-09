import { RichInput } from "@/components/controls/texteditor";
import { ItemCRUDProps } from "@/interfaces/base";
import { URL as URLType } from "@/interfaces/builder";

const LinkSection = ({
  item,
  updateFieldItem,
  scopedT,
}: ItemCRUDProps<URLType>) => {
  return (
    <div className="flex flex-col gap-5 p-2">
      <div className="flex gap-5 flex-col sm:flex-row">
        <RichInput
          content={item.label}
          id={`url-label-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "label", value)}
          placeholder={scopedT("label")}
        />
        <RichInput
          content={item.href}
          id={`link-href-${item.id}`}
          isHasAIOption={false}
          hideToolbar={true}
          onChange={(value) => updateFieldItem(item.id, "href", value)}
          placeholder={scopedT("href")}
        />
      </div>
    </div>
  );
};

export default LinkSection;
