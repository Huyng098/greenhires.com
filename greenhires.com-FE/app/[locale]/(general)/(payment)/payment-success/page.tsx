"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState<number>(5);
  var timer: string | number | NodeJS.Timeout | undefined;
  useEffect(() => {
    timer = setInterval(() => {
      setSeconds(seconds - 1);

      if (seconds === 0) {
        router.push("/");
        setSeconds(0)
        clearInterval(timer)
      }
    }, 1050);
    return () => clearInterval(timer);
  });

  return (
    <div className="flex flex-col gap-5 h-[calc(100vh-180px)] justify-center items-center text-primary-main mb-10 pt-[180px] min-h-full">
      <div className="py-5 px-20 rounded-xl shadow-2xl flex flex-col gap-4">
        <div className="flex gap-1">
          <span className="font-semibold text-secondary-main text-3xl">
            Successful
          </span>
          <span className="font-semibold text-3xl">Payment</span>
        </div>
        <div>
          <p className="text-center">Thank you for using our service!</p>
          <p className="text-center">You will be redirected to Homepage in</p>
        </div>
        <p className="text-center font-semibold">{seconds}s</p>
        <Button
          onClick={() => router.push("/")}
          className="bg-primary-main hover:bg-primary-main/85"
        >
          Go to Homepage now
        </Button>
      </div>
    </div>
  );
}
