import { z } from "zod";
import { defaultItem, itemSchema } from "../base";

export const experienceSchema = itemSchema.extend({
  company: z.string(),
  position: z.string(),
  startDate: z.date().or(z.string()).optional(),
  endDate: z.date().or(z.string()).optional(),
  summary: z.string(),
});

export type Experience = z.infer<typeof experienceSchema>;

export const experienceDefault: Experience = {
  ...defaultItem,
  company: "",
  position: "",
  startDate: undefined,
  endDate: undefined,
  summary: "",
};
