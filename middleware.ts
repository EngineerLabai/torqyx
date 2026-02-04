import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/utils/locale";
import { stripLocaleFromPath } from "@/utils/locale-path";

const PUBLIC_FILE = /\.(.*)$/;
const ONE_YEAR = 60 * 60 * 24 * 365;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segment = pathname.split("/")[1];

  if (isLocale(segment)) {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = stripLocaleFromPath(pathname);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", segment);
    const response = NextResponse.rewrite(rewritten, { request: { headers: requestHeaders } });
    response.cookies.set(LOCALE_COOKIE, segment, { path: "/", maxAge: ONE_YEAR });
    return response;
  }

  const redirected = request.nextUrl.clone();
  redirected.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(redirected);
}
