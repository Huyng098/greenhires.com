import { NextRequest, NextResponse } from "next/server";
import { i18nMiddleware } from "./config";
import { HUMANTREE_REFRESH_TOKEN, HUMANTREE_ROLE } from "./constants/cookie";

const protectedRoutes = [
  "/dashboard",
  "/resume",
  "/consultant",
  "/admin",
  "/internal",
];

const signInRoute = "/internal/signin";

export async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get(HUMANTREE_REFRESH_TOKEN)?.value;
  const role = request.cookies.get(HUMANTREE_ROLE)?.value || "";
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isSignInRoute = request.nextUrl.pathname === signInRoute;
  let response = i18nMiddleware(request);

  if (!isSignInRoute) {
    if (isProtectedRoute && !refreshToken) {
      const redirectURL =
        request.nextUrl.pathname.includes("/consultant") ||
        request.nextUrl.pathname.includes("/admin")
          ? "/internal/signin"
          : "/auth/signin";
      response = NextResponse.redirect(
        new URL(redirectURL, request.nextUrl.origin).toString()
      );
      response.cookies.delete(HUMANTREE_REFRESH_TOKEN);
    } else if (
      role === "consultant" &&
      request.nextUrl.pathname.includes("/admin")
    ) {
      response = NextResponse.redirect(
        new URL("/internal/signin", request.nextUrl.origin).toString()
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
