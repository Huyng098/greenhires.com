export const HUMANTREE_ACCESS_TOKEN = "accessToken";
export const HUMANTREE_REFRESH_TOKEN = "refreshToken";
export const HUMANTREE_ROLE = "role";
export const HUMANTREE_ACCESS_TOKEN_EXPIRED = "accessTokenExpiredIn";

export const cookie_config = {
  path: "/",
  secure: true,
  sameSite: "strict" as "lax" | "strict" | "none" | undefined,
  httpOnly: true,
};
