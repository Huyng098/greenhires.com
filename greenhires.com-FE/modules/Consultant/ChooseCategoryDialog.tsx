import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Category } from "@/interfaces/general/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const selectedCategoriesDto = z.object({
  categories_selected: z
    .array(z.string())
    .min(1, "Please select at least one category"),
});

export const ChooseCategoryDialog = ({
  categories,
  defaultCategories,
  action,
  children,
  text,
}: {
  categories: Category[];
  defaultCategories: string[];
  action: (categories: string[]) => void;
  children: React.ReactNode;
  text?: string;
}) => {
  const { handleSubmit, control } = useForm<
    z.infer<typeof selectedCategoriesDto>
  >({
    resolver: zodResolver(selectedCategoriesDto),
    defaultValues: {
      categories_selected: defaultCategories,
    },
  });
  const [open, setOpen] = useState(false);
  const onSubmit = (data: { categories_selected: string[] }) => {
    action(data.categories_selected);
    setOpen(false);
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Choose categories</AlertDialogTitle>
          <AlertDialogDescription>
            Choose the categories that this sample belongs to.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              name="categories_selected"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <MultipleSelector
                    defaultOptions={categories.map((category) => ({
                      label: category.name,
                      value: category.id,
                    }))}
                    onChange={(selected) =>
                      field.onChange(selected.map((item) => item.value))
                    }
                    value={field.value.map((id) => ({
                      label: categories.find((category) => category.id === id)!
                        .name,
                      value: id,
                    }))}
                    placeholder="Select categories you like..."
                    emptyIndicator={
                      <p className="text-center text-base leading-10 text-gray-600 dark:text-gray-400">
                        No results found.
                      </p>
                    }
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldState.error.message}{" "}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <AlertDialogFooter className="flex mt-4 gap-4 sm:justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <button
              type="submit"
              className="bg-primary-main hover:bg-primary-main/85 text-white px-3 py-[5px] rounded-md"
            >
              {text || "Save"}
            </button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
