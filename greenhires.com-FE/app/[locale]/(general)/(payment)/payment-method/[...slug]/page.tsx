import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: { slug: string[] };
  searchParams?: Record<string, any>;
}

export default async function PaymentResult({
  params,
  searchParams,
}: PageProps) {
  const slug = params.slug;

  if (slug?.[0] === "vnpay") {
    const paymentStatus = searchParams?.vnp_ResponseCode === "00" ? "success" : "fail"
    const plan = slug?.[1]
    redirect(
      `/payment-method?plan=${plan}&paymentStatus=${paymentStatus}`
    );
  }
  return <div></div>;
}
