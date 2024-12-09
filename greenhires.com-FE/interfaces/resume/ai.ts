import { string, z } from "zod";

export const AIGenerationText = z.object({
  topic: string().min(1),
  tone: string().min(1),
  language: string().min(1),
  keywords: string(),
});

export type AIGenerationTextType = z.infer<typeof AIGenerationText>;

export const AIGenerationParagraph = z
  .object({
    topic: string().min(1),
    tone: string().min(1),
    language: string().min(1),
    description: string(),
    keywords: string(),
  })
  .refine(
    ({ description, keywords }) => description !== "" || keywords !== "",
    {
      message: "At least have one",
    }
  );

export type AIGenerationParagraphType = z.infer<typeof AIGenerationParagraph>;
