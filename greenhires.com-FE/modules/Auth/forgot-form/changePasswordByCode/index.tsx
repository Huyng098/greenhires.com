"use client";

import { Input } from "@/components/controls";
import { useI18n } from "@/config/i18n/client";
import { resetPasswordDto, resetPasswordSchema } from "@/interfaces/user";
import { useResetPassword } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

export const ChangePasswordByCode = ({ token }: { token: string }) => {
  const t = useI18n();
  const { resetPassword, isSuccess } = useResetPassword();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordDto>({
    defaultValues: { token: token, password: "", confirmPassword: "" },
    resolver: zodResolver(resetPasswordSchema),
  });
  const onSubmit = handleSubmit(async (data) => {
    try {
      resetPassword(data);
    } catch (error) {
      console.log(error);
    }
  });

  if (isSuccess) {
    return (
      <div className="w-full flex flex-col items-center gap-16 my-28">
        <div className="font-light text-base text-center">
          <h2>{t("auth.reset_password_success")}!</h2>
          <h2>{t("auth.reset_password_success_detail")}.</h2>
        </div>
        <div>
          <Link href="/auth/signin">
            <button
              className="bg-primary hover:bg-sky-900 border border-primary p-2 w-full text-white rounded-md uppercase"
              type="submit"
            >
              {t("auth.signin")}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section id="reset" className="flex items-center justify-center">
      <div className="text-left my-28">
        <h2 className="text-xl font-light">{t("auth.resetpassword")}</h2>
        <form onSubmit={onSubmit}>
          <div className="flex space-x-20 mt-4 ">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    type="password"
                    {...field}
                    label={t("auth.password")}
                    required
                    placeholder={t("auth.passwordplaceholder")}
                    className="rounded-md"
                  />
                </>
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    type="password"
                    {...field}
                    label={t("auth.confirmpassword")}
                    required
                    placeholder={t("auth.confirmpasswordplaceholder")}
                    className="rounded-md"
                  />
                </>
              )}
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-red-700 px-2 capitalize font-semibold">
              {errors.confirmPassword?.message}
            </span>
          )}
          <div className="mt-9">
            <button
              className="bg-primary border border-primary
                  py-2 w-1/6 text-white rounded-md uppercase"
              type="submit"
            >
              {t("auth.confirmChangePassword")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
