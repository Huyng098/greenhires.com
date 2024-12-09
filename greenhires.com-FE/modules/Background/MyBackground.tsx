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
import { Category } from "@/interfaces/general/category";
import { useDeleteBackgroundImage } from "@/services/ai/query";
import { useMyBackgrounds } from "@/services/template/query";
import { Trash } from "@phosphor-icons/react";
import classNames from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

interface BackgroundActionProps {
  children?: React.ReactNode;
  categories: Category[];
}

const DeleteDialog = dynamic(
  () =>
    import("@/components/Common/GeneralDialog").then(
      (module) => module.GeneralDialog
    ),
  { ssr: false }
);
export const MyBackgrounds = ({ categories }: BackgroundActionProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bgId, setBgId] = useState<string | undefined>();
  const { deleteBg } = useDeleteBackgroundImage();
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const numLimit = 20;
  const [page, setPage] = useState(0);
  const { data, isFetching, isError, error, isPlaceholderData } =
    useMyBackgrounds(page, numLimit, selectedCategory);
  const onDelete = async () => {
    if (bgId) {
      await deleteBg(bgId);
      setOpenDeleteDialog(false);
    }
  };
  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center gap-4">
          <p className="text-xl">My Backgrounds</p>
          <Select onValueChange={(value) => setSelectedCategory(value)}>
            <SelectTrigger className="w-[160px] h-8">
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
        <div className="flex h-full overflow-scroll flex-col gap-4 justify-center items-center">
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
                      "relative transition ease-in-out delay-550 duration-300 hover:scale-105",
                      "flex flex-col aspect-[1/1.4142] items-center justify-center bg-secondary/50"
                    )}
                    key={index}
                  >
                    <Image
                      alt={"background"}
                      src={item?.url}
                      loading="lazy"
                      width={190}
                      height={268}
                    />
                    <button
                      onClick={() => {
                        setBgId(item.id);
                        setOpenDeleteDialog(true);
                      }}
                      className="text-secondary-main absolute top-[5px] right-[4px] hover:text-red-600"
                    >
                      <Trash size={20} weight="regular" />
                    </button>
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
                    if (
                      !isPlaceholderData &&
                      data?.items?.length === numLimit
                    ) {
                      setPage((old) => old + 1);
                    }
                  }}
                  disabled={
                    isPlaceholderData || data?.items?.length! < numLimit
                  }
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {openDeleteDialog && (
        <DeleteDialog
          title={`Are you sure you want to delete this background image?`}
          description="This action cannot be undone, and it will be permanently deleted."
          cancelText="Cancel"
          confirmText="Delete"
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          handleConfirm={onDelete}
        />
      )}
    </>
  );
};
