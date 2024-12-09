import { z } from "zod";
import { defaultItem, itemSchema } from "../base";

export const referenceSchema = itemSchema.extend({
  name: z.string(),
  position: z.string(),
  phone: z.string(),
  email: z.string(),
});

export type Reference = z.infer<typeof referenceSchema>;

export const referenceDefault: Reference = {
  ...defaultItem,
  name: "",
  position: "",
  phone: "",
  email: "",
};
