"use server";
import { SAMPLE } from "@/constants/apis";
import { ImageDto } from "@/interfaces/builder/resume";
import { PaginatedResponse } from "@/interfaces/general/pagination";
import { http } from "@/utils/http";

export const getAllImages = async ({
  q,
  page,
  per_page,
}: {
  q: string;
  page: string;
  per_page: string;
}): Promise<PaginatedResponse<ImageDto>> => {
  let data;
  q === ""
    ? (data = { page, per_page })
    : (data = {
        q,
        page,
        per_page,
      });
  return await http.get(
    `${SAMPLE.IMAGES}?${new URLSearchParams(data).toString()}`,
    undefined,
    false
  );
};

export const getImageById = async (id: string): Promise<{ url: string }> => {
  return await http.put(`${SAMPLE.IMAGES}/${id}`, undefined, undefined, false);
};
