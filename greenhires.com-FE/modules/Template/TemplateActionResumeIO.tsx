"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/interfaces/general/category";
import { useResumeStore } from "@/stores/resume";
import { Check } from "@phosphor-icons/react";
import classNames from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { templateList } from "./templateList";
import { layoutList } from "./layoutList";

interface TemplateActionResumeIOProps {
  children?: React.ReactNode;
  categories: Category[];
  numLimit?: number;
  isShowCheck?: boolean;
  isLayout?: boolean;
}
export const TemplateActionResumeIO = ({
  categories,
  children,
  numLimit = 26,
  isShowCheck = false,
  isLayout = false,
}: TemplateActionResumeIOProps) => {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [page, setPage] = useState(0);
  const data = useMemo(() => {
    if (isLayout)
      return layoutList.slice(page * numLimit, (page + 1) * numLimit);
    return templateList.slice(page * numLimit, (page + 1) * numLimit);
  }, [page, numLimit, isLayout]);
  const setValue = useResumeStore()((state) => state.setResume);
  const handleAppyTemplate = (name: string) => {
    setValue("metadata.template", name);
    setSelectedTemplate(name);
  };
  console.log(data);
  return (
    <>
      <div className="min-w-[350px] flex items-center justify-between gap-2 p-4">
        {children}
        <Select onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="max-w-[160px] h-8">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="focus:ring-0">
            <SelectItem value="All">All</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="grid grid-cols-2 gap-3 px-4">
          {data.map((item, index) => (
            <div
              key={index}
              className={classNames(
                "cursor-pointer transition ease-in-out delay-550 duration-300 hover:scale-105",
                "rounded relative border flex flex-col aspect-[1/1.4142] items-center justify-center bg-secondary/50"
              )}
              onClick={() => handleAppyTemplate(item.name)}
            >
              <Image
                alt={`Template ${item}`}
                src={item.previews[0]}
                className={classNames(
                  "cursor-pointer rounded transition ease-in-out delay-550 duration-300 hover:scale-105",
                  "relative flex flex-col aspect-[1/1.4142] items-center justify-center bg-secondary/50"
                )}
                loading="lazy"
                width={158}
                height={224}
              />
              {isShowCheck && selectedTemplate === item.name && (
                <div className="absolute insert-1/2 z-20">
                  <Check size={40} color="green" weight="bold" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-5 w-full mr-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((old) => Math.max(old - 1, 0))}
            disabled={page === 0}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setPage((old) => old + 1);
            }}
            disabled={data.length! < numLimit}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};
