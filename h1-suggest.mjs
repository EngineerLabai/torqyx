#!/usr/bin/env node
/**
 * h1-suggest.mjs
 * Kullanım: node h1-suggest.mjs
 * Önce h1-audit.mjs çalıştırılmış olmalı (h1-audit-report.json gerekli)
 *
 * Ne yapar:
 *  - h1-audit-report.json okur
 *  - Her eksik H1 için title'dan TR + EN H1 önerisi üretir
 *  - Araç sayfaları için özel keyword injection yapar (ISO standartları vb.)
 *  - h1-suggestions.json + konsol tablosu üretir
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORT_FILE = path.join(__dirname, "h1-audit-report.json");
const OUTPUT_FILE = path.join(__dirname, "h1-suggestions.json");

if (!fs.existsSync(REPORT_FILE)) {
  console.error("❌ h1-audit-report.json bulunamadı. Önce 'node h1-audit.mjs' çalıştırın.");
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(REPORT_FILE, "utf-8"));

// ─── Araç Sayfaları için Anahtar Kelime Eşlemeleri ──────────────────────────
// Dosya yolu pattern → { keyword_tr, keyword_en, standard }
// Kendi araçlarınıza göre bu listeyi genişletin.
const TOOL_KEYWORDS = [
  // Genel sayfalar
  { pattern: /\/blog(\/|$)/i,                 tr: "Blog",                        en: "Blog",                         std: null },
  { pattern: /\/cerez-politikasi(\/|$)/i,     tr: "Çerez Politikası",             en: "Cookie Policy",                std: null },
  { pattern: /\/community(\/|$)/i,            tr: "Topluluk",                     en: "Community",                    std: null },
  { pattern: /\/dashboard(\/|$)/i,            tr: "Dashboard",                    en: "Dashboard",                    std: null },
  { pattern: /\/faq(\/|$)/i,                  tr: "Sıkça Sorulan Sorular",         en: "FAQ",                          std: null },
  { pattern: /\/fixture-tools(\/|$)/i,        tr: "Fixture Araçları",             en: "Fixture Tools",                std: null },
  { pattern: /\/forum(\/|$)/i,                tr: "Forum",                        en: "Forum",                        std: null },
  { pattern: /\/gizlilik(\/|$)/i,             tr: "Gizlilik Politikası",          en: "Privacy Policy",               std: null },
  { pattern: /\/glossary(\/|$)/i,             tr: "Sözlük",                       en: "Glossary",                     std: null },
  { pattern: /\/guides(\/|$)/i,               tr: "Rehberler",                    en: "Guides",                       std: null },
  { pattern: /\/hakkinda(\/|$)/i,             tr: "Hakkında",                     en: "About",                        std: null },
  { pattern: /\/iletisim(\/|$)/i,             tr: "İletişim",                     en: "Contact",                      std: null },
  { pattern: /\/kullanim-sartlari(\/|$)/i,    tr: "Kullanım Şartları",            en: "Terms of Use",                 std: null },
  { pattern: /\/premium(\/|$)/i,              tr: "Premium",                      en: "Premium",                      std: null },
  { pattern: /\/pricing(\/|$)/i,              tr: "Fiyatlandırma",                en: "Pricing",                      std: null },
  { pattern: /\/qa(\/|$)/i,                   tr: "Soru & Cevap",                 en: "QA",                           std: null },
  { pattern: /\/quality-tools(\/|$)/i,        tr: "Kalite Araçları",              en: "Quality Tools",                std: null },
  { pattern: /\/reference(\/|$)/i,            tr: "Referans",                     en: "Reference",                    std: null },
  { pattern: /\/request-tool(\/|$)/i,         tr: "Araç Talebi",                  en: "Request Tool",                 std: null },
  { pattern: /\/standards(\/|$)/i,            tr: "Standartlar",                  en: "Standards",                    std: null },
  { pattern: /\/support(\/|$)/i,              tr: "Destek",                       en: "Support",                      std: null },
  { pattern: /\/tables(\/|$)/i,               tr: "Referans Tabloları",           en: "Reference Tables",             std: null },
  { pattern: /\/projects(\/|$)/i,             tr: "Projeler",                     en: "Projects",                     std: null },
  { pattern: /\/project-hub(\/|$)/i,          tr: "Proje Merkezi",                en: "Project Hub",                  std: null },
  { pattern: /\/materials(\/|$)/i,            tr: "Malzemeler",                   en: "Materials",                    std: null },
  // Makine / Mühendislik hesaplayıcıları
  { pattern: /gear|dis[il]i/i,       tr: "Dişli Tasarımı Hesaplayıcı",        en: "Gear Design Calculator",           std: "ISO 6336" },
  { pattern: /shaft|mil/i,            tr: "Mil Hesaplayıcı",                    en: "Shaft Calculator",                  std: "DIN 743" },
  { pattern: /bearing|rulman/i,       tr: "Rulman Seçim Hesaplayıcı",          en: "Bearing Selection Calculator",      std: "ISO 281" },
  { pattern: /spring|yay/i,          tr: "Yay Tasarımı Hesaplayıcı",           en: "Spring Design Calculator",          std: "DIN 2089" },
  { pattern: /bolt|civata|screw/i,   tr: "Civata Hesaplayıcı",                 en: "Bolt & Screw Calculator",           std: "ISO 898" },
  { pattern: /weld|kaynak/i,         tr: "Kaynak Hesaplayıcı",                 en: "Weld Calculator",                   std: "AWS D1.1" },
  { pattern: /beam|kiri[sş]/i,       tr: "Kiriş Hesaplayıcı",                  en: "Beam Calculator",                   std: "AISC" },
  { pattern: /column|kolon/i,        tr: "Kolon Stabilite Hesaplayıcı",        en: "Column Stability Calculator",       std: "Euler" },
  { pattern: /fatigue|yorulma/i,     tr: "Yorulma Analizi Hesaplayıcı",        en: "Fatigue Analysis Calculator",       std: "ASME" },
  { pattern: /heat|[ıi]s[ıi]/i,     tr: "Isı Transferi Hesaplayıcı",          en: "Heat Transfer Calculator",          std: "ASHRAE" },
  { pattern: /fluid|ak[ıi][şs]/i,   tr: "Akışkanlar Dinamiği Hesaplayıcı",   en: "Fluid Dynamics Calculator",         std: "ISO" },
  { pattern: /stress|gerilme/i,      tr: "Gerilme Analizi Hesaplayıcı",        en: "Stress Analysis Calculator",        std: "FEA" },
  { pattern: /material|malzeme/i,    tr: "Malzeme Seçim Rehberi",             en: "Material Selection Guide",          std: null },
  { pattern: /motor|engine/i,        tr: "Motor Seçim Hesaplayıcı",           en: "Motor Selection Calculator",        std: "IEC" },
];

// ─── Başlık Dönüştürme Kuralları ─────────────────────────────────────────────

function toTitleCase(str) {
  return str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Dosya yolundan slug/araç adını çıkar
function extractSlugName(filePath) {
  // app/tr/tools/gear-calculator/page.tsx → gear-calculator
  const parts = filePath.split("/");
  // "page.tsx" veya "[slug]" gibi son iki parçayı atla
  const meaningful = parts.filter(
    (p) => p !== "page.tsx" && p !== "page.mdx" && !p.startsWith("[") && p !== "app"
  );
  return meaningful[meaningful.length - 1] || "";
}

function findToolKeyword(filePath, title) {
  const combined = (filePath + " " + (title || "")).toLowerCase();
  for (const kw of TOOL_KEYWORDS) {
    if (kw.pattern.test(combined)) return kw;
  }
  return null;
}

function isPlaceholderTitle(title) {
  if (!title) return false;
  return /\$\{.*?\}/.test(title) || title.includes("copy.title") || title.includes("brandContent.siteName") || title.includes("copy.badge");
}

function generateH1(entry) {
  const { file, locale, title } = entry;
  const slug = extractSlugName(file);
  const kw = findToolKeyword(file, title);

  // Eğer sayfanın OpenGraph/metadata title'ı özel bir şeye dayanıyorsa, manuel kontrol et.
  if (isPlaceholderTitle(title)) {
    const fallback = toTitleCase(slug);
    return {
      tr: `[Manuel] ${fallback}`,
      en: `[Manual] ${fallback}`,
      source: "title_placeholder",
    };
  }

  // Eğer araç sayfası veya genel sayfa eşleşmesi varsa
  if (kw && kw.tr) {
    const trH1 = kw.std
      ? `${kw.tr} — ${kw.std}`
      : kw.tr;
    const enH1 = kw.std
      ? `${kw.en} — ${kw.std}`
      : kw.en;
    return { tr: trH1, en: enH1, source: "keyword_map" };
  }

  // Title varsa → title'dan türet
  if (title && !title.startsWith("[i18n]")) {
    const cleaned = title
      .replace(/\s*[\|–—-]\s*.+$/, "")   // "Gear Calc | Site Name" → "Gear Calc"
      .replace(/\s+/g, " ")
      .trim();

    if (locale === "tr") {
      return {
        tr: cleaned,
        en: `${toTitleCase(slug)} — Engineering Calculator`,
        source: "title",
      };
    }
    return {
      tr: `${toTitleCase(slug)} Hesaplayıcı`,
      en: cleaned,
      source: "title",
    };
  }

  // i18n key ise → slug'dan tahmin et
  if (title?.startsWith("[i18n]")) {
    const key = title.replace("[i18n] ", "");
    return {
      tr: `[Manuel] i18n key: ${key}`,
      en: `[Manual] i18n key: ${key}`,
      source: "i18n_key_manual",
    };
  }

  // Hiçbir şey yoksa → slug'dan türet
  const humanSlug = toTitleCase(slug);
  return {
    tr: `${humanSlug} Hesaplayıcı`,
    en: `${humanSlug} Calculator`,
    source: "slug_fallback",
  };
}

// ─── Önerileri Üret ──────────────────────────────────────────────────────────

const suggestions = report.missingH1.map((entry) => {
  const h1 = generateH1(entry);
  return {
    ...entry,
    suggestedH1_tr: h1.tr,
    suggestedH1_en: h1.en,
    generationSource: h1.source,
    needsManualReview: h1.source === "i18n_key_manual" || h1.source === "slug_fallback",
  };
});

// ─── Konsol Tablosu ──────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(120));
console.log("  H1 EKSİK SAYFALAR — ÖNERİLEN BAŞLIKLAR");
console.log("═".repeat(120));

const COL = { file: 40, title: 28, tr: 25, en: 25 };
const header = [
  "DOSYA YOLU".padEnd(COL.file),
  "MEVCUT TITLE".padEnd(COL.title),
  "ÖNERİ TR".padEnd(COL.tr),
  "ÖNERİ EN".padEnd(COL.en),
].join(" | ");
console.log(header);
console.log("─".repeat(120));

const manualReview = [];

for (const s of suggestions) {
  const fileCol = s.file.slice(-COL.file).padEnd(COL.file);
  const titleCol = (s.title || "—").slice(0, COL.title - 1).padEnd(COL.title);
  const trCol = (s.suggestedH1_tr || "").slice(0, COL.tr - 1).padEnd(COL.tr);
  const enCol = (s.suggestedH1_en || "").slice(0, COL.en - 1).padEnd(COL.en);
  const flag = s.needsManualReview ? " ⚠️" : "";
  console.log(`${fileCol} | ${titleCol} | ${trCol} | ${enCol}${flag}`);

  if (s.needsManualReview) manualReview.push(s.file);
}

console.log("─".repeat(120));
console.log(`Toplam eksik: ${suggestions.length} | Manuel kontrol: ${manualReview.length}`);
console.log("═".repeat(120) + "\n");

if (manualReview.length > 0) {
  console.log("⚠️  MANUEL KONTROL GEREKENLER:");
  manualReview.forEach((f) => console.log(`   • ${f}`));
  console.log();
}

// ─── JSON Çıktı ──────────────────────────────────────────────────────────────

fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ suggestions, manualReview }, null, 2), "utf-8");
console.log("📄 Öneriler kaydedildi: h1-suggestions.json");
console.log("▶  Sonraki adım: node h1-fix.mjs --dry-run\n");
