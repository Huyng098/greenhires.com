"use client";

import { ChangePasswordByCode } from "@/modules/Auth/forgot-form/changePasswordByCode";
import Banner from "@/modules/Home/Banner";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ForgetPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  // Redirect the user to the forgot password page if the token is not present.
  useEffect(() => {
    if (!token) redirect("/auth/forgot-password");
  }, [token]);
  return (
    <>
      <Banner type="cv" />
      <ChangePasswordByCode token={token} />
    </>
  );
}
