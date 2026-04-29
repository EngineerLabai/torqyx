import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

export type HeroAssetKey =
  | "about"
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
  about: "/images/workspace.webp",
  home: "/images/home-hero.webp",
  tools: "/images/tool-library.webp",
  blog: "/images/blog-hero.webp",
  guides: "/images/guides-hero.webp",
  glossary: "/images/glossary-hero.webp",
  community: "/images/community-hero.webp",
  support: "/images/support-hero.webp",
  premium: "/images/premium-hero.webp",
  toolDetail: "/images/tool-detail.webp",
  projectHub: "/images/project-page.webp",
  qualityTools: "/images/quality-tools-hero.webp",
  fixtureTools: "/images/fixture-tools-hero.webp",
};

const PUBLIC_DIR = path.join(process.cwd(), "public");
let knownImageAssetsCache: string[] | null = null;

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
    return existsSync(fullPath) ? candidate : HERO_PLACEHOLDER;
  } catch {
    return HERO_PLACEHOLDER;
  }
}

export function listHeroImagePaths(): string[] {
  return Array.from(new Set([...Object.values(HERO_ASSETS), HERO_PLACEHOLDER]));
}

export function listPublicImagePaths(): string[] {
  if (knownImageAssetsCache) {
    return knownImageAssetsCache;
  }

  const fallbackPaths = Array.from(new Set([...listHeroImagePaths(), "/images/logo.png"]));

  if (typeof window !== "undefined") {
    return fallbackPaths;
  }

  try {
    const imagesDir = path.join(PUBLIC_DIR, "images");
    const files = readdirSync(imagesDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => `/images/${entry.name}`);

    knownImageAssetsCache = Array.from(new Set([...fallbackPaths, ...files])).sort();
    return knownImageAssetsCache;
  } catch {
    knownImageAssetsCache = fallbackPaths;
    return knownImageAssetsCache;
  }
}
