"use client";
import { Input } from "@/components/controls";
import { useI18n } from "@/config/i18n/client";
import { forgotPasswordDto, forgotPasswordSchema } from "@/interfaces/user";
import { useForgotPassword } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

export const ForgotPassword = () => {
  const t = useI18n();
  const { forgotPassword, isSuccess } = useForgotPassword();
  const { control, handleSubmit } = useForm<forgotPasswordDto>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await forgotPassword(data);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <section
        id="forgot"
        className="flex justify-center items-center bg-white"
      >
        {isSuccess ? (
          <div className="text-base font-light my-40">
            <div className="flex items-center justify-center">
              <svg
                width="15"
                height="15"
                viewBox="0 0 25 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.4911 18.2766L0.366101 10.1516C-0.122034 9.66351 -0.122034 8.87206 0.366101 8.38387L2.13383 6.6161C2.62196 6.12792 3.41346 6.12792 3.9016 6.6161L9.37499 12.0894L21.0984 0.366101C21.5865 -0.122034 22.378 -0.122034 22.8661 0.366101L24.6339 2.13387C25.122 2.62201 25.122 3.41346 24.6339 3.90165L10.2589 18.2767C9.77069 18.7648 8.97924 18.7648 8.4911 18.2766Z"
                  fill="black"
                />
              </svg>
              <p className="ml-1"> {t("forgotpassword.titlesuccess")} </p>
            </div>
            <p className="max-w-3xl text-left">
              {" "}
              {t("forgotpassword.detailsuccess")}{" "}
            </p>
          </div>
        ) : (
          <div className="my-40">
            <p className="w-3/4 text-base font-light">
              {" "}
              {t("forgotpassword.detail")}{" "}
            </p>
            <form className="my-2 w-2/3" onSubmit={onSubmit}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      label={t("auth.username")}
                      required
                      placeholder={t("auth.usernameplaceholder")}
                      className="w-[460px] rounded-md"
                    />
                    {fieldState.error?.message && (
                      <span className="text-red-700 px-2 capitalize font-semibold">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </>
                )}
              />

              <div className="mt-9 w-1/4">
                <button
                  className="bg-primary border border-primary
                px-3 py-2 w-full text-white rounded-md uppercase"
                  type="submit"
                >
                  {t("forgotpassword.button")}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </>
  );
};
