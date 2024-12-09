import { z } from "zod";
import { defaultItem, itemSchema } from "../base";

export const certificationSchema = itemSchema.extend({
  title: z.string(),
  issuer: z.string(),
  date: z.date().or(z.string()).optional(),
  summary: z.string(),
});

export type Certification = z.infer<typeof certificationSchema>;

export const certificationDefault: Certification = {
  ...defaultItem,
  title: "",
  issuer: "",
  date: undefined,
  summary: "",
};
