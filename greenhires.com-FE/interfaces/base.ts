import { z } from "zod";
import { SectionItem } from "./builder/baseSection";
import { idSchema } from "./id";
// Schema
export const itemSchema = z.object({
  id: idSchema,
  visible: z.boolean(),
});

// Type
export type Item = z.infer<typeof itemSchema>;

// Defaults
export const defaultItem: Item = {
  id: "",
  visible: true,
};

export type ItemCRUDProps<T extends SectionItem> = {
  item: T;
  updateFieldItem: (id: string, attribute: string, value: unknown) => void;
  deleteItem?: (id: string) => void;
  createOrDuplicateItem?: (values: T) => void;
  scopedT?: any;
};

export interface BaseMessageResponse {
  message: string
}

export interface ErrorResponse {
  error_code: string;
  detail: string;
}

export enum Status {
  Approve = "approved",
  Waiting = "waiting",
  Pending = "pending",
  Rejected = "rejected"
}