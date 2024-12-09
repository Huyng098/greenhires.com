import { z } from "zod";
import { itemSchema } from "../base";

export const customSectionSchema = itemSchema.extend({
  name: z.string(),
  startDate: z.date().or(z.string()).optional(),
  endDate: z.date().or(z.string()).optional(),
  summary: z.string(),
});

export type CustomSection = z.infer<typeof customSectionSchema>;

export const customSectionDefault: CustomSection = {
  name: "",
  startDate: undefined,
  endDate: undefined,
  summary: "",
  id: "",
  visible: false,
};
