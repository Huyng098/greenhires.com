import { Loading } from "@/components/Common/Loading";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LAYOUT_KEY } from "@/constants/query_key";
import { Category } from "@/interfaces/general/category";
import useScreenSize from "@/lib/hooks/useScreenSize";
import { getAllPublicSamples } from "@/services/template/api";
import { closestNumber } from "@/utils/canva/closest_number";
import { Check } from "@phosphor-icons/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";

interface ApplyLayoutProps {
  size: number;
  categories: Category[];
}

export const ApplyLayout = ({ size, categories }: ApplyLayoutProps) => {
  const screenSize = useScreenSize();
  const num_grid_col = Math.floor(((size / 100) * screenSize.width - 28) / 158);
  const numLimit = closestNumber(26, num_grid_col);
  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedLayout, setSelectedLayout] = useState<string>("");
  const { isError, error, data, isFetching, isPlaceholderData } = useQuery({
    queryKey: [...LAYOUT_KEY, numLimit, page, selectedCategory],
    queryFn: async () => {
      return await getAllPublicSamples(
        page,
        numLimit,
        "layout",
        selectedCategory
      );
    },
    placeholderData: keepPreviousData,
  });
  return (
    <>
      <div className="min-w-[350px] flex items-center justify-between gap-2 p-4">
        <p className="text-md font-medium"> Switch Layout</p>
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
        {isFetching ? (
          <Loading color="#FFFFFF" />
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 px-4">
              {data?.items.map((item, index) => (
                <div
                  key={index}
                  className={classNames(
                    "cursor-pointer transition ease-in-out delay-550 duration-300 hover:scale-105",
                    "rounded relative border flex flex-col aspect-[1/1.4142] items-center justify-center bg-secondary/50"
                  )}
                  onClick={() => setSelectedLayout(item.id)}
                >
                  <Image
                    alt={`Layout ${item}`}
                    src={item.variants[0].imgs[0]}
                    className={classNames(
                      "cursor-pointer rounded transition ease-in-out delay-550 duration-300 hover:scale-105",
                      "relative flex flex-col aspect-[1/1.4142] items-center justify-center bg-secondary/50"
                    )}
                    loading="lazy"
                    width={158}
                    height={224}
                  />
                  {selectedLayout === item.id && (
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
                  if (!isPlaceholderData && data?.items.length === numLimit) {
                    setPage((old) => old + 1);
                  }
                }}
                disabled={isPlaceholderData || data?.items.length! < numLimit}
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
