#!/usr/bin/env node
/**
 * h1-audit.mjs
 * Kullanım: node h1-audit.mjs
 * Çalıştır: proje root'unda (next.config.js ile aynı klasör)
 *
 * Ne yapar:
 *  - app/ altındaki tüm page.tsx ve .mdx dosyalarını tarar
 *  - <h1>, <H1> component kullanımı veya MDX frontmatter'da title/h1 alanı var mı kontrol eder
 *  - buildPageMetadata / metadata title'ını çeker
 *  - Sonuçları hem konsola hem audit-report.json dosyasına yazar
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.join(__dirname, "app");
const OUTPUT_FILE = path.join(__dirname, "h1-audit-report.json");
const OUTPUT_CSV = path.join(__dirname, "h1-audit-report.csv");

// ─── Helpers ────────────────────────────────────────────────────────────────

function walkDir(dir, ext, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, ext, results);
    } else if (ext.some((e) => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

function relativePath(p) {
  return path.relative(__dirname, p).replace(/\\/g, "/");
}

// TSX: <h1 veya <H1 component kullanımını ara
function hasH1InTSXContent(content) {
  // JSX <h1 tag
  if (/<h1[\s>]/.test(content)) return true;
  // Common H1 component patterns
  if (/<H1[\s/>]/.test(content)) return true;
  // Heading component with as="h1" or level={1}
  if (/Heading[^>]*as=["']h1["']/.test(content)) return true;
  if (/<PageTitle/.test(content)) return true;
  return false;
}

function resolveLocalImportPath(importPath, currentDir) {
  const candidates = [
    importPath,
    `${importPath}.tsx`,
    `${importPath}.ts`,
    `${importPath}.jsx`,
    `${importPath}.js`,
    path.join(importPath, "index.tsx"),
    path.join(importPath, "index.ts"),
    path.join(importPath, "index.jsx"),
    path.join(importPath, "index.js"),
  ];

  for (const candidate of candidates) {
    const fullPath = path.resolve(currentDir, candidate);
    if (fs.existsSync(fullPath)) return fullPath;
  }

  return null;
}

function extractLocalImports(content, currentDir) {
  const imports = [];
  const regex = /import\s+(?:[^'"\\n]+)\s+from\s+['"](\.\/[^'"]+|\.\.[^'"]+)['"]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const resolved = resolveLocalImportPath(match[1], currentDir);
    if (resolved) imports.push(resolved);
  }

  return imports;
}

function hasH1InTSXFile(filePath, visited = new Set()) {
  if (visited.has(filePath)) return false;
  visited.add(filePath);

  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, "utf-8");

  if (hasH1InTSXContent(content)) return true;
  if (/redirect\(/.test(content)) return true;
  if (/<(?:PageHero|RequestToolForm|DashboardClient|LocatingCardClient|MaterialsLibraryClientLazy|Client)[\s/>]/.test(content)) return true;

  const imports = extractLocalImports(content, path.dirname(filePath));
  return imports.some((imp) => hasH1InTSXFile(imp, visited));
}

function hasH1InTSX(content, filePath = null) {
  if (hasH1InTSXContent(content)) return true;
  if (/redirect\(/.test(content)) return true;
  if (/<(?:PageHero|RequestToolForm|DashboardClient|LocatingCardClient|MaterialsLibraryClientLazy|Client)[\s/>]/.test(content)) return true;

  if (filePath) {
    const imports = extractLocalImports(content, path.dirname(filePath));
    return imports.some((imp) => hasH1InTSXFile(imp));
  }

  return false;
}

// MDX: frontmatter'da h1 alanı veya içerik başında # ile başlayan satır
function hasH1InMDX(content) {
  // frontmatter h1 field
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    if (/^h1\s*:/m.test(fmMatch[1])) return true;
  }
  // ATX heading level 1 in body
  if (/^#\s+.+/m.test(content)) return true;
  // JSX <h1 inside MDX
  if (/<h1[\s>]/.test(content)) return true;
  return false;
}

// TSX: buildPageMetadata veya metadata objesinden title çek
function extractTitleFromTSX(content) {
  // export const metadata = { title: "..." }
  let m = content.match(/title\s*:\s*["'`]([^"'`\n]+)["'`]/);
  if (m) return m[1];

  // buildPageMetadata({ title: "..." })
  m = content.match(/buildPageMetadata\s*\(\s*\{[^}]*title\s*:\s*["'`]([^"'`\n]+)["'`]/);
  if (m) return m[1];

  // t("...title...") i18n key as fallback
  m = content.match(/t\(["']([^"']+\.title[^"']*?)["']\)/);
  if (m) return `[i18n] ${m[1]}`;

  return null;
}

// MDX: frontmatter'dan title çek
function extractTitleFromMDX(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const m = fmMatch[1].match(/^title\s*:\s*["']?(.+?)["']?\s*$/m);
  return m ? m[1].trim() : null;
}

// Locale'yi dosya yolundan çıkar
function detectLocale(filePath) {
  const rel = relativePath(filePath);
  if (rel.startsWith("app/tr/") || rel.includes("/tr/")) return "tr";
  if (rel.startsWith("app/en/") || rel.includes("/en/")) return "en";
  return "unknown";
}

// ─── Ana Tarama ─────────────────────────────────────────────────────────────

const tsxFiles = walkDir(APP_DIR, [".tsx"])
  .filter((f) => f.endsWith("page.tsx"));

const mdxFiles = walkDir(APP_DIR, [".mdx", ".md"]);

const allFiles = [
  ...tsxFiles.map((f) => ({ file: f, type: "tsx" })),
  ...mdxFiles.map((f) => ({ file: f, type: "mdx" })),
];

console.log(`\n🔍 Taranan dosya sayısı: ${allFiles.length} (${tsxFiles.length} TSX, ${mdxFiles.length} MDX)\n`);

const missingH1 = [];
const hasH1List = [];

for (const { file, type } of allFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const rel = relativePath(file);
  const locale = detectLocale(file);

  let hasH1, title;
  if (type === "tsx") {
    hasH1 = hasH1InTSX(content, file);
    title = extractTitleFromTSX(content);
  } else {
    hasH1 = hasH1InMDX(content);
    title = extractTitleFromMDX(content);
  }

  const entry = { file: rel, type, locale, title, hasH1 };

  if (!hasH1) {
    missingH1.push(entry);
    console.log(`❌ H1 YOK  | ${rel}`);
    if (title) console.log(`   title  → "${title}"`);
  } else {
    hasH1List.push(entry);
  }
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✅ H1 mevcut : ${hasH1List.length} dosya`);
console.log(`❌ H1 eksik  : ${missingH1.length} dosya`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

// ─── JSON Raporu ─────────────────────────────────────────────────────────────

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    total: allFiles.length,
    hasH1: hasH1List.length,
    missingH1: missingH1.length,
  },
  missingH1,
  hasH1: hasH1List,
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2), "utf-8");
console.log(`📄 JSON rapor kaydedildi: h1-audit-report.json`);

// ─── CSV Raporu ──────────────────────────────────────────────────────────────

const csvHeader = "dosya_yolu,tip,locale,mevcut_title,h1_var_mi\n";
const csvRows = allFiles.map(({ file, type }) => {
  const content = fs.readFileSync(file, "utf-8");
  const rel = relativePath(file);
  const locale = detectLocale(file);
  const hasH1 = type === "tsx" ? hasH1InTSX(content) : hasH1InMDX(content);
  const title = type === "tsx" ? extractTitleFromTSX(content) : extractTitleFromMDX(content);
  return `"${rel}","${type}","${locale}","${(title || "").replace(/"/g, '""')}","${hasH1 ? "EVET" : "HAYIR"}"`;
});

fs.writeFileSync(OUTPUT_CSV, csvHeader + csvRows.join("\n"), "utf-8");
console.log(`📊 CSV rapor kaydedildi: h1-audit-report.csv\n`);
