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

export const HERO_PLACEHOLDER = "/illustrations/placeholder.webp";

export const HERO_ASSETS: Record<HeroAssetKey, string> = {
  home: "/illustrations/home-hero.jpg",
  tools: "/illustrations/tools-hero.jpg",
  blog: "/illustrations/blog-hero.jpg",
  guides: "/illustrations/guides-hero.jpg",
  glossary: "/illustrations/glossary-hero.jpg",
  community: "/illustrations/community-hero.jpg",
  support: "/illustrations/support-hero.jpg",
  premium: "/illustrations/premium-hero.jpg",
  toolDetail: "/illustrations/tool-detail.jpg",
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
