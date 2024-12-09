import { z } from "zod";
import { defaultItem, itemSchema } from "../base";

// Schema
export const urlSchema = itemSchema.extend({
  label: z.string(),
  href: z.literal("").or(z.string().url()),
});

// Type
export type URL = z.infer<typeof urlSchema>;

// Defaults
export const defaultUrl: URL = {
  ...defaultItem,
  label: "",
  href: "",
};
