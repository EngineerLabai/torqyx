import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "content");
const MESSAGE_ROOT = path.join(ROOT, "messages");
const CONTENT_TYPES = ["blog", "guides", "glossary", "changelog", "qa"];
const LOCALES = ["tr", "en"];
const EXTENSIONS = [".mdx", ".md"];
const TOOL_DOC_EXTENSIONS = [".mdx", ".md"];

const LOCALE_FILE_REGEX = /^(.+)\.(tr|en)\.(mdx|md)$/i;

const flattenKeys = (value, prefix = "", output = new Set()) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenKeys(item, `${prefix}[${index}]`, output));
    return output;
  }

  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      flattenKeys(nested, prefix ? `${prefix}.${key}` : key, output);
    }
    return output;
  }

  if (prefix) output.add(prefix);
  return output;
};

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, "utf8"));

const collectContentCoverage = async () => {
  const missing = [];

  for (const type of CONTENT_TYPES) {
    const dirPath = path.join(CONTENT_ROOT, type);
    let entries = [];
    try {
      entries = await fs.readdir(dirPath, { withFileTypes: true });
    } catch (error) {
      if (error && error.code === "ENOENT") continue;
      throw error;
    }

    const slugMap = new Map();
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name);
      if (!EXTENSIONS.includes(ext)) continue;

      const match = LOCALE_FILE_REGEX.exec(entry.name);
      if (!match) continue;
      const slug = match[1];
      const locale = match[2];
      const set = slugMap.get(slug) ?? new Set();
      set.add(locale);
      slugMap.set(slug, set);
    }

    for (const [slug, locales] of slugMap.entries()) {
      for (const locale of LOCALES) {
        if (!locales.has(locale)) {
          missing.push({ type, slug, locale });
        }
      }
    }
  }

  return missing;
};

const collectToolDocCoverage = async () => {
  const catalogRaw = await fs.readFile(path.join(ROOT, "tools", "_shared", "catalog.ts"), "utf8");
  const hrefRegex = /href:\s*"([^"]+)"/g;
  const slugs = new Set();

  for (const match of catalogRaw.matchAll(hrefRegex)) {
    const href = match[1];
    if (!href.startsWith("/tools/")) continue;
    slugs.add(href.replace(/^\/tools\//, "").replace(/^\/+|\/+$/g, ""));
  }

  const hasDocFor = async (slug, locale) => {
    const candidates = [];
    for (const ext of TOOL_DOC_EXTENSIONS) {
      candidates.push(`${slug}.${locale}${ext}`);
      candidates.push(`${slug}/${locale}${ext}`);
      candidates.push(`${slug}/explanation.${locale}${ext}`);
      candidates.push(`${slug}/examples.${locale}${ext}`);
    }

    for (const candidate of candidates) {
      try {
        await fs.access(path.join(CONTENT_ROOT, "tools", candidate));
        return true;
      } catch {
        continue;
      }
    }
    return false;
  };

  const missingRequired = [];
  const missingOptional = [];

  for (const slug of slugs) {
    if (!(await hasDocFor(slug, "tr"))) {
      missingRequired.push({ slug, locale: "tr" });
    }
    if (!(await hasDocFor(slug, "en"))) {
      missingOptional.push({ slug, locale: "en" });
    }
  }

  return {
    totalTools: slugs.size,
    missingRequired,
    missingOptional,
  };
};

const collectMessageCoverage = async () => {
  const tr = await readJson(path.join(MESSAGE_ROOT, "tr.json"));
  const en = await readJson(path.join(MESSAGE_ROOT, "en.json"));
  const trKeys = flattenKeys(tr);
  const enKeys = flattenKeys(en);

  const missingInTr = [...enKeys].filter((key) => !trKeys.has(key));
  const missingInEn = [...trKeys].filter((key) => !enKeys.has(key));

  return {
    totalTr: trKeys.size,
    totalEn: enKeys.size,
    missingInTr,
    missingInEn,
  };
};

const report = async () => {
  const [contentMissing, toolDocs, messages] = await Promise.all([
    collectContentCoverage(),
    collectToolDocCoverage(),
    collectMessageCoverage(),
  ]);

  const summary = {
    generatedAt: new Date().toISOString(),
    contentMissing,
    toolDocs,
    messages,
  };

  const outputDir = path.join(ROOT, "artifacts");
  await fs.mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "i18n-status.json");
  await fs.writeFile(outputPath, JSON.stringify(summary, null, 2), "utf8");

  const markdownLines = [
    "# i18n status",
    "",
    `Generated: ${summary.generatedAt}`,
    "",
    `- Content missing locale variants: ${contentMissing.length}`,
    `- Tool docs missing required TR: ${toolDocs.missingRequired.length}`,
    `- Tool docs missing optional EN: ${toolDocs.missingOptional.length}`,
    `- Message key mismatch (TR missing): ${messages.missingInTr.length}`,
    `- Message key mismatch (EN missing): ${messages.missingInEn.length}`,
    "",
  ];

  if (contentMissing.length > 0) {
    markdownLines.push("## Missing content locale variants");
    for (const item of contentMissing.slice(0, 200)) {
      markdownLines.push(`- ${item.type}/${item.slug}: missing ${item.locale}`);
    }
    markdownLines.push("");
  }

  if (toolDocs.missingRequired.length > 0 || toolDocs.missingOptional.length > 0) {
    markdownLines.push("## Tool docs coverage");
    if (toolDocs.missingRequired.length > 0) {
      markdownLines.push("- Missing required TR docs:");
      for (const item of toolDocs.missingRequired.slice(0, 200)) {
        markdownLines.push(`  - ${item.slug}`);
      }
    }
    if (toolDocs.missingOptional.length > 0) {
      markdownLines.push("- Missing optional EN docs:");
      for (const item of toolDocs.missingOptional.slice(0, 200)) {
        markdownLines.push(`  - ${item.slug}`);
      }
    }
    markdownLines.push("");
  }

  const markdownPath = path.join(outputDir, "i18n-status.md");
  await fs.writeFile(markdownPath, markdownLines.join("\n"), "utf8");

  console.log(`[i18n] status report written to ${path.relative(ROOT, outputPath)} and ${path.relative(ROOT, markdownPath)}.`);
  if (contentMissing.length > 0 || messages.missingInEn.length > 0 || messages.missingInTr.length > 0 || toolDocs.missingRequired.length > 0) {
    process.exitCode = 1;
  }
};

report().catch((error) => {
  console.error("[i18n] failed to generate status report.");
  console.error(error);
  process.exit(1);
});
