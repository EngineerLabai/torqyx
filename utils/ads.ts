import { resolveInternalPath, stripLocaleFromPath } from "@/utils/locale-path";
import { DEEP_CONTENT_TOOL_IDS } from "@/utils/tool-ad-eligibility";

export const normalizeAdPath = (pathname: string) => resolveInternalPath(stripLocaleFromPath(pathname || "/"));

export const isAdsAllowedPath = (pathname: string) => {
  const path = normalizeAdPath(pathname);

  // Article / blog pages (single-segment slug only)
  if (path.startsWith("/blog/")) {
    const slug = path.replace(/^\/blog\//, "");
    return Boolean(slug && !slug.includes("/"));
  }

  // Deep engineering calculator pages (only the 9 priority tools with 600+ word guides)
  if (path.startsWith("/tools/")) {
    const segments = path.replace(/^\/tools\//, "").split("/").filter(Boolean);
    // Block reports (/tools/.../report), guides subpaths, or generic /tools library
    if (segments.length !== 1) return false;
    const toolId = segments[0];
    return DEEP_CONTENT_TOOL_IDS.has(toolId);
  }

  return false;
};
