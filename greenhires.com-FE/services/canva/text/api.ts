"use server";
import { SAMPLE } from "@/constants/apis";
import { TextDto } from "@/interfaces/builder/resume";
import { PaginatedResponse } from "@/interfaces/general/pagination";
import { http } from "@/utils/http";
import { FontData } from "@lidojs/design-core";

export const getAllTextStyles = async (): Promise<TextDto[]> => {
  return await http.get(`${SAMPLE.TEXTSTYLE}`, undefined, false);
};

export const getAllTextFont = async (
  query: string
): Promise<PaginatedResponse<FontData>> => {
  return await http.get(`${SAMPLE.FONTS}?${query}`, undefined, false);
};
