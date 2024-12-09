import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEditor } from "@/lib/design-editor";
import classNames from "classnames";
import { ChevronDown } from "lucide-react";
import { components, moreComponents, Section } from "./resume-component";

interface Props {
  title: string;
  onClick: (section: Section) => void;
}

export const SectionLayout = ({ title, onClick }: Props) => {
  const { query } = useEditor();
  const isAddedCheck = (key: string) => {
    return query.serialize().some((page) => page.layers[key]);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <div className="flex items-center justify-center flex-shrink-0 h-[48px] border-b  border-b-[rgba(57,76,96,.15)] px-[20px]">
        <p className="text-white font-[600] leading-[48px] grow">{title}</p>
      </div>
      <div className="px-[20px]">
        <Accordion
          type="multiple"
          className="w-[300px]"
          defaultValue={["item-1"]}
        >
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="bg-secondary-main hover:bg-secondary-main/90 rounded-lg relative text-white justify-center">
              Add new {title}
              <ChevronDown className="absolute right-2 shrink-0 transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-y-8 py-8 text-white text-sm">
                {components?.map((component) => {
                  const key =
                    title === "Component"
                      ? component.component[0].rootId
                      : component.layout.rootId;
                  const isAdded = isAddedCheck(key);
                  if (key === "picture.layout") return null;

                  return (
                    <button
                      key={component.label}
                      disabled={isAdded}
                      className={classNames(
                        "gap-3 flex items-center",
                        !isAdded &&
                          "hover:text-secondary-main hover:cursor-pointer"
                      )}
                      onClick={() => onClick(component)}
                    >
                      {component.icon}
                      {component.label}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-b-0">
            <AccordionTrigger className="text-white ">
              See more {title}
              <ChevronDown className=" transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-y-8 text-white text-sm">
                {moreComponents?.map((component) => {
                  const key =
                    title === "Component"
                      ? component.component[0].rootId
                      : component.layout.rootId;
                  const isAdded = isAddedCheck(key);
                  return (
                    <button
                      disabled={isAdded}
                      key={component.label}
                      className="flex gap-3 items-center enabled:hover:text-secondary-main"
                      onClick={() => onClick(component)}
                    >
                      {component.icon}
                      {component.label}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
