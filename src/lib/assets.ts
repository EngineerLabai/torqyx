import { existsSync } from "node:fs";
import path from "node:path";

export type HeroAssetKey =
  | "home"
  | "tools"
  | "blog"
  | "guides"
  | "glossary"
  | "community"
  | "support"
  | "premium"
  | "toolDetail"
  | "projectHub"
  | "qualityTools"
  | "fixtureTools";

export const HERO_PLACEHOLDER = "/images/placeholder.webp";

export const HERO_ASSETS: Record<HeroAssetKey, string> = {
  home: "/images/home-hero.jpg",
  tools: "/images/tool-library.jpg",
  blog: "/images/blog-hero.jpg",
  guides: "/images/guides-hero.jpg",
  glossary: "/images/glossary-hero.jpg",
  community: "/images/community-hero.jpg",
  support: "/images/support-hero.jpg",
  premium: "/images/premium-hero.jpg",
  toolDetail: "/images/tool-detail.jpg",
  projectHub: HERO_PLACEHOLDER,
  qualityTools: HERO_PLACEHOLDER,
  fixtureTools: HERO_PLACEHOLDER,
};

const PUBLIC_DIR = path.join(process.cwd(), "public");

export function getHeroImageSrc(key: HeroAssetKey): string {
  const candidate = HERO_ASSETS[key];

  if (!candidate) {
    return "";
  }

  if (typeof window !== "undefined") {
    return candidate;
  }

  try {
    const normalized = candidate.startsWith("/") ? candidate.slice(1) : candidate;
    const fullPath = path.join(PUBLIC_DIR, normalized);
    return existsSync(fullPath) ? candidate : "";
  } catch {
    return "";
  }
}

export function listHeroImagePaths(): string[] {
  return Array.from(new Set([...Object.values(HERO_ASSETS), HERO_PLACEHOLDER]));
}
