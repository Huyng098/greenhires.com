"use server";
import { BACKGROUND, KEYWORD } from "@/constants/apis";
import { ErrorResponse } from "@/interfaces/base";
import { BackgroundDto, KeywordDto } from "@/interfaces/builder/resume";
import { http } from "@/utils/http";

export const uploadBackgroundImage = async (
  formData: FormData
): Promise<BackgroundDto | ErrorResponse> => {
  return await http.post(
    `${BACKGROUND.ADD}`,
    formData,
    {
      headers: {},
    },
    true
  );
};

export const deleteBackgroundImage = async (
  id: string
): Promise<BackgroundDto | ErrorResponse> => {
  return await http.delete(`${BACKGROUND.DELETE(id)}`, {}, true);
};

export const addKeywords = async (
  keywords: KeywordDto
): Promise<KeywordDto> => {
  return await http.post(`${KEYWORD.ADD}`, keywords, {}, true);
};
