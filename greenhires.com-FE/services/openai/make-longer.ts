"use server";
import { callOpenAI } from "./base";

const REPHRASE_PROMPT = `You are an AI writing assistant specialized in writing for resumes.
Please rephrase the following text more meaningfully, concisely, and engagingly, do not change the meaning and returns in the language of the text:
It should not begin with a newline. It should not have any prefix or suffix text.
Text: """{input}"""

Revised Text: """`;

export const makeLonger = async (text: string) => {
  const prompt = REPHRASE_PROMPT.replace("{input}", text);
  return (
    (await callOpenAI({
      max_tokens: 1024,
      temperature: 0.7,
      user_prompt: prompt,
    })) ?? text
  );
};
