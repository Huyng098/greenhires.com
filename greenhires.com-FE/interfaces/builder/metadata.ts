import { z } from "zod";

// Schema
export const metadataSchema = z.object({
  template: z.string().default("Template 1"),
  variant: z.string().default(""),
  section_order: z
    .array(z.string())
    .default([
      "education",
      "experience",
      "skills",
      "languages",
      "awards",
      "courses",
      "links",
      "hobbies",
      "certifications",
      "references",
    ]),
});

// Type
export type Metadata = z.infer<typeof metadataSchema>;

// Defaults
export const defaultMetadata: Metadata = {
  template: "Template 1",
  variant: "",
  section_order: [
    "education",
    "experience",
    "skills",
    "languages",
    "awards",
    "courses",
    "links",
    "hobbies",
    "certifications",
    "references",
  ],
};
