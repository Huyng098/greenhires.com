"use server";
import { CATEGORY, GENERAL } from "@/constants/apis";
import { ErrorResponse } from "@/interfaces/base";
import { URLSchema } from "@/interfaces/builder/resume";
import { Category } from "@/interfaces/general/category";
import { http } from "@/utils/http";
import qs from "query-string";

export const getAllCategories = async (type?: string): Promise<Category[]> => {
  const query_str = qs.stringify(
    {
      type,
    },
    { skipNull: true, skipEmptyString: true }
  );
  return await http.get(`${CATEGORY.ALL}?${query_str}`, undefined, false);
};

export const uploadImage = async (formData: FormData): Promise<URLSchema> => {
  return await http.post(
    GENERAL.IMAGE,
    formData,
    {
      headers: {},
    },
    true
  );
};

export const deleteImage = async (
  imgPath: string
): Promise<{ message: string } | ErrorResponse> => {
  return await http.delete(`${GENERAL.UPLOAD}/${imgPath}`);
};
