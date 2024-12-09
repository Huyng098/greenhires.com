"use server";

import { AUTH, USER } from "@/constants/apis";
import {
  HUMANTREE_ACCESS_TOKEN,
  HUMANTREE_REFRESH_TOKEN,
  HUMANTREE_ROLE,
} from "@/constants/cookie";
import { BaseMessageResponse, ErrorResponse } from "@/interfaces/base";
import { LoginResponse } from "@/interfaces/general/user";
import {
  forgotPasswordDto,
  loginDto,
  registerDto,
  resetPasswordDto,
  VerifyEmailDto
} from "@/interfaces/user";
import { set_cookies } from "@/utils/cookie/setCookie";
import { http } from "@/utils/http";
import { cookies } from "next/headers";

export const login = async (data: loginDto) => {
  const res = await http.post(AUTH.LOGIN, new URLSearchParams(data), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  if (res.error_code) {
    return res;
  }
  const body = res as LoginResponse;
  await set_cookies(body);
  return res.user;
};

export const loginWithGoogle = async () => {
  return `${process.env.API_URL}${AUTH.LOGIN_WITH_GOOGLE}`;
};

export const loginWithFacebook = async () => {
  return `${process.env.API_URL}${AUTH.LOGIN_WITH_FACEBOOK}`;
};

export const loginWithLinkedin = async () => {
  return `${process.env.API_URL}${AUTH.LOGIN_WITH_LINKEDIN}`;
};

export const register = async (data: registerDto): Promise<BaseMessageResponse | ErrorResponse> => {
  return await http.post(AUTH.REGISTER, data);
};

export const verifyEmail = async (data: VerifyEmailDto): Promise<BaseMessageResponse | ErrorResponse> => {
  return await http.post(AUTH.VERIFY_EMAIL, data);
}

export const resendVerifyEmail = async (data: Omit<VerifyEmailDto, 'token'>): Promise<BaseMessageResponse | ErrorResponse> => {
  return await http.post(AUTH.RESEND_VERIFY_EMAIL, data);
}

export const forgotPassword = async (data: forgotPasswordDto) => {
  return await http.post(AUTH.FORGOT_PASSWORD, data);
};

export const resetPassword = async (data: resetPasswordDto) => {
  return await http.post(AUTH.RESET_PASSWORD, {
    token: data.token,
    password: data.password,
  });
};

export const logout = async () => {
  // delete refresh token from server
  await http.post(USER.LOGOUT, undefined, {}, true);
  cookies().delete(HUMANTREE_ACCESS_TOKEN);
  cookies().delete(HUMANTREE_REFRESH_TOKEN);
  cookies().delete(HUMANTREE_ROLE);
};
