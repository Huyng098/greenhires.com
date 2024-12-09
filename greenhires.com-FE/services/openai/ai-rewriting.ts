"use server";
import { callOpenAI } from "./base";

const REWRITING_PROMPT = `You are an AI writing assistant specialized in rewriting text.
Do not return anything else except the text you improved, it should not begin with a newline. It should not have any prefix or suffix text.
Rewriting and improve the writing of the following paragraph, do not change the meaning of the text and returns in the language of the text:
Text: """{input}"""

Revised Text: """`;

export const rewriteText = async (text: string) => {
  const prompt = REWRITING_PROMPT.replace("{input}", text);
  return (
    (await callOpenAI({
      max_tokens: 1024,
      temperature: 0.7,
      user_prompt: prompt,
    })) ?? text
  );
};
