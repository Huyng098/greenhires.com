"use client";

import { Checkbox, Input, commonStyles } from "@/components/controls";
import { useI18n } from "@/config/i18n/client";
import { loginDto, loginSchema } from "@/interfaces/user";
import { useLogin } from "@/services/auth";
import {
  loginWithFacebook,
  loginWithGoogle,
  loginWithLinkedin,
} from "@/services/auth/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Divider, IconButton, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const LoginForm = () => {
  const { login, isPending, error } = useLogin(false);
  const t = useI18n();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<loginDto>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      login(data);
    } catch (error) {
      console.log(error);
    }
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginWithGoogle = async () => {
    window.location.assign(await loginWithGoogle());
  };

  const handleLoginWithFacebook = async () => {
    window.location.assign(await loginWithFacebook());
  };

  const handleLoginWithLinkedin = async () => {
    window.location.assign(await loginWithLinkedin());
  };
  return (
    <>
      <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
        {t("auth.signintitle")}
      </h3>
      <p className="mb-4 text-center text-base font-medium text-body-color">
        {t("auth.signinsubtitle")}
      </p>
      <form className="flex-1" method="POST" onSubmit={onSubmit}>
        <div className="flex flex-col gap-5 text-sm">
          <Controller
            control={control}
            name="username"
            defaultValue=""
            render={({ field }) => (
              <Input
                id="username"
                label={t("auth.username")}
                className="rounded-md"
                placeholder={t("auth.usernameplaceholder")}
                required
                {...field}
              />
            )}
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
          <div className="m-0 flex flex-col">
            <Controller
              control={control}
              name="password"
              defaultValue=""
              render={({ field }) => (
                <TextField
                  id="password"
                  label={t("auth.password")}
                  className="rounded-md w-full bg-white"
                  size="small"
                  type={showPassword ? "text" : "password"}
                  sx={{ ...commonStyles.focusedFieldset }}
                  placeholder={t("auth.password")}
                  required
                  {...field}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-red-500">{error.message}</p>}
          <div className="flex justify-between">
            <Checkbox label={t("auth.savepassword")} />
            <Link
              className="text-sm font-medium text-primary hover:underline"
              href={"/auth/forgot-password"}
            >
              {t("auth.forgotpassword")}
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <button
            disabled={isPending}
            className="shadow-submit dark:shadow-submit-dark flex w-full 
            items-center justify-center rounded-md bg-primary-main px-9 py-2 text-base 
            font-medium text-white duration-300 hover:bg-primary-main/90"
          >
            {t("auth.signin")}
          </button>
        </div>
      </form>
      <p className="mt-5 text-center text-base font-medium text-body-color">
        {t("auth.notaccount")}{" "}
        <Link href="/auth/signup" className="text-primary hover:underline">
          {t("auth.signup")}
        </Link>
      </p>
      <Divider className="text-base font-medium text-body-color">OR</Divider>
      <div className="flex flex-col mt-6">
        <button
          onClick={() => handleLoginWithGoogle()}
          className="border-stroke dark:text-body-color-dark dark:shadow-two mb-6 flex w-full items-center justify-center rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none"
        >
          <span className="mr-3">
            <Image
              src="/icons/google.svg"
              alt="google"
              width={20}
              height={20}
            />
          </span>
          {t("auth.signingoogle")}
        </button>
        <button
          onClick={() => handleLoginWithLinkedin()}
          className="border-stroke dark:text-body-color-dark dark:shadow-two mb-6 flex w-full items-center justify-center rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none"
        >
          <span className="mr-3">
            <Image
              src="/icons/linkedin.svg"
              alt="linkedin"
              width={30}
              height={30}
            />
          </span>
          {t("auth.signinlinkedin")}
        </button>
        {/* <button
          onClick={() => handleLoginWithFacebook()}
          className="border-stroke dark:text-body-color-dark dark:shadow-two flex w-full items-center justify-center rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none"
        >
          <span className="mr-3">
            <Image
              src="/icons/facebook.svg"
              alt="facebook"
              width={30}
              height={30}
            />
          </span>
          {t("auth.signinfacebook")}
        </button> */}
      </div>
    </>
  );
};
