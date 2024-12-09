"use server";
import { BACKGROUND, SAMPLE } from "@/constants/apis";
import { SAMPLE_TYPES } from "@/constants/dashboard";
import { BackgroundDto, TemplateDto } from "@/interfaces/builder/resume";
import { PaginatedResponse } from "@/interfaces/general/pagination";
import { SampleDto } from "@/interfaces/sample/sample";
import { http } from "@/utils/http";
import { SerializedPage } from "@lidojs/design-core";
import qs from "query-string";

export const getAllPublicSamples = async (
  page: number = 0,
  limit: number = 25,
  type: SAMPLE_TYPES,
  category_id?: string
): Promise<PaginatedResponse<TemplateDto>> => {
  if (category_id === "All") {
    category_id = undefined;
  }
  const query_str = qs.stringify({ page, limit, category_id, type });
  return await http.get(`${SAMPLE.PUBLIC}?${query_str}`, undefined, false);
};

export const getSampleById = async (id: string): Promise<SampleDto> => {
  return await http.get(SAMPLE.GET_BY_ID(id), undefined, true);
};

export const getAllPublicBackgrounds = async (
  offset: number = 0,
  limit: number = 25,
  type: "default" | "ai" = "default",
  category_id?: string
): Promise<PaginatedResponse<BackgroundDto>> => {
  if (category_id === "All") {
    category_id = undefined;
  }
  const query_str = qs.stringify(
    { offset, limit, type, category_id },
    { skipNull: true, skipEmptyString: true }
  );
  return await http.get(`${BACKGROUND.ALL}?${query_str}`, undefined, false);
};

export const getMyBackgrounds = async (
  offset: number = 0,
  limit: number = 25,
  category_id?: string
): Promise<PaginatedResponse<BackgroundDto>> => {
  if (category_id === "All") {
    category_id = undefined;
  }
  const query_str = qs.stringify(
    { offset, limit, category_id },
    { skipNull: true, skipEmptyString: true }
  );
  return await http.get(`${BACKGROUND.MY}?${query_str}`, undefined, true);
};

export const updateTemplate = async ({
  template_id,
  data,
}: {
  template_id: string;
  data: SerializedPage[];
}): Promise<TemplateDto> => {
  return await http.patch(SAMPLE.GET_BY_ID(template_id), data, undefined, true);
};
