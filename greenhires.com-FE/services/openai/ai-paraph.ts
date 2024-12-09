"use server";
import { AIGenerationParagraphType } from "@/interfaces/resume/ai";
import { addKeywords } from "../ai/api";
import { callOpenAI } from "./base";

const GENERATE_PARAGRAPH_PROMPT = `You are an AI specializing in generating paragraphs for CVs.
Your task is write about the topic of {Topic} in the CV, craft a compelling and concise paragraph for the {Job Title} position,
formatted in the chosen {CV Format Style}. The tone should be {Tone}, conveying [specific feelings, traits, or characteristics].
Incorporate the following {Keywords} prominently to highlight the user's strengths and qualifications. Additionally, 
consider the {Description} provided to ensure the paragraph aligns with the user's career trajectory and aspirations
You should create a list of 3 short parapraphs in {Language} language and return them in JSON format: {{"sentences": [string] (list of strings)}}
Output: """`;

export interface GenerateParagraphProps {
  info: AIGenerationParagraphType;
  job_title: string;
  format_style: string;
  isRetry: boolean;
}

export const generateParagraph = async ({
  info,
  job_title,
  format_style,
  isRetry = false,
}: GenerateParagraphProps) => {
  const prompt = GENERATE_PARAGRAPH_PROMPT.replace("{Topic}", info.topic)
    .replace("{Job Title}", job_title)
    .replace("{CV Format Style}", format_style)
    .replace("{Tone}", info.tone)
    .replace("{Description}", info.description)
    .replace("{Keywords}", info.keywords)
    .replace("{Language}", info.language);
  const output_text =
    (await callOpenAI({
      max_tokens: 1024,
      temperature: 0.5,
      user_prompt: prompt,
      response_format: {
        type: "json_object",
      },
    })) ?? "";
  // Add keywords to database
  if (!isRetry) {
    addKeywords({ names: info.keywords.split(","), topic: info.topic });
  }
  return output_text;
};
