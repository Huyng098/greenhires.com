import { SAMPLE_TYPES } from "@/constants/dashboard";
import { SerializedPage } from "@lidojs/design-core";
import { z } from "zod";
import { ResumeDto } from "../builder/resume";

export interface SampleDto {
  summary: string;
  imgs: string[];
  status: "pending" | "waiting" | "approved" | "rejected";
  name: string;
  type: SAMPLE_TYPES;
  category_ids: string[];
  id: string;
  approver_name: string;
  creator_name: string;
  category_names: string[];
  due_date: Date;
  updated_at: Date;
  resume_canva: SerializedPage[];
  comments: {
    time: string;
    content: string;
    admin_name: string;
  }[];
  variants: SampleVariant[];
  resume: ResumeDto;
}

export interface SampleVariant {
  id: string;
  created_at: Date;
  updated_at: Date;
  sample_id?: string;
  color: string;
  imgs: string[];
}

export const addSampleSchema = z.object({
  title: z.string().min(1, { message: "This field is required" }),
});

export const addBackgroundSchema = z.object({
  files: z.any(),
  category_ids: z
    .array(z.string())
    .min(1, { message: "Please choose at least one category" }),
});
