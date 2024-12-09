"use server";
import { AIGenerationTextType } from "@/interfaces/resume/ai";
import { addKeywords } from "../ai/api";
import { callOpenAI } from "./base";
export interface GenerateTextProps {
  info: AIGenerationTextType;
  job_title: string;
  format_style: string;
  isRetry: boolean;
}

const GENERATE_TEXT_PROMPT = `You are an AI writing assistant specialized in writing copy for resumes.
Your task is write about the topic of {Topic} in the CV, craft a compelling and concise sentence for the {Job Title} position,
formatted in the chosen {CV Format Style}. The tone should be {Tone}, conveying [specific feelings, traits, or characteristics].
Incorporate the following {Keywords} prominently to highlight the user's strengths and qualifications. Additionally, 
consider the {Additional Information} provided to ensure the sentence aligns with the user's career trajectory and aspirations
You should create a list of 3 sentences in {Language} language and return them in JSON format: {{"sentences": [string] (list of strings)}}
Output: """`;

export const generateText = async ({
  info,
  job_title,
  format_style,
  isRetry = false,
}: GenerateTextProps) => {
  const prompt = GENERATE_TEXT_PROMPT.replace("{Topic}", info.topic)
    .replace("{Job Title}", job_title)
    .replace("{CV Format Style}", format_style)
    .replace("{Tone}", info.tone)
    .replace("{Keywords}", info.keywords)
    .replace("{Language}", info.language);
  const output_text =
    (await callOpenAI({
      max_tokens: 1024,
      temperature: 0.5,
      response_format: {
        type: "json_object",
      },
      user_prompt: prompt,
    })) ?? "";
  if (!isRetry) {
    addKeywords({ names: info.keywords.split(","), topic: info.topic });
  }
  return output_text;
};
