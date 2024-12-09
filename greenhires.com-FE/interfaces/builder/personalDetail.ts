import { z } from "zod";

export const basicsSchema = z.object({
  name: z.string().min(3).default("Personal Details"),
  firstname: z.string().min(3),
  lastname: z.string().min(3),
  headline: z.string().min(3),
  email: z.string().email(),
  phone: z.string(),
  country: z.string(),
  city: z.string(),
  address: z.string(),
  picture: z.string().url(),
});

export type Basics = z.infer<typeof basicsSchema>;

export const defaultBasics: Basics = {
  name: "Personal Details",
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  address: "",
  headline: "",
  picture: "",
};
