import "server-only";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "@/utils/locale";

export const getLocaleFromCookies = async (): Promise<Locale> => {
  const headerStore = await headers();
  const headerLocale = headerStore.get("x-locale");
  if (isLocale(headerLocale)) {
    return headerLocale;
  }
  const cookieStore = await cookies();
  const stored = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
};
