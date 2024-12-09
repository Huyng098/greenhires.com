"use server";

import { GENERAL, USER } from "@/constants/apis";
import {
  HUMANTREE_ACCESS_TOKEN,
  HUMANTREE_REFRESH_TOKEN,
  HUMANTREE_ROLE,
} from "@/constants/cookie";
import { ErrorResponse } from "@/interfaces/base";
import { URLSchema } from "@/interfaces/builder/resume";
import { PaginatedResponse } from "@/interfaces/general/pagination";

import {
  CanvaImage,
  UserDto,
  addNewUserSchema,
  changeInforSchema,
  changePasswordSchema,
  personalInforSchema,
} from "@/interfaces/user";
import { http } from "@/utils/http";
import { format } from "date-fns";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import qs from "query-string";
import { z } from "zod";

export const getMe = async (): Promise<UserDto> => {
  return await http.get(USER.MINE, undefined, true);
};

export const uploadPicture = async (
  formData: FormData
): Promise<URLSchema | ErrorResponse> => {
  revalidateTag("mine");
  const data = await http.post(
    GENERAL.IMAGE,
    formData,
    {
      headers: {},
    },
    true
  );
  return data;
};

export const changePersonalInformation = async (
  personalInfor: z.infer<typeof personalInforSchema>
): Promise<UserDto | ErrorResponse> => {
  return await http.put(
    USER.UPDATE_INFO,
    {
      ...personalInfor,
      dob: personalInfor.dob
        ? format(personalInfor.dob, "yyyy-MM-dd")
        : undefined,
    },
    undefined,
    true
  );
};

export const changePassword = async (
  changePasswordForm: z.infer<typeof changePasswordSchema>
): Promise<{ message: string } | ErrorResponse> => {
  return await http.put(
    USER.UPDATE_PASSWORD,
    {
      old_password: changePasswordForm.current_password,
      new_password: changePasswordForm.new_password,
      confirm_password: changePasswordForm.confirm_password,
    },
    undefined,
    true
  );
};

export const getAllUsers = async (
  offset: number,
  limit: number,
  role?: string
): Promise<PaginatedResponse<UserDto>> => {
  const query_str = qs.stringify(
    {
      limit,
      offset,
      role,
    },
    { skipNull: true, skipEmptyString: true }
  );
  return await http.get(
    `${USER.ALL}?${query_str}`,
    { next: { tags: ["users"] } },
    true
  );
};

export const deleteUserbyId = async (
  id: string
): Promise<{ message: string } | ErrorResponse> => {
  revalidateTag("users");
  return await http.delete(`${USER.DELETE(id)}`, undefined, true);
};

export const deleteMe = async (): Promise<
  { message: string } | ErrorResponse
> => {
  const message = await http.delete(USER.DELETE_ME, undefined, true);
  cookies().delete(HUMANTREE_ACCESS_TOKEN);
  cookies().delete(HUMANTREE_REFRESH_TOKEN);
  cookies().delete(HUMANTREE_ROLE);
  return message;
};
export const changeRoleUserById = async ({
  id,
  role,
}: {
  id: string;
  role: string;
}): Promise<UserDto | ErrorResponse> => {
  revalidateTag("users");
  return await http.put(`${USER.UPDATE_ROLE(id)}`, { role }, undefined, true);
};

export const addUser = async ({
  email,
  password,
  firstname,
  lastname,
  phone,
  gender,
  dob,
  address,
  role,
}: z.infer<typeof addNewUserSchema>): Promise<UserDto | ErrorResponse> => {
  revalidateTag("users");
  const formattedDob = dob ? format(dob, "yyyy-MM-dd") : undefined;
  return await http.post(
    `${USER.ADD}`,
    {
      email,
      password,
      firstname,
      lastname,
      phone,
      gender,
      formattedDob,
      address,
      role,
    },
    undefined,
    true
  );
};

export const getCurrentUser = async (): Promise<UserDto> => {
  return await http.get(`${USER.MINE}`, { next: { tags: ["mine"] } }, true);
};

export const changeMyInfor = async (
  data: z.infer<typeof changeInforSchema>
): Promise<{ message: string } | ErrorResponse> => {
  revalidateTag("mine");
  const formattedDob = data?.dob ? format(data.dob, "yyyy-MM-dd") : undefined;
  return await http.put(
    USER.UPDATE_INFO,
    { ...data, dob: formattedDob },
    undefined,
    true
  );
};

export const getCanvaImages = async (
  offset: number,
  limit: number
): Promise<PaginatedResponse<CanvaImage>> => {
  const query_str = qs.stringify(
    {
      limit,
      offset,
    },
    { skipNull: true, skipEmptyString: true }
  );
  return await http.get(
    `${USER.CANVA_IMAGE}?${query_str}`,
    { next: { tags: ["canva_images"] } },
    true
  );
};
