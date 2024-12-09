import { z } from "zod";
import { defaultItem, itemSchema } from "../base";

export const educationSchema = itemSchema.extend({
  school: z.string(),
  major: z.string(),
  typeOfStudy: z.string(),
  yearGraduation: z.date().or(z.string()).optional(),
  score: z.string(),
  summary: z.string(),
});
export type Education = z.infer<typeof educationSchema>;

export const educationDefault: Education = {
  ...defaultItem,
  school: "",
  typeOfStudy: "",
  major: "",
  yearGraduation: undefined,
  score: "",
  summary: "",
};
