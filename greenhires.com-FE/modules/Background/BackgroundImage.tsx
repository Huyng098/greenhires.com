"use client";

import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Category } from "@/interfaces/general/category";
import { addBackgroundSchema } from "@/interfaces/sample/sample";
import { useUploadBackgroundImage } from "@/services/ai/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UploadFilePond } from "../Upload/uploadFile";
import { MyBackgrounds } from "./MyBackground";
interface UploadBackgroundProps {
  categories: Category[];
}

export default function UploadBackground({
  categories,
}: UploadBackgroundProps) {
  const { control, handleSubmit, resetField } = useForm<
    z.infer<typeof addBackgroundSchema>
  >({
    defaultValues: { files: [], category_ids: [] },
    resolver: zodResolver(addBackgroundSchema),
  });
  const { uploadBg, isPending } = useUploadBackgroundImage();
  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    data.category_ids.forEach((category_id) => {
      formData.append("category_ids", category_id);
    });
    data.files.forEach((file: File) => {
      formData.append("images", file);
    });
    toast.promise(uploadBg(formData), {
      loading: "Uploading background image...",
      success: () => {
        return `Upload background image successfully!`;
      },
      error: "Error",
      finally: () => {
        resetField("files");
      },
    });
  });
  return (
    <div className="flex w-full justify-between">
      <MyBackgrounds categories={categories} />
      <form
        onSubmit={onSubmit}
        className="bg-sky-50 h-[calc(100vh-60px)] w-2/3 overflow-y-scroll"
      >
        <div className="flex justify-center items-center rounded-lg p-10">
          <div className="w-full">
            <p className="text-primary-main font-bold text-center text-lg mb-20">
              Background Image
            </p>
            <Controller
              name="files"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <UploadFilePond
                    files={field.value}
                    maxFiles={10}
                    allowMultiple={true}
                    acceptFileTypes={["image/*"]}
                    onChange={(fileItems) => {
                      field.onChange(
                        fileItems.map((fileItem) => fileItem.file as File)
                      );
                    }}
                  />
                  {fieldState.error?.message && (
                    <p className="text-red-700 text-sm font-bold">
                      {fieldState.error?.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end gap-5 mx-10 items-center">
          <Controller
            name="category_ids"
            control={control}
            render={({ field, fieldState }) => (
              <div className="w-[300px]">
                <MultipleSelector
                  defaultOptions={categories.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                  onChange={(selected) =>
                    field.onChange(selected.map((item) => item.value))
                  }
                  placeholder="Select categories you like..."
                  emptyIndicator={
                    <p className="text-center text-base leading-10 text-gray-600 dark:text-gray-400">
                      No results found.
                    </p>
                  }
                />
                {fieldState.error?.message && (
                  <p className="text-red-700 text-sm font-bold">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="rounded-2xl disabled:opacity-50
         bg-primary-main hover:bg-primary-main/85"
          >
            <p className="text-white">Submit</p>
          </Button>
        </div>
      </form>
    </div>
  );
}
