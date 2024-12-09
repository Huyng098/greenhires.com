import { z } from "zod";

const SerializedCompTypeSchema = z.object({
  resolvedName: z.string(),
});

const SerializedLayerSchema = z.object({
  type: SerializedCompTypeSchema,
  props: z.record(z.string(), z.unknown()),
  locked: z.boolean(),
  parent: z.nullable(z.string()),
  child: z.array(z.string()),
});

export const SerializedPageSchema = z.object({
  layers: z.record(z.string(), SerializedLayerSchema),
});
