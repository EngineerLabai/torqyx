import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content");
const CONTENT_DIRS = {
  blog: "blog",
  guides: "guides",
  glossary: "glossary",
  changelog: "changelog",
  qa: "qa",
};
const LOCALES = ["tr", "en"];
const EXTENSIONS = new Set([".mdx", ".md"]);
const LOCALE_PATTERN = new RegExp(`^(.+)\\.(${LOCALES.join("|")})\\.(mdx|md)$`, "i");

const run = async () => {
  const invalidFiles = [];
  const duplicateFiles = [];
  const missingLocales = [];

  for (const [type, dirName] of Object.entries(CONTENT_DIRS)) {
    const dirPath = path.join(CONTENT_ROOT, dirName);
    let entries = [];

    try {
      entries = await fs.readdir(dirPath, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }

    const slugMap = new Map();

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name);
      if (!EXTENSIONS.has(ext)) continue;

      const match = LOCALE_PATTERN.exec(entry.name);
      if (!match) {
        invalidFiles.push(path.join(dirPath, entry.name));
        continue;
      }

      const slug = match[1];
      const locale = match[2];
      if (!slug) {
        invalidFiles.push(path.join(dirPath, entry.name));
        continue;
      }

      const localeMap = slugMap.get(slug) ?? new Map();
      if (localeMap.has(locale)) {
        duplicateFiles.push({
          type,
          slug,
          locale,
          first: localeMap.get(locale),
          second: path.join(dirPath, entry.name),
        });
      } else {
        localeMap.set(locale, path.join(dirPath, entry.name));
      }
      slugMap.set(slug, localeMap);
    }

    for (const [slug, localeMap] of slugMap.entries()) {
      const localesPresent = new Set(localeMap.keys());
      const missing = LOCALES.filter((locale) => !localesPresent.has(locale));
      if (missing.length > 0) {
        missingLocales.push({ type, slug, missing });
      }
    }
  }

  if (invalidFiles.length > 0 || duplicateFiles.length > 0) {
    if (invalidFiles.length > 0) {
      console.error("[content] Invalid filenames (missing locale suffix):");
      invalidFiles.forEach((file) => console.error(`- ${file}`));
    }
    if (duplicateFiles.length > 0) {
      console.error("[content] Duplicate locale entries:");
      duplicateFiles.forEach((item) => {
        console.error(`- ${item.type}/${item.slug} (${item.locale}): ${item.first} | ${item.second}`);
      });
    }
    process.exit(1);
  }

  if (missingLocales.length > 0) {
    console.warn("[content] Missing locale variants:");
    missingLocales.forEach((item) => {
      console.warn(`- ${item.type}/${item.slug}: missing ${item.missing.join(", ")}`);
    });
  }

  console.log("[content] Locale validation passed.");
};

run().catch((error) => {
  console.error("[content] Failed to validate content locales.");
  console.error(error);
  process.exit(1);
});
