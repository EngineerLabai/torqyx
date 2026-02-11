import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/utils/locale";
import { stripLocaleFromPath } from "@/utils/locale-path";

const PUBLIC_FILE = /\.(.*)$/;
const ONE_YEAR = 60 * 60 * 24 * 365;
const LOCALE_PREFIXED_PATHS = ["/tools", "/project-hub", "/quality-tools", "/standards"];
const LOCALE_PRESERVE_PATHS = new Set([
  "/standards/threads",
  "/standards/materials",
  "/standards/fits",
  "/standards/fluids",
]);
const LOCALE_PRESERVE_PREFIXES = ["/project-hub"];

const getPreferredLocale = (request: NextRequest) => {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  return isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
};

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

  const headerLocale = request.headers.get("x-locale");
  if (isLocale(headerLocale)) {
    return NextResponse.next();
  }

  const segment = pathname.split("/")[1];

  if (isLocale(segment)) {
    const basePath = stripLocaleFromPath(pathname);
    const shouldPreserve =
      LOCALE_PRESERVE_PATHS.has(basePath) ||
      LOCALE_PRESERVE_PREFIXES.some((prefix) => basePath === prefix || basePath.startsWith(`${prefix}/`));
    if (shouldPreserve) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-locale", segment);
      const response = NextResponse.next({ request: { headers: requestHeaders } });
      response.cookies.set(LOCALE_COOKIE, segment, { path: "/", maxAge: ONE_YEAR });
      return response;
    }
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = basePath;
    rewritten.search = request.nextUrl.search;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", segment);
    const response = NextResponse.rewrite(rewritten, { request: { headers: requestHeaders } });
    response.cookies.set(LOCALE_COOKIE, segment, { path: "/", maxAge: ONE_YEAR });
    return response;
  }

  const shouldLocaleRedirect = LOCALE_PREFIXED_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  const redirectLocale = shouldLocaleRedirect ? getPreferredLocale(request) : DEFAULT_LOCALE;
  const redirected = request.nextUrl.clone();
  redirected.pathname = `/${redirectLocale}${pathname === "/" ? "" : pathname}`;
  redirected.search = request.nextUrl.search;
  return NextResponse.redirect(redirected);
}
