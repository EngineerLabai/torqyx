import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/utils/locale";
import { resolveInternalPath, resolveLocalePublicPath, stripLocaleFromPath } from "@/utils/locale-path";

const PUBLIC_FILE = /\.(.*)$/;
const ONE_YEAR = 60 * 60 * 24 * 365;
const LOCALE_PREFIXED_PATHS = ["/tools", "/project-hub", "/quality-tools", "/standards", "/materials", "/projects"];
const LOCALE_PRESERVE_PATHS = new Set([
  "/standards/threads",
  "/standards/materials",
  "/standards/fits",
  "/standards/fluids",
]);
const LOCALE_PRESERVE_PREFIXES = ["/project-hub", "/materials", "/projects"];

const toLocalePath = (locale: "tr" | "en", pathname: string) => (pathname === "/" ? `/${locale}` : `/${locale}${pathname}`);

const getPreferredLocale = (request: NextRequest) => {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  return isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
};

export default function proxy(request: NextRequest) {
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
    const internalPath = resolveInternalPath(basePath);
    const canonicalPublicPath = resolveLocalePublicPath(segment, internalPath);

    if (canonicalPublicPath !== basePath) {
      const canonicalUrl = request.nextUrl.clone();
      canonicalUrl.pathname = toLocalePath(segment, canonicalPublicPath);
      canonicalUrl.search = request.nextUrl.search;
      const response = NextResponse.redirect(canonicalUrl);
      response.cookies.set(LOCALE_COOKIE, segment, { path: "/", maxAge: ONE_YEAR });
      return response;
    }

    const shouldPreserve =
      LOCALE_PRESERVE_PATHS.has(internalPath) ||
      LOCALE_PRESERVE_PREFIXES.some((prefix) => internalPath === prefix || internalPath.startsWith(`${prefix}/`));
    if (shouldPreserve) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-locale", segment);
      const response = NextResponse.next({ request: { headers: requestHeaders } });
      response.cookies.set(LOCALE_COOKIE, segment, { path: "/", maxAge: ONE_YEAR });
      return response;
    }
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = internalPath;
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
  const internalPath = resolveInternalPath(pathname);
  const localizedPath = resolveLocalePublicPath(redirectLocale, internalPath);
  const redirected = request.nextUrl.clone();
  redirected.pathname = toLocalePath(redirectLocale, localizedPath);
  redirected.search = request.nextUrl.search;
  return NextResponse.redirect(redirected);
}
