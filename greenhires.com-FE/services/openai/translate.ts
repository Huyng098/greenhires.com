"use server";
import { ResumeData } from "@/interfaces/builder/resume";
//@ts-ignore
import get from "lodash.get";
import { z } from "zod";
import { callOpenAI, TranslateTexts } from "./base";

const TRANSLATE_PROMPT = `You are provided a list of sentences in here: {Sentences}
Your task is to translate it into {Language} language.
You must return the translated sentences in JSON format: {{"sentences": [string] (list of strings)}}
Output: """`;

export const translateResume = async (
  resume_data: ResumeData,
  language: string
): Promise<z.infer<typeof TranslateTexts>> => {
  let custom_keys: string[] = [];
  let custom_names: string[] = [];
  if (resume_data.sections?.custom) {
    Object.entries(resume_data.sections.custom).map(([key, section]) => {
      custom_keys.push(key);
      custom_names.push(section.name);
    });
  }
  let normal_keys = Object.keys(resume_data.sections).filter(
    (section) => !section.startsWith("custom")
  );
  normal_keys = normal_keys.filter((key) => get(resume_data.sections, key));
  const normal_names = normal_keys.map(
    (key) => get(resume_data.sections, key).name
  );
  normal_keys.unshift("basics");
  normal_names.unshift(resume_data.basics.name);
  const prompt = TRANSLATE_PROMPT.replace(
    "{Sentences}",
    `[${custom_names.length > 0 ? normal_names.concat(custom_names) : normal_names}]`
  ).replace("{Language}", language);
  const translated_names =
    (await callOpenAI({
      max_tokens: 4096,
      temperature: 0.0,
      user_prompt: prompt,
      response_format: { type: "json_object" },
    })) ?? "";
  return {
    normal_keys,
    custom_keys: custom_keys,
    translated_names: JSON.parse(translated_names).sentences,
  };
};
