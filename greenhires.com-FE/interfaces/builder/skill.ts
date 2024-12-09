import { z } from "zod";
import { defaultItem, itemSchema } from "../base";

export const skillSchema = itemSchema.extend({
  name: z.string(),
  description: z.string(),
  level: z.number().min(1).max(5).default(1),
  displayBar: z.enum(["star", "circle", "heart", "triangle"]).default("star"),
});

export type Skill = z.infer<typeof skillSchema>;

export const skillDefault: Skill = {
  ...defaultItem,
  name: "",
  description: "",
  level: 1,
  displayBar: "star",
};
