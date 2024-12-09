"use server";
import {
  HUMANTREE_ACCESS_TOKEN,
  HUMANTREE_ACCESS_TOKEN_EXPIRED,
  HUMANTREE_REFRESH_TOKEN,
  HUMANTREE_ROLE,
  cookie_config,
} from "@/constants/cookie";
import { LoginResponse } from "@/interfaces/general/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const set_cookies = async (
  res: LoginResponse,
  response?: NextResponse
) => {
  if (response) {
    response.cookies.set(
      HUMANTREE_ACCESS_TOKEN_EXPIRED,
      `${Date.now() + res.access_token_max_age * 1000}`,
      {
        maxAge: res.access_token_max_age,
      }
    );
    response.cookies.set(HUMANTREE_ACCESS_TOKEN, res.access_token, {
      maxAge: res.access_token_max_age,
      ...cookie_config,
    });
    response.cookies.set(HUMANTREE_REFRESH_TOKEN, res.refresh_token, {
      maxAge: res.refresh_token_max_age,
      ...cookie_config,
    });
    response.cookies.set(HUMANTREE_ROLE, res.user.role, {
      maxAge: res.refresh_token_max_age,
      ...cookie_config,
    });

    response;
  } else {
    cookies().set(
      HUMANTREE_ACCESS_TOKEN_EXPIRED,
      `${Date.now() + res.access_token_max_age * 1000}`,
      {
        maxAge: res.access_token_max_age,
      }
    );
    cookies().set(HUMANTREE_ACCESS_TOKEN, res.access_token, {
      maxAge: res.access_token_max_age,
      ...cookie_config,
    });
    cookies().set(HUMANTREE_REFRESH_TOKEN, res.refresh_token, {
      maxAge: res.refresh_token_max_age,
      ...cookie_config,
    });
    cookies().set(HUMANTREE_ROLE, res.user.role, {
      maxAge: res.refresh_token_max_age,
      ...cookie_config,
    });
  }
};
