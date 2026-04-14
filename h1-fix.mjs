#!/usr/bin/env node
/**
 * h1-fix.mjs
 * Kullanım:
 *   node h1-fix.mjs --dry-run     → Değişiklikleri gösterir, dosyaları DEĞİŞTİRMEZ
 *   node h1-fix.mjs               → Gerçekten yazar (önce commit yapın!)
 *   node h1-fix.mjs --dry-run      → Değişiklikleri gösterir, dosyaları DEĞİŞTİRMEZ
 *   node h1-fix.mjs --include-manual → Manuel inceleme gerektiren önerileri de uygular
 *   node h1-fix.mjs --file app/tr/tools/gear/page.tsx  → Tek dosya
 *
 * Önce h1-suggestions.json gerekli → node h1-suggest.mjs
 *
 * Strateji:
 *  TSX  → İlk <main> veya <section> veya <div className (content wrapper) içine
 *          <h1>{t("...")}</h1>  VEYA  düz metin <h1> ekler
 *  MDX  → frontmatter'a h1: alanı ekler; MDX body'nin başına # Başlık ekler
 *
 * i18n uyarısı:
 *  - TR dosyaları → Türkçe H1
 *  - EN dosyaları → İngilizce H1
 *  - unknown → her ikisini de yorum olarak bırakır
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SUGGESTIONS_FILE = path.join(__dirname, "h1-suggestions.json");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const INCLUDE_MANUAL = args.includes("--include-manual") || args.includes("--all");
const SINGLE_FILE = args.find((a) => a.startsWith("--file="))?.replace("--file=", "");

if (!fs.existsSync(SUGGESTIONS_FILE)) {
  console.error("❌ h1-suggestions.json bulunamadı. Önce 'node h1-suggest.mjs' çalıştırın.");
  process.exit(1);
}

const { suggestions } = JSON.parse(fs.readFileSync(SUGGESTIONS_FILE, "utf-8"));
const targets = SINGLE_FILE
  ? suggestions.filter((s) => s.file === SINGLE_FILE)
  : suggestions.filter((s) => INCLUDE_MANUAL || !s.needsManualReview); // Manuel olanları isteğe bağlı olarak dahil et

console.log(`\n${DRY_RUN ? "🔍 DRY-RUN" : "✏️  YAZMA"} MODU — ${targets.length} dosya işlenecek${INCLUDE_MANUAL ? " (manuel öneriler dahil)" : ""}\n`);

// ─── TSX Fixer ───────────────────────────────────────────────────────────────

function fixTSX(content, suggestion) {
  const { locale, suggestedH1_tr, suggestedH1_en } = suggestion;
  const h1Text = locale === "tr" ? suggestedH1_tr : locale === "en" ? suggestedH1_en : suggestedH1_en;

  // H1 JSX satırı — basit düz metin (i18n yoksa)
  // Projenizde useTranslations kullanıyorsanız bu satırı uyarlayın.
  const h1Tag = `      <h1 className="text-3xl font-bold tracking-tight">\n        ${h1Text}\n      </h1>`;

  // Ekleme noktası stratejisi (sırasıyla dene):
  // 1. return ( ... <main içinden hemen sonra
  // 2. return ( ... <section içinden hemen sonra
  // 3. return ( ... <div className="container içinden hemen sonra
  // 4. return (\n    <> hemen sonra

  const insertions = [
    // <main ...> veya <main>
    { pattern: /(<main[^>]*>)(\s*)/, replace: (m, tag, ws) => `${tag}\n${h1Tag}\n${ws}` },
    // <section ...>
    { pattern: /(<section[^>]*>)(\s*)/, replace: (m, tag, ws) => `${tag}\n${h1Tag}\n${ws}` },
    // <div className="container
    { pattern: /(<div className="container[^"]*">)(\s*)/, replace: (m, tag, ws) => `${tag}\n${h1Tag}\n${ws}` },
    // return ( sonrası fragment <>
    { pattern: /(\breturn\s*\(\s*\n\s*<>)(\s*)/, replace: (m, tag, ws) => `${tag}\n${h1Tag}\n${ws}` },
  ];

  for (const ins of insertions) {
    if (ins.pattern.test(content)) {
      return { newContent: content.replace(ins.pattern, ins.replace), strategy: ins.pattern.toString().slice(1, 30) };
    }
  }

  // Hiçbiri bulunamazsa → dosyanın sonuna yorum bırak
  return {
    newContent: content + `\n// TODO: H1 ekle: <h1>${h1Text}</h1>\n`,
    strategy: "TODO_comment",
    warning: true,
  };
}

// ─── MDX Fixer ───────────────────────────────────────────────────────────────

function fixMDX(content, suggestion) {
  const { locale, suggestedH1_tr, suggestedH1_en } = suggestion;
  const h1Text = locale === "tr" ? suggestedH1_tr : locale === "en" ? suggestedH1_en : suggestedH1_en;

  // Frontmatter varsa h1 alanı ekle, yoksa frontmatter oluştur
  if (/^---\n/.test(content)) {
    // Frontmatter'a h1 ekle (title'dan hemen sonra)
    const newContent = content.replace(
      /^(---\n)([\s\S]*?)(---)/,
      (_, open, fm, close) => {
        if (!/^h1\s*:/m.test(fm)) {
          const insertAfterTitle = fm.replace(
            /(^title\s*:.*$)/m,
            `$1\nh1: "${h1Text}"`
          );
          // title satırı yoksa frontmatter'ın başına ekle
          const finalFm = insertAfterTitle === fm
            ? `h1: "${h1Text}"\n${fm}`
            : insertAfterTitle;
          return `${open}${finalFm}${close}`;
        }
        return _;
      }
    );
    // Ayrıca body'nin başına # ekle (frontmatter'dan sonra)
    const withHeading = newContent.replace(
      /^(---\n[\s\S]*?---\n\n?)/,
      `$1# ${h1Text}\n\n`
    );
    return { newContent: withHeading, strategy: "frontmatter+body_h1" };
  }

  // Frontmatter yoksa → dosyanın başına ekle
  const newContent = `---\nh1: "${h1Text}"\n---\n\n# ${h1Text}\n\n${content}`;
  return { newContent, strategy: "new_frontmatter" };
}

// ─── İşleme Döngüsü ──────────────────────────────────────────────────────────

let fixed = 0;
let warnings = 0;
const log = [];

for (const suggestion of targets) {
  const absPath = path.join(__dirname, suggestion.file);

  if (!fs.existsSync(absPath)) {
    console.warn(`⚠️  Dosya bulunamadı: ${suggestion.file}`);
    warnings++;
    continue;
  }

  const original = fs.readFileSync(absPath, "utf-8");
  const isMDX = suggestion.type === "mdx";

  const result = isMDX ? fixMDX(original, suggestion) : fixTSX(original, suggestion);

  const changed = result.newContent !== original;
  const statusIcon = result.warning ? "⚠️ " : changed ? "✅" : "⏭ ";
  console.log(`${statusIcon} ${suggestion.file}`);
  console.log(`   strateji: ${result.strategy}`);
  if (result.warning) {
    console.log(`   ⚠️  Otomatik ekleme noktası bulunamadı — TODO yorum eklendi`);
    warnings++;
  }

  log.push({
    file: suggestion.file,
    changed,
    strategy: result.strategy,
    warning: result.warning || false,
    h1: suggestion.locale === "tr" ? suggestion.suggestedH1_tr : suggestion.suggestedH1_en,
  });

  if (!DRY_RUN && changed) {
    // Backup al
    fs.writeFileSync(absPath + ".h1bak", original, "utf-8");
    // Yeni içeriği yaz
    fs.writeFileSync(absPath, result.newContent, "utf-8");
    fixed++;
  } else if (DRY_RUN && changed) {
    fixed++;
    // Diff önizlemesi (ilk değişen satırı göster)
    const origLines = original.split("\n");
    const newLines = result.newContent.split("\n");
    for (let i = 0; i < Math.min(newLines.length, origLines.length + 5); i++) {
      if (newLines[i] !== origLines[i]) {
        console.log(`   + ${newLines[i]}`);
        break;
      }
    }
  }
}

// ─── Özet ────────────────────────────────────────────────────────────────────

console.log("\n" + "─".repeat(60));
console.log(`✅ Düzeltildi : ${fixed}`);
console.log(`⚠️  Uyarı      : ${warnings}`);
console.log(`⏭  Değişmedi : ${targets.length - fixed - warnings}`);
if (DRY_RUN) {
  console.log("\n▶  Gerçek yazmak için: node h1-fix.mjs");
  console.log("▶  Tek dosya için    : node h1-fix.mjs --file=app/tr/tools/gear/page.tsx");
} else {
  console.log("\n💾 Yedekler *.h1bak uzantısıyla kaydedildi.");
  console.log("🗑  Yedekleri silmek için: find . -name '*.h1bak' -delete");
}
console.log("─".repeat(60) + "\n");

// ─── Log dosyası ─────────────────────────────────────────────────────────────

fs.writeFileSync(
  path.join(__dirname, "h1-fix-log.json"),
  JSON.stringify({ dryRun: DRY_RUN, timestamp: new Date().toISOString(), results: log }, null, 2)
);
