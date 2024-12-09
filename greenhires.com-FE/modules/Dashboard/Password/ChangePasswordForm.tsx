"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePasswordSchema } from "@/interfaces/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isArray } from "lodash";
import { Box, Paper } from "@mui/material";
import { useChangePassword } from "@/services/user";

type ChangePasswordFormType = {
  bgcolor?: string;
  hasSubmitButton?: boolean;
};

export default function ChangePasswordForm({
  bgcolor,
  hasSubmitButton = true,
}: ChangePasswordFormType) {
  const { changePassword } = useChangePassword();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    mode: "all",
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    criteriaMode: "all",
  });

  function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    changePassword(values);
  }
  return (
    <>
      <div
        style={{ backgroundColor: bgcolor, width: "100%" }}
        className="flex flex-col gap-5 w-10/12 rounded-lg shadow-md px-9 py-16 border border-solid border-hoduc-bg-gray_darker"
      >
        <p className="font-bold">Change Your Password</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Current password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">New password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <p className="font-bold">Password requirements</p>
              <p className="font-semibold text-gray-500 text-sm">
                Ensure that these requirements are met:
              </p>
              <ul className="max-w-md space-y-1 ml-7 font-semibold text-gray-500 list-disc text-sm list-inside dark:text-gray-400">
                <li
                  className={
                    form.formState.dirtyFields.new_password
                      ? form.formState.errors.new_password?.types?.hasOwnProperty(
                          "too_small"
                        ) ||
                        form.formState.errors.new_password?.types?.hasOwnProperty(
                          "too_big"
                        )
                        ? "text-red-500"
                        : "text-hoduc-bg-success"
                      : ""
                  }
                >
                  Between 6 and 20 characters long
                </li>
                <li
                  className={
                    form.formState.dirtyFields.new_password
                      ? form.formState.errors.new_password?.types?.hasOwnProperty(
                          "invalid_string"
                        )
                        ? "text-red-500"
                        : "text-hoduc-bg-success"
                      : ""
                  }
                >
                  Contains at least 1 upper case character
                </li>
                <li
                  className={
                    form.formState.dirtyFields.new_password
                      ? form.formState.errors.new_password?.types?.custom
                          ?.toString()
                          .includes(
                            "Password must contain at least 1 numeric character"
                          )
                        ? "text-red-500"
                        : "text-hoduc-bg-success"
                      : ""
                  }
                >
                  Contains at least 1 numeric character
                </li>
                <li
                  className={
                    form.formState.dirtyFields.new_password
                      ? form.formState.errors.new_password?.types?.custom
                          ?.toString()
                          .includes(
                            'Password must contain at least 1 special character: ~`!@#$%^&*/()-_+=[]|;:"'
                          )
                        ? "text-red-500"
                        : "text-hoduc-bg-success"
                      : ""
                  }
                >
                  Contains at least 1 special character: ~`!@#$%^&*/()-_+={}
                  []|\;:"
                </li>
              </ul>
            </div>
            {hasSubmitButton && (
              <div className="flex gap-5">
                <Button
                  type="submit"
                  className="bg-primary-main hover:bg-cyan-800"
                >
                  Save change
                </Button>
                <Button type="button" variant={"outline"}>
                  Cancel
                </Button>
              </div>
            )}
            <Box
              width={"100%"}
              className="flex items-center gap-5 justify-end mt-5"
            >
              <Paper
                elevation={1}
                sx={{ width: "82px", height: "40px", bgcolor: "#EAEAEA" }}
              >
                <Button
                  type="submit"
                  className="bg-primary-main hover:bg-cyan-800 w-[82px] h-[40px]"
                >
                  Save
                </Button>
              </Paper>
              <Paper
                elevation={1}
                sx={{ width: "82px", height: "40px", bgcolor: "#EAEAEA" }}
              >
                <Button
                  type="button"
                  className="bg-transparent text-black hover:bg-transparent"
                >
                  Cancel
                </Button>
              </Paper>
            </Box>
          </form>
        </Form>
      </div>
    </>
  );
}
