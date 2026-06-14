import { resolveInternalPath, stripLocaleFromPath } from "@/utils/locale-path";

export const normalizeAdPath = (pathname: string) => resolveInternalPath(stripLocaleFromPath(pathname || "/"));

export const isAdsAllowedPath = (pathname: string) => {
  const path = normalizeAdPath(pathname);

  if (path.startsWith("/blog/")) {
    return true;
  }

  return false;
};
