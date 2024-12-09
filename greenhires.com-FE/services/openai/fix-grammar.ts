"use server";
import { ResumeData } from "@/interfaces/builder/resume";
import { convert } from "html-to-text";
import { callOpenAI } from "./base";

const GRAMMAR_SYSTEM_PROMPT = `You are an AI grammar and spelling checker. Your task is to identify and correct individual word errors in the given text. Follow these guidelines:

1. Only identify single words with spelling or grammar errors.
2. Do not suggest improvements for style, punctuation, or phrasing.
3. Provide the corrected version
4. Brief explanation for each error, must be in one of the following categories: 
  "Replace with", "Remove word", "Make the verb forms match", "End the sentence with a period",
  "Use correct pronoun, article, or preposition", "Correct the spelling error",
5. Return the full text with all identified errors corrected.

Return the results in this JSON format:
{
  "mistakes": [
    {
      "original": "incorrect word",
      "corrected": "correct word",
      "explanation": "Brief explanation of the error"
    }
  ],
  "revised_text": "The full text with all identified errors corrected"
}

Only include words in "mistakes" if they have a spelling or grammar error. 
Do not include correct words or suggest stylistic changes.`;

export const fixGrammar = async (text: string) => {
  const user_prompt = `Text to check: """${text}"""`;

  return (
    (await callOpenAI({
      max_tokens: 1024,
      temperature: 0,
      response_format: {
        type: "json_object",
      },
      system_prompt: GRAMMAR_SYSTEM_PROMPT,
      user_prompt: user_prompt,
    })) ?? text
  );
};

const FULLCHECK_GRAMMAR_SYSTEM_PROMPT = `You are an AI grammar checker.
Your task is to identify and explain errors in the given JSON resume. Follow these guidelines:

  1. Identify and summarize all grammar and spelling errors in each section of the resume.
  2. If there are no errors in a section, please ignore it.
  3. Don't check fields that are not text-based, such as dates, URLs, or empty fields.

Return the result in this JSON format:
{
  "keyOfSection": "summary of errors",
}
For example:
{
  "experience": "There are 3 spelling errors in this section.",
  "custom.f6638a09-528d-4f31-8e2e-c3af5793e8f4": "Missing period at the end of the sentence."
  "skills": "Wrong verb form in the first sentence."
}
`;

export const fixFullCheckGrammar = async (resume: ResumeData) => {
  const resume_data = convert(JSON.stringify(resume));
  const user_prompt = `Resume to check: """${resume_data}"""`;
  return (
    (await callOpenAI({
      max_tokens: 4096,
      temperature: 0,
      system_prompt: FULLCHECK_GRAMMAR_SYSTEM_PROMPT,
      user_prompt: user_prompt,
      response_format: {
        type: "json_object",
      },
    })) ?? ""
  );
};
