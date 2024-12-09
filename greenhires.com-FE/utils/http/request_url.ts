"use server";

import { HUMANTREE_ACCESS_TOKEN } from "@/constants/cookie";
import { getCookie } from "../cookie/getCookie";

export const getRequestURL = async (url: string) => {
  if (!url.startsWith("/")) {
    url = `/${url}`;
  }
  return `${process.env.API_URL}${url}`;
};

export const getAccessToken = () => {
  const access_token = getCookie(HUMANTREE_ACCESS_TOKEN);
  return access_token;
};
