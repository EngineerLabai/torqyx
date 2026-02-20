import { existsSync, readdirSync } from "node:fs";
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
  qualityTools: "/images/quality-tools-hero.jpg",
  fixtureTools: "/images/fixture-tools-hero.jpg",
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
    return existsSync(fullPath) ? candidate : "";
  } catch {
    return "";
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
