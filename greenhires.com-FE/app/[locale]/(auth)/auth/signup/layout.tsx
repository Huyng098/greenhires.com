"use client";
import { registerDto, registerSchema } from "@/interfaces/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function SignUpLayout({ children }: { children: ReactElement }) {
  const formMethod = useForm<registerDto>({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });
  return (
    <FormProvider {...formMethod}>
      <section
        className="z-10 h-full bg-cover bg-no-repeat"
        style={{ backgroundImage: 'url("/images/auth/left_sign_up.svg")' }}
      >
        {children}
      </section>
    </FormProvider>
  );
}
