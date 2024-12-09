import { z } from "zod";
import { defaultItem, itemSchema } from "../base";

export const awardSchema = itemSchema.extend({
  title: z.string(),
  date: z.date().or(z.string()).optional(),
  awarder: z.string(),
  summary: z.string(),
});

export type Award = z.infer<typeof awardSchema>;

export const awardDefault: Award = {
  ...defaultItem,
  title: "",
  date: undefined,
  awarder: "",
  summary: "",
};
