"use client";

import { Checkbox, Input } from "@/components/controls";
import { useI18n } from "@/config/i18n/client";
import { registerDto, registerSchema } from "@/interfaces/user";
import { useRegister } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";

export const RegisterForm = () => {
  const t = useI18n();
  const { register, isPending, error, isSuccess } = useRegister();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext<registerDto>();
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<registerDto>({
  //   defaultValues: {
  //     firstname: "",
  //     lastname: "",
  //     email: "",
  //     password: "",
  //   },
  //   resolver: zodResolver(registerSchema),
  // });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const resp = await register(data);
      if ("error_code" in resp) throw new Error(resp.detail);

      if (resp) {
        toast.success("OTP code has been sent.")
        router.push("/auth/signup/verify-email");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  });

  return (
    <>
      <form className="flex-1 " method="POST" onSubmit={onSubmit}>
        <h3 className="mb-10 text-center text-2xl font-bold">
          {t("auth.registertitle")}
        </h3>
        <div className="flex flex-col gap-5 text-sm">
          <div className="flex space-x-6">
            <Controller
              control={control}
              name="firstname"
              render={({ field }) => (
                <Input
                  id="firstname"
                  type="firstname"
                  label={t("user.firstname")}
                  className="rounded-md"
                  placeholder={t("user.firstnameplaceholder")}
                  required
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="lastname"
              render={({ field }) => (
                <Input
                  id="lastname"
                  type="lastname"
                  label={t("user.lastname")}
                  className="rounded-md"
                  placeholder={t("user.lastnameplaceholder")}
                  required
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                id="email"
                label={t("auth.username")}
                className="rounded-md"
                placeholder={t("auth.usernameplaceholder")}
                required
                {...field}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                id="password"
                type="password"
                label={t("auth.password")}
                className="rounded-md"
                placeholder={t("auth.passwordplaceholder")}
                required
                {...field}
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          {error && <p className="text-red-500">{error.message}</p>}
          {/* {isSuccess && (
            <p className="text-primary">{t("auth.registersuccess")}</p>
          )} */}

          <div className="flex justify-between">
            <Checkbox className="h-8 w-8" label={t("auth.registerpolicy")} />
          </div>
        </div>
        <div className="mt-6">
          <button
            disabled={isPending}
            className="shadow-submit dark:shadow-submit-dark 
            flex w-full items-center justify-center 
            bg-primary px-9 py-2 text-base font-medium 
            text-white duration-300 hover:bg-primary/90 rounded-lg"
          >
            {t("auth.signup")}
          </button>
        </div>
        {/* <Divider className="mt-5 text-base font-medium text-body-color">
          Or Sign up with
        </Divider> */}
      </form>
      {/* <div className="mt-5 flex flex-row justify-center">
        <div className="flex flex-row gap-5">
          <Button
            variant="outlined"
            className="border-slate-300 hover:border-slate-300 px-2 min-w-0 rounded-[12px] shadow-lg"
          >
            <Image
              src="/icons/google.svg"
              alt="facebook"
              width={30}
              height={30}
            />
          </Button>
          <Button
            variant="outlined"
            className="border-slate-300 hover:border-slate-300 px-2 min-w-0 rounded-[12px] shadow-lg"
          >
            <Image
              src="/icons/facebook.svg"
              alt="facebook"
              width={30}
              height={30}
            />
          </Button>
          <Button
            variant="outlined"
            className="border-slate-300 hover:border-slate-300 px-2 min-w-0 rounded-[12px] shadow-lg"
          >
            <Image
              src="/icons/linkedin.svg"
              alt="linkedin"
              width={30}
              height={30}
            />
          </Button>
        </div>
      </div> */}
      <p className="mt-5 text-center text-base font-medium text-body-color">
        {t("auth.haveaccount")}{" "}
        <Link href="/auth/signin" className="text-primary hover:underline">
          {t("auth.signin")}
        </Link>
      </p>
    </>
  );
};
