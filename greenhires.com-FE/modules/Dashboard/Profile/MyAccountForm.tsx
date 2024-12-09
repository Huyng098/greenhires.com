"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { personalInforSchema } from "@/interfaces/user";
import { cn } from "@/lib/utils";
import { useChangePersonalInfor } from "@/services/user";
import { useAuthStore } from "@/stores/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UploadModal } from "./UploadModal";

export default function MyAccountForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const user = useAuthStore()((state) => state.user);
  const { changePersonalInformation } = useChangePersonalInfor();
  const personalInforForm = useForm<z.infer<typeof personalInforSchema>>({
    resolver: zodResolver(personalInforSchema),
    defaultValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      address: user?.address || "",
      phone: user?.phone || "",
      gender: ["M", "F", "O"].includes(user?.gender || "")
        ? (user?.gender as "M" | "F" | "O")
        : undefined,
      dob: user?.dob ? new Date(user.dob) : undefined,
    },
  });

  function onSubmitChangePersonalInfor(
    values: z.infer<typeof personalInforSchema>
  ) {
    try {
      changePersonalInformation(values);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div className="flex flex-col gap-5 w-10/12 rounded-lg shadow-md px-9 py-16 border border-solid border-hoduc-bg-gray_darker">
        <div className="relative w-max">
          <Image
            src={user?.picture ?? "/images/editimage/user.png"}
            alt="Avatar"
            width={100}
            height={100}
            className="rounded-full"
            style={{ height: 100 }}
          />
          <button
            className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-white hover:bg-gray-100 border border-gray-600"
            title="Change photo"
            onClick={() => setModalOpen(true)}
          >
            <Image
              priority
              src="/icons/pencil.svg"
              height={16}
              width={16}
              alt="Pencil"
            />
          </button>
          {modalOpen && (
            <UploadModal open={modalOpen} onOpenChange={setModalOpen} />
          )}
        </div>
        <Form {...personalInforForm}>
          <p className="font-bold">Account Information</p>
          <form
            onSubmit={personalInforForm.handleSubmit(
              onSubmitChangePersonalInfor
            )}
            className="grid grid-cols-2 gap-8"
          >
            <FormField
              control={personalInforForm.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">First name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="focus-visible:ring-0  focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personalInforForm.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Last name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="focus-visible:ring-0  focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personalInforForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="focus-visible:ring-0  focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personalInforForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="focus-visible:ring-0  focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personalInforForm.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                      <SelectItem value="O">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={personalInforForm.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 flex justify-end">
              <Button
                type="submit"
                className="bg-primary-main hover:bg-cyan-800"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
