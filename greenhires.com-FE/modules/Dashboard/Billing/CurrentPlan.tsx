"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SubscriptionDto } from "@/interfaces/payment/payment";
import { cancelSubscription } from "@/services/payment/api";

import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  current_subscript: SubscriptionDto;
}

export default function CurrentPlan({ current_subscript }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const handleCancelSubscription = async (id: string) => {
    cancelSubscription(id).then((res) => {
      if ("error_code" in res) {
        toast.error(res.detail);
      } else {
        toast.success("Subscription canceled successfully");
        router.refresh();
      }
    });
  };
  return (
    <>
      <div className="flex flex-col gap-5 w-10/12 rounded-lg shadow-md px-9 py-16 border border-solid border-hoduc-bg-gray_darker bg-white ">
        <p className="font-bold text-xl">Current Plan</p>
        <div className="px-14 pt-4 pb-10 bg-[#f8f8f8] flex flex-col gap-4 rounded-lg">
          {"error_code" in current_subscript ? (
            <>
              <p className="font-medium">You do not have any subscription</p>
              <Button
                onClick={() => router.push("/pricing-plans")}
                className="bg-primary-main hover:bg-primary-main/85 w-1/4"
              >
                Subscribe
              </Button>
            </>
          ) : (
            <>
              <div>
                <p className="font-bold text-hoduc-text-dashboard_text">
                  Plan Name
                </p>
                <p className="font-bold text-primary-main text-xl">
                  {current_subscript.name}
                </p>
              </div>
              <div>
                <p className="font-bold text-hoduc-text-dashboard_text">
                  Duration
                </p>
                <p className="font-bold text-primary-main text-xl">
                  {current_subscript.duration.value}{" "}
                  {current_subscript.duration.unit}
                </p>
              </div>
              <div>
                <p className="font-bold text-hoduc-text-dashboard_text">
                  Plan Cost
                </p>
                <p className="font-bold text-primary-main text-xl">
                  {current_subscript?.price?.amount}{" "}
                  {current_subscript?.price?.currency}
                </p>
              </div>
              <div>
                <p className="font-bold text-primary-main text-xl">
                  Active until{" "}
                  {dayjs(current_subscript.nextPaymentDate).format(
                    "MMMM D, YYYY"
                  )}
                </p>
                <p className="font-semibold text-hoduc-text-dashboard_text text-sm">
                  We will send you notification upon subscription ends
                </p>
              </div>
              <div className=" flex gap-8">
                <Progress
                  indicatorClassName={`${current_subscript.days_remaining_percentage < 0.5 ? "bg-hoduc-bg-error" : "bg-primary-main"}`}
                  value={
                    100 - current_subscript.days_remaining_percentage * 100
                  }
                  className={`bg-[#EAEAEA] w-1/3 `}
                ></Progress>
                <p
                  className={`font-semibold  text-sm text-hoduc-text-dashboard_text`}
                >
                  {Math.ceil(current_subscript.days_left)} days left
                </p>
              </div>
              <div className="flex w-1/3 gap-5">
                <Button
                  onClick={() => router.push("/pricing-plans")}
                  className="bg-primary-main hover:bg-primary-main/85 "
                >
                  Upgrade Plan
                </Button>
                <Button onClick={() => setOpen(!open)} variant={"outline"}>
                  Cancel subscription
                </Button>
              </div>
            </>
          )}
        </div>
        {"error_code" in current_subscript ? (
          <></>
        ) : (
          <>
            <p className="font-bold text-xl">Payment Method</p>
            <div className="p-4 bg-[#f8f8f8] flex justify-between items-center rounded-lg">
              <div className="flex gap-3 justify-center items-center">
                {current_subscript.info?.brand === "visa" ? (
                  <Image
                    src={"/images/payment/visa.svg"}
                    alt="Credit Card"
                    width={40}
                    height={40}
                  />
                ) : current_subscript.info?.brand === "mastercard" ? (
                  <Image
                    src={"/images/payment/master_card.svg"}
                    alt="Credit Card"
                    width={40}
                    height={40}
                  />
                ) : current_subscript.info?.brand === "zalopay" ? (
                  <Image
                    src={"/images/payment/zalopay.svg"}
                    alt="Zalopay"
                    width={40}
                    height={40}
                  />
                ) : (
                  <Image
                    src={"/images/payment/jcb.svg"}
                    alt="Credit Card"
                    width={40}
                    height={40}
                  />
                )}
                **** **** **** {current_subscript.info?.last4}
              </div>
              <Button variant={"outline"}>Change</Button>
            </div>
          </>
        )}
      </div>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-md my-5">
              Do you want to cancel this subscription?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(!open)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpen(!open);
                handleCancelSubscription(current_subscript.id);
              }}
              className="bg-hoduc-bg-error hover:bg-hoduc-bg-error/85"
            >
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
