import { LayerId, SerializedLayers, SerializedPage } from "@lidojs/design-core";
import { z } from "zod";
import { idSchema } from "../id";
import {
  defaultSections,
  requiredDefaultSections,
  sectionsSchema,
} from "./baseSection";
import { SerializedPageSchema } from "./canva";
import { defaultMetadata, metadataSchema } from "./metadata";
import { basicsSchema, defaultBasics } from "./personalDetail";
import { COVER_LETTER, RESUME, TYPE } from "@/constants/dashboard";

export const resumeDataSchema = z.object({
  basics: basicsSchema,
  sections: sectionsSchema,
  metadata: metadataSchema,
  css: z.string().default("").optional(),
});

export const requiredDefaultResumeData = {
  basics: defaultBasics,
  sections: requiredDefaultSections,
  metadata: defaultMetadata,
  css: "",
};

export const defaultResumeData: ResumeData = {
  basics: defaultBasics,
  sections: defaultSections,
  metadata: defaultMetadata,
  css: "",
};

export const resumeSchema = z.object({
  id: idSchema,
  title: z.string(),
  slug: z.string(),
  resume_data: resumeDataSchema.default(defaultResumeData),
  resume_canva: z.array(SerializedPageSchema),
  locked: z.boolean().default(false),
  builder_type: z.enum(["resumeio", "resumecanva"]),
  visibility: z.enum(["public", "private"]).default("private"),
  account_id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
  language: z.string().default("en"),
  type: z.enum([RESUME, COVER_LETTER]),
  isSample: z.boolean().optional(),
});

export type URLSchema = {
  url: string;
};
export type ResumeAvatarForm = {
  imgSrc: string;
  resume_id: string;
};

export type ResumeCreate = {
  title: string;
  type: TYPE;
  typeOfBuilder: "resumeio" | "resumecanva";
  templateId?: string;
  templateVariant?: string;
  resume_data?: ResumeData;
};

export type TemplateDto = {
  id: string;
  name: string;
  category_id?: string;
  elements: SerializedPage[];
  summary?: string;
  variants: {
    color: string;
    imgs: string[];
  }[];
};

export type LayoutDto = {
  id: string;
  imgs: string[];
  name: string;
  elements: SerializedPage[];
  summary?: string;
};

export type FrameDto = {
  img: string;
  clipPath: string;
  width: number;
  height: number;
};

export type GraphicDTO = {
  id: string;
  downloadUrl: string;
  thumb: string;
};

export type ImageDto = {
  id: string;
  image: string;
  name: string;
  thumb: string;
  height: number;
  width: number;
  username: string;
};

export type PublicViewResume = {
  username: string;
  slug: string;
};

export type ResumeData = z.infer<typeof resumeDataSchema>;
export type Sections = z.infer<typeof sectionsSchema>;
export type ResumeDto = z.infer<typeof resumeSchema>;

export interface TextDto {
  img: string;
  elements: {
    rootId: LayerId;
    layers: SerializedLayers;
  };
}

export interface BackgroundDto {
  id: string;
  url: string;
  description: string;
  category_id: string;
  type: "default" | "ai";
}

export interface KeywordDto {
  names: string[];
  topic: string;
}
