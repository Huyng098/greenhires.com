"use client";
import { Loading } from "@/components/Common/Loading";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BackgroundDto } from "@/interfaces/builder/resume";
import { Category } from "@/interfaces/general/category";
import { usePublicBackgrounds } from "@/services/template/query";
import { Check } from "@phosphor-icons/react";
import classNames from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface BackgroundActionProps {
  children?: React.ReactNode;
  categories: Category[];
  selectedBackground: string;
  onAction: (item: BackgroundDto) => void;
  bgType: string;
  title: string;
  numLimit?: number;
  isShowCheck?: boolean;
}

export const BackgroundList = ({
  categories,
  onAction,
  selectedBackground,
  bgType,
  children,
  title,
  numLimit = 26,
  isShowCheck = false,
}: BackgroundActionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [page, setPage] = useState(0);
  const { data, isFetching, isError, error, isPlaceholderData } =
    usePublicBackgrounds(page, numLimit, bgType, selectedCategory);

  return (
    <>
      <div className="min-w-[350px] flex items-center justify-between gap-2 p-4">
        {children}
        <span className="text-sm">{title}</span>
        <Select onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="max-w-[160px] h-8">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="focus:ring-0">
            <SelectItem value="All">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center">
        {isFetching ? (
          <Loading color="#FFFFFF" />
        ) : isError ? (
          <div>Error: {error?.message}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 px-4">
              {data?.items?.map((item, index) => (
                <div
                  className={classNames(
                    "cursor-pointer transition ease-in-out delay-550 duration-300 hover:scale-105",
                    "relative flex flex-col aspect-[1/1.4142] items-center justify-center bg-secondary/50",
                    "border-2 shadow-sm"
                  )}
                  onClick={() => onAction(item)}
                  key={index}
                >
                  <Image
                    alt={"background"}
                    src={item?.url}
                    loading="lazy"
                    width={158}
                    height={224}
                  />
                  {isShowCheck && selectedBackground === item.url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/15 brightness-150 z-20">
                      <Check
                        size={40}
                        className="fill-green-500"
                        weight="bold"
                      />
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
                  if (!isPlaceholderData && data?.items?.length === numLimit) {
                    setPage((old) => old + 1);
                  }
                }}
                disabled={isPlaceholderData || data?.items?.length! < numLimit}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
