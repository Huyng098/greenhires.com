"use server";
import { SAMPLE } from "@/constants/apis";
import { GraphicDTO } from "@/interfaces/builder/resume";
import { PaginatedResponse } from "@/interfaces/general/pagination";
import { http } from "@/utils/http";
import qs from "query-string";

export const getAllGraphics = async ({
  q,
  offset,
  limit,
}: {
  q: string;
  offset: number;
  limit: number;
}): Promise<PaginatedResponse<GraphicDTO>> => {
  const query_str = qs.stringify({ q, offset, limit });
  return await http.get(`${SAMPLE.GRAPHICS}?${query_str}`, undefined, false);
};

export const getGraphicDownload = async (
  url: string
): Promise<{ file: string }> => {
  return await http.get(
    `${SAMPLE.GRAPHIC_DOWNLOAD}?url=${encodeURIComponent(url)}`,
    undefined,
    false
  );
};
