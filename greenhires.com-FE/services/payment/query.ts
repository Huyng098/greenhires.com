"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrderPayPal, createPayment } from "./api";

export const useCreatePayment = () => {
  const router = useRouter();
  const { error, isPending, mutateAsync } = useMutation({
    mutationFn: createPayment,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
      router.replace(data.redirect_url);
    },
  });
  return { createPayment: mutateAsync, isPending, error };
};
export const useCreateOrderPayPal = () => {
  const { error, isPending, mutateAsync } = useMutation({
    mutationFn: createOrderPayPal,
    onSuccess: (data) => {
      if ("error_code" in data) {
        toast.error(data.detail);
        return;
      }
    },
  });
  return { initOrderPayPal: mutateAsync, isPayingPayPal: isPending, error };
};
