import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, "tools", "_shared", "catalog.ts");
const CONTENT_ROOT = path.join(ROOT, "content", "tools");
const REQUIRED_LOCALES = ["tr"];
const OPTIONAL_LOCALES = ["en"];
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

const readToolSlugs = async () => {
  const raw = await fs.readFile(CATALOG_PATH, "utf8");
  const hrefRegex = /href:\s*"([^"]+)"/g;
  const slugs = new Set();
  for (const match of raw.matchAll(hrefRegex)) {
    const href = match[1];
    if (!href.startsWith("/tools/")) continue;
    const slug = normalizeSlug(href.replace(/^\/tools\//, ""));
    if (slug) slugs.add(slug);
  }
  return Array.from(slugs);
};

const run = async () => {
  const slugs = await readToolSlugs();
  const missingRequired = [];
  const missingOptional = [];

  for (const slug of slugs) {
    for (const locale of REQUIRED_LOCALES) {
      const ok = await hasDocsForLocale(slug, locale);
      if (!ok) {
        missingRequired.push({ slug, locale });
      }
    }
    for (const locale of OPTIONAL_LOCALES) {
      const ok = await hasDocsForLocale(slug, locale);
      if (!ok) {
        missingOptional.push({ slug, locale });
      }
    }
  }

  if (missingRequired.length > 0) {
    console.error("[tool-docs] Missing required tool docs:");
    missingRequired.forEach(({ slug, locale }) => {
      console.error(`- ${slug} (${locale})`);
    });
    process.exit(1);
  }

  if (missingOptional.length > 0) {
    console.warn("[tool-docs] Missing optional tool docs:");
    missingOptional.forEach(({ slug, locale }) => {
      console.warn(`- ${slug} (${locale})`);
    });
  }

  console.log(
    `[tool-docs] OK: ${slugs.length} tool slugs validated for ${REQUIRED_LOCALES.join(", ")}.`,
  );
};

run().catch((error) => {
  console.error("[tool-docs] Failed to validate tool docs.");
  console.error(error);
  process.exit(1);
});
