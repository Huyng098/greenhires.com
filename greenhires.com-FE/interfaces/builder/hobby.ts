import { z } from "zod";
import { defaultItem, itemSchema } from "../base";

export const hobbySchema = itemSchema.extend({
  name: z.string(),
  summary: z.string(),
});

export type Hobby = z.infer<typeof hobbySchema>;

export const hobbyDefault: Hobby = {
  ...defaultItem,
  name: "",
  summary: "",
};
