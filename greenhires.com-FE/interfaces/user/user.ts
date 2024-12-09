import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  picture: z.string().url(),
  cover_picture: z.string().url().optional(),
  provider: z.enum(["email", "google", "facebook", "linkedin"]),
  role: z.enum([
    "superadmin",
    "admin",
    "consultant",
    "manager",
    "enduser",
    "client",
  ]),
  phone: z.string().optional(),
  theme: z
    .enum(["#f0f9ff", "#0000002B", "#A5ECCE6B", "#FFFFFF", "#2F566B"])
    .default("#f0f9ff"),
  address: z.string().optional(),
  gender: z.string().optional(),
  dob: z.date().optional(),
});

export type UserDto = z.infer<typeof userSchema>;

export const personalInforSchema = z.object({
  firstname: z.string().min(1, {
    message: "This field is required",
  }),
  lastname: z.string().min(1, {
    message: "This field is required",
  }),
  gender: z.enum(["M", "F", "O"]).optional(),
  dob: z.date().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, {
      message: "This field is required",
    }),
    new_password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters long",
      })
      .max(20, {
        message: "Password must be at most 20 characters long",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least 1 upper case character",
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: "Password must contain at least 1 upper case character",
      })
      .refine((value) => /\d/.test(value), {
        message: "Password must contain at least 1 numeric character",
      })
      .refine((value) => /[~`!@#$%^&*/()\-_+=\[\]|\;:"]/g.test(value), {
        message:
          'Password must contain at least 1 special character: ~`!@#$%^&*/()-_+=[]|;:"',
      }),
    confirm_password: z.string().min(1, {
      message: "This field is required",
    }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const addNewUserSchema = z
  .object({
    firstname: z.string().min(1, { message: "This field is required" }),
    lastname: z.string().min(1, { message: "This field is required" }),
    role: z.enum([
      "admin",
      "consultant",
      "superadmin",
      "manager",
      "client",
      "enduser",
    ]),
    address: z.string().optional(),
    email: z.string().email().min(1, { message: "This field is required" }),
    phone: z
      .string()
      .regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, {
        message: "Invalid Phone Number",
      })
      .optional(),
    gender: z.enum(["M", "F", "O"]).optional(),
    dob: z
      .date({
        required_error: "A date of birth is required.",
      })
      .optional(),
    password: z.string().min(6, {
      message: "Password have at least 6 characters",
    }),
    confirm_password: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const changeInforSchema = z.object({
  firstname: z.string().min(1, { message: "This field is required" }),
  lastname: z.string().min(1, { message: "This field is required" }),
  role: z.enum([
    "admin",
    "consultant",
    "superadmin",
    "manager",
    "client",
    "enduser",
  ]),
  address: z.string().optional(),
  phone: z.string().optional(),
  gender: z.optional(z.enum(["M", "F", "O"])),
  dob: z.optional(z.date()),
});

export enum UserRole {
  SuperAdmin = "superadmin",
  Admin = "admin",
  Consultant = "consultant",
  Client = "client",
  Manager = "manager",
  EndUser = "enduser",
}

export interface CanvaImage {
  id: string;
  url: string;
  type: "svg" | "image";
}
