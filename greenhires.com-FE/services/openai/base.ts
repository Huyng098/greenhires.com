import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ResponseFormat {
  type?: "text" | "json_object";
}

interface OpenAIParameters {
  model?: string;
  max_tokens?: number;
  temperature: number;
  system_prompt?: string;
  user_prompt: string;
  response_format?: ResponseFormat;
}

export const RecommendTexts = z.object({
  sentences: z.array(z.string()).describe("Recommended sentences"),
});

export const TranslateTexts = z.object({
  normal_keys: z.array(z.string()),
  custom_keys: z.array(z.string()),
  translated_names: z.array(z.string()),
});

export const callOpenAI = async ({
  model,
  max_tokens,
  temperature,
  system_prompt,
  user_prompt,
  response_format,
}: OpenAIParameters) => {
  let messages: ChatCompletionMessageParam[] = [];
  if (system_prompt) {
    messages.push({ role: "system", content: system_prompt });
  }
  messages.push({ role: "user", content: user_prompt });
  const result = await openai.chat.completions.create({
    messages,
    model: model ?? "gpt-4o-mini-2024-07-18",
    max_tokens: max_tokens ?? 1024,
    temperature: temperature,
    ...(response_format && { response_format }),
    stop: ['"""'],
    n: 1,
  });

  if (result.choices.length === 0) {
    throw new Error(`OpenAI did not return any choices for your text.`);
  }
  return result.choices[0].message.content;
};
