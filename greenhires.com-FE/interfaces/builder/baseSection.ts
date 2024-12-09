import { z } from "zod";
import { idSchema } from "../id";
import { awardSchema } from "./award";
import { certificationSchema } from "./certification";
import { courseSchema } from "./course";
import { customSectionSchema } from "./custom";
import { educationSchema } from "./education";
import { experienceSchema } from "./experience";

import { hobbySchema } from "./hobby";
import { languageSchema } from "./language";
import { referenceSchema } from "./reference";
import { skillSchema } from "./skill";
import { urlSchema } from "./url";

// base schema for section
export const sectionSchema = z.object({
  name: z.string(), // use to show title of section
  columns: z.number().min(1).max(4).default(1), // use to modify layout of section
  visible: z.boolean().default(true), // use to hide/show section
});

// customs section schema
export const customSchema = sectionSchema.extend({
  key: idSchema,
  items: z.array(customSectionSchema),
});
// all sections schema
export const sectionsSchema = z.object({
  aboutme: sectionSchema.extend({
    key: z.literal("aboutme"), // use to identify section
    content: z.string().default(""), // rich text editor
  }),
  education: sectionSchema.extend({
    key: z.literal("education"),
    items: z.array(educationSchema),
  }),
  experience: sectionSchema.extend({
    key: z.literal("experience"),
    items: z.array(experienceSchema),
  }),
  skills: sectionSchema.extend({
    key: z.literal("skills"),
    items: z.array(skillSchema),
  }),
  languages: sectionSchema.extend({
    key: z.literal("languages"),
    items: z.array(languageSchema),
  }),
  awards: sectionSchema.extend({
    key: z.literal("awards"),
    items: z.array(awardSchema),
  }),
  hobbies: sectionSchema.extend({
    key: z.literal("hobbies"),
    items: z.array(hobbySchema),
  }),
  courses: sectionSchema.extend({
    key: z.literal("courses"),
    items: z.array(courseSchema),
  }),
  certifications: sectionSchema.extend({
    key: z.literal("certifications"),
    items: z.array(certificationSchema),
  }),
  references: sectionSchema.extend({
    key: z.literal("references"),
    items: z.array(referenceSchema),
  }),
  links: sectionSchema.extend({
    key: z.literal("links"),
    items: z.array(urlSchema),
  }),
  custom: z.record(z.string(), customSchema),
});

export type FilterKeys<T, Condition> = {
  [Key in keyof T]: T[Key] extends Condition ? Key : never;
}[keyof T];

// Define the type of sections
export type Section = z.infer<typeof sectionSchema>;
export type Sections = z.infer<typeof sectionsSchema>;

export const requiredSectionKeys = [
  "basics",
  "aboutme",
  "education",
  "experience",
  "skills",
  "languages",
  "awards",
];
export type SectionKey = "basics" | keyof Sections | `custom.${string}`;
export type CustomSectionGroup = z.infer<typeof customSchema>;
export type SectionWithItem<T = unknown> = Sections[FilterKeys<
  Sections,
  { items: T[] }
>];
export type SectionItem = SectionWithItem["items"][number];
// Define default sections
// Defaults
export const defaultSection: Section = {
  name: "",
  columns: 1,
  visible: true,
};

export const requiredDefaultSections = {
  aboutme: {
    ...defaultSection,
    key: "aboutme",
    name: "About Me",
    content: "",
  },
  education: {
    ...defaultSection,
    key: "education",
    name: "Education",
    items: [],
  },
  experience: {
    ...defaultSection,
    key: "experience",
    name: "Experience",
    items: [],
  },
  skills: { ...defaultSection, key: "skills", name: "Skills", items: [] },
  languages: {
    ...defaultSection,
    key: "languages",
    name: "Languages",
    items: [],
  },
  awards: { ...defaultSection, key: "awards", name: "Awards", items: [] },
};

export const defaultSections: Sections = {
  aboutme: { ...defaultSection, key: "aboutme", name: "About Me", content: "" },
  education: {
    ...defaultSection,
    key: "education",
    name: "Education",
    items: [],
  },
  experience: {
    ...defaultSection,
    key: "experience",
    name: "Experience",
    items: [],
  },
  links: { ...defaultSection, key: "links", name: "Links", items: [] },
  skills: { ...defaultSection, key: "skills", name: "Skills", items: [] },
  languages: {
    ...defaultSection,
    key: "languages",
    name: "Languages",
    items: [],
  },
  awards: { ...defaultSection, key: "awards", name: "Awards", items: [] },

  hobbies: { ...defaultSection, key: "hobbies", name: "Hobbies", items: [] },
  courses: { ...defaultSection, key: "courses", name: "Courses", items: [] },
  certifications: {
    ...defaultSection,
    key: "certifications",
    name: "Certifications",
    items: [],
  },
  references: {
    ...defaultSection,
    key: "references",
    name: "References",
    items: [],
  },
  custom: {},
};
