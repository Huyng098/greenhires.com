"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addSampleSchema } from "@/interfaces/sample/sample";
import { useAddSample } from "@/services/sample/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "@phosphor-icons/react";
import classNames from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BaseCard } from "../Dashboard/Resumes/_components/base-card";
import {
  SAMPLE_TYPES,
  TEMPLATE_CANVA,
  TEMPLATE_LAYOUT,
} from "@/constants/dashboard";
import humanizeString from "humanize-string";
import { RESUME_DATA_SAMPLE } from "@/constants/sample";
import { getDefaultResumeCanva } from "@/constants/canva";

interface Props {
  selectedType: SAMPLE_TYPES;
}

export const CreateSampleCard = ({ selectedType }: Props) => {
  const form = useForm<z.infer<typeof addSampleSchema>>({
    resolver: zodResolver(addSampleSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof addSampleSchema>) {
    try {
      const resume_data =
        selectedType === TEMPLATE_LAYOUT || selectedType === TEMPLATE_CANVA
          ? RESUME_DATA_SAMPLE
          : undefined;
      console.log(resume_data);
      addSample({
        title: values.title,
        type: selectedType,
        resume_data,
        resume_canva:
          selectedType === TEMPLATE_LAYOUT || selectedType === TEMPLATE_CANVA
            ? getDefaultResumeCanva(0, undefined, "TemplateLayoutLayer")
            : undefined,
      });
      setOpen(!open);
    } catch (err) {
      console.log(err);
    }
  }

  const [open, setOpen] = useState<boolean>(false);
  const { addSample } = useAddSample();
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Form {...form}>
          <BaseCard
            onClick={() => setOpen(!open)}
            className="bg-background cursor-pointer flex flex-col justify-center"
          >
            <PlusCircle
              size={80}
              weight="light"
              color="#2F566B"
              style={{ marginTop: "20px" }}
            />
            <div
              className={classNames(
                "absolute inset-x-0 bottom-0 lg:z-10 flex flex-col justify-end space-y-0.5 p-4",
                "bg-gradient-to-t from-background/80 to-transparent rounded"
              )}
            >
              <h4 className="font-semibold text-left">
                Create new {humanizeString(selectedType)}
              </h4>
              <p className="text-xs opacity-75 text-left">
                Build {humanizeString(selectedType)}
              </p>
            </div>
          </BaseCard>

          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>
                  Create a new {humanizeString(selectedType)}
                </DialogTitle>
                <DialogDescription>
                  Start building your {humanizeString(selectedType)} by giving
                  it a name
                </DialogDescription>
              </DialogHeader>
              <div className="my-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          className="focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-primary-main hover:bg-primary-main/85"
                >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Form>
      </Dialog>
    </>
  );
};
