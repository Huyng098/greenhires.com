import { z } from "zod";
import { defaultItem, itemSchema } from "../base";

export const languageSchema = itemSchema.extend({
  name: z.string(),
  level: z.string(),
  summary: z.string(),
});

export type Language = z.infer<typeof languageSchema>;

export const languageDefault: Language = {
  ...defaultItem,
  name: "",
  level: "",
  summary: "",
};
