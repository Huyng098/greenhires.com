import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type loginDto = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstname: z.string().min(3),
  lastname: z.string().min(3),
});

export type registerDto = z.infer<typeof registerSchema>;

export type VerifyEmailDto = {
  email: string
  token: string
}

export type VerifyEmailForm = {
  token: string
}

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type resetPasswordDto = z.infer<typeof resetPasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type forgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
