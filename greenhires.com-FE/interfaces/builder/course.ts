import { z } from "zod";
import { defaultItem, itemSchema } from "../base";

export const courseSchema = itemSchema.extend({
  name: z.string(),
  institution: z.string(),
  startDate: z.date().or(z.string()).optional(),
  endDate: z.date().or(z.string()).optional(),
});

export type Course = z.infer<typeof courseSchema>;

export const courseDefault: Course = {
  ...defaultItem,
  name: "",
  institution: "",
  startDate: undefined,
  endDate: undefined,
};
