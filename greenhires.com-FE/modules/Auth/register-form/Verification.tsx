"use client";
import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Box, Typography, Stack } from "@mui/material";
import OTPVerify from "./OTPVerify";
import { useForm, useFormContext } from "react-hook-form";
import { registerDto, VerifyEmailForm } from "@/interfaces/user";
import { useRouter, useSearchParams } from "next/navigation";
import { resendVerifyEmail, verifyEmail } from "@/services/auth/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const TIMER = 59;

const Verification: React.FC = () => {
  const router = useRouter();

  const verifyEmailMutate = useMutation({
    mutationFn: verifyEmail,
  });

  const resendVerifyMutate = useMutation({
    mutationFn: resendVerifyEmail,
  });

  const [timer, setTimer] = useState<number>(TIMER);
  const [isResendAvailable, setIsResendAvailable] = useState<boolean>(false);
  const { getValues } = useFormContext<registerDto>();
  const searchParams = useSearchParams();
  const { control, handleSubmit, resetField } = useForm<VerifyEmailForm>();

  const email = getValues("email") || searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email) {
      router.push("/auth/signup");
    }
  }, [email]);

  useEffect(() => {
    if (token) {
      resetField("token", { defaultValue: token });
    }
  }, [token]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendAvailable(true);
    }
  }, [timer]);

  const handleVerify = async (formValues: VerifyEmailForm) => {
    try {
      const payload = {
        token: formValues.token,
        email: email!,
      };
      const resp = await verifyEmailMutate.mutateAsync(payload);
      if ("error_code" in resp) throw new Error(resp.error_code);

      if (resp.message) {
        toast.success(resp.message);
        router.push("/auth/signin");
      }
    } catch (error) {
      toast.error("Verify fail, please try again !!");
    }
  };

  const handleResendVerifyEmail = async () => {
    try {
      setTimer(TIMER);
      setIsResendAvailable(false);
      if (email) {
        const resp = await resendVerifyMutate.mutateAsync({ email });
        if ("error_code" in resp) throw new Error(resp.error_code);

        if (resp.message) {
          toast.success(resp.message);
        }
      }
    } catch (error) {
      toast.error("Resend fail, please try again !!");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleVerify)}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
        <Box className="text-end">
          <Button
            onClick={() => router.push("/auth/signup")}
            className="text-blue-500 cursor-pointer py-0"
          >
            Back
          </Button>
        </Box>
        <Stack gap={2} className="text-center">
          <Typography variant="h5" className="font-semibold">
            Email <span className="text-secondary-main">Verification</span>
          </Typography>
          <Typography variant="body1" className="text-gray-600 ">
            A six-digit verification code has been sent to your email address:
            <strong>&nbsp;{email}</strong>
          </Typography>

          <OTPVerify control={control} name="token" />

          <Stack>
            <Typography variant="body2" className="text-gray-600">
              Didn’t receive the code?
            </Typography>
            {isResendAvailable ? (
              <Box>
                <Button
                  onClick={handleResendVerifyEmail}
                  className="text-blue-500 cursor-pointer py-0"
                >
                  Resend Code
                </Button>
              </Box>
            ) : (
              <span className="text-blue-500 text-sm">
                Resend Code 0:{timer < 10 ? `0${timer}` : timer}
              </span>
            )}
          </Stack>

          <Button
            variant="contained"
            type="submit"
            className=" bg-secondary-main hover:bg-[#06B2B93B] w-auto"
          >
            Verify & Proceed
          </Button>
        </Stack>
      </div>
    </Box>
  );
};

export default Verification;
