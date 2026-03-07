import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, "tools", "_shared", "catalog.ts");
const CONTENT_ROOT = path.join(ROOT, "content", "tools");
const REQUIRED_LOCALES = ["tr", "en"];
const EXTENSIONS = [".mdx", ".md"];

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const normalizeSlug = (slug) => slug.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");

const buildCandidates = (slug, locale) => {
  const safeSlug = normalizeSlug(slug);
  if (!safeSlug || safeSlug.includes("..")) return [];

  const candidates = [];
  for (const ext of EXTENSIONS) {
    candidates.push(`${safeSlug}.${locale}${ext}`);
    candidates.push(`${safeSlug}/${locale}${ext}`);
    candidates.push(`${safeSlug}/explanation.${locale}${ext}`);
    candidates.push(`${safeSlug}/examples.${locale}${ext}`);
  }
  return candidates;
};

const hasDocsForLocale = async (slug, locale) => {
  const candidates = buildCandidates(slug, locale);
  for (const candidate of candidates) {
    const fullPath = path.join(CONTENT_ROOT, candidate);
    if (await fileExists(fullPath)) return true;
  }
  return false;
};

const readFeaturedToolSlugs = async () => {
  const raw = await fs.readFile(CATALOG_PATH, "utf8");
  const objectRegex = /\{[\s\S]*?\}\s*,?/g;
  const slugs = new Set();

  for (const match of raw.matchAll(objectRegex)) {
    const block = match[0];
    if (!/featured:\s*true/.test(block)) continue;

    const hrefMatch = /href:\s*"([^"]+)"/.exec(block);
    if (!hrefMatch) continue;

    const href = hrefMatch[1];
    if (!href.startsWith("/tools/")) continue;
    const slug = normalizeSlug(href.replace(/^\/tools\//, ""));
    if (slug) slugs.add(slug);
  }

  return Array.from(slugs);
};

const run = async () => {
  const featuredSlugs = await readFeaturedToolSlugs();
  if (featuredSlugs.length === 0) {
    console.error("[featured-docs] No featured tools found in catalog.");
    process.exit(1);
  }

  const missing = [];

  for (const slug of featuredSlugs) {
    for (const locale of REQUIRED_LOCALES) {
      const ok = await hasDocsForLocale(slug, locale);
      if (!ok) {
        missing.push({ slug, locale });
      }
    }
  }

  if (missing.length > 0) {
    console.error("[featured-docs] Missing required featured tool docs:");
    missing.forEach(({ slug, locale }) => {
      console.error(`- ${slug} (${locale})`);
    });
    process.exit(1);
  }

  console.log(
    `[featured-docs] OK: ${featuredSlugs.length} featured tools validated for ${REQUIRED_LOCALES.join(", ")}.`,
  );
};

run().catch((error) => {
  console.error("[featured-docs] Failed to validate featured docs.");
  console.error(error);
  process.exit(1);
});
