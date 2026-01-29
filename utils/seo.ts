import { BRAND_NAME } from "@/utils/brand";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiengineerslab.com";

export const buildCanonical = (path: string) => {
  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return undefined;
  }
};

export const DEFAULT_OG_IMAGE = new URL("/og", SITE_URL).toString();
export const DEFAULT_OG_IMAGE_META = {
  url: DEFAULT_OG_IMAGE,
  width: 1200,
  height: 630,
  alt: BRAND_NAME,
};
