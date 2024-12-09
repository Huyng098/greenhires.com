import {
  HUMANTREE_ACCESS_TOKEN,
  HUMANTREE_ACCESS_TOKEN_EXPIRED,
  HUMANTREE_REFRESH_TOKEN,
} from "@/constants/cookie";
import { refreshToken } from "@/services/refresh/refresh";
import { cookies } from "next/headers";
import { getCookie } from "../cookie/getCookie";
import { getRequestURL } from "./request_url";
const MAX_TIME_REFRESH = 60 * 1000; // Use this to determine when to refresh tokens
let isRefreshed = false;

const httpRequest = async <TEntity>(
  url: string,
  method: string,
  data: TEntity,
  options: RequestInit = {},
  isNeedAuth = false
) => {
  if (isNeedAuth && !isRefreshed) {
    isRefreshed = true;
    const tokenExpired = getCookie(HUMANTREE_ACCESS_TOKEN_EXPIRED);
    if (
      (!tokenExpired ||
        parseInt(tokenExpired) - (Date.now() + MAX_TIME_REFRESH) < 0) &&
      getCookie(HUMANTREE_REFRESH_TOKEN)
    ) {
      try {
        await refreshToken();
      } catch (error) {
        cookies().delete(HUMANTREE_ACCESS_TOKEN);
        cookies().delete(HUMANTREE_REFRESH_TOKEN);
      }
      isRefreshed = false;
    }
  }
  let request_body = data;
  if (!options.headers && method !== "GET") {
    options.headers = {
      "Content-Type": "application/json",
    };
    request_body = JSON.stringify(data) as any;
  }
  options.headers = {
    Accept: "application/json",
    ...options.headers,
    ...(isNeedAuth &&
      getCookie(HUMANTREE_ACCESS_TOKEN) && {
        Authorization: `Bearer ${getCookie(HUMANTREE_ACCESS_TOKEN)}`,
      }),
  };
  const requestOptions: RequestInit = {
    method,
    cache: "no-store",
    body: request_body as any,
    ...options,
  };
  const res = await fetch(await getRequestURL(url), requestOptions);
  if (!res.ok) {
    if (res.status >= 500)
      return { error_code: 500, detail: "Internal server error" };
    const body = await res.json();
    return { error_code: res.status, detail: body.detail };
  }
  const body = await res.json();
  return body;
};

export const http = {
  get: (url: string, options?: RequestInit, isNeedAuth: boolean = false) =>
    httpRequest(url, "GET", undefined, options, isNeedAuth),
  post: <TEntity>(
    url: string,
    data: TEntity,
    options?: RequestInit,
    isNeedAuth: boolean = false
  ) => httpRequest(url, "POST", data, options, isNeedAuth),
  put: <TEntity>(
    url: string,
    data: TEntity,
    options?: RequestInit,
    isNeedAuth: boolean = false
  ) => httpRequest(url, "PUT", data, options, isNeedAuth),
  delete: (url: string, options?: RequestInit, isNeedAuth: boolean = false) =>
    httpRequest(url, "DELETE", undefined, options, isNeedAuth),
  patch: <TEntity>(
    url: string,
    data: TEntity,
    options?: RequestInit,
    isNeedAuth: boolean = false
  ) => httpRequest(url, "PATCH", data, options, isNeedAuth),
};
