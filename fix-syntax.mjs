import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Taranacak ana klasörler
const DIRS = ["app", "components", "src"];

// 1. HATA TİPİ: onChange event'inin içine sızan aria-label hatası
// Örn: onChange={(event) = aria-label="Select"> setVal(...)}
const PATTERN_ONCHANGE = /onChange=\{\s*([\s\S]*?)\s*=\s*aria-label\s*=\s*("[^"]+"|{[^}]+})>\s*([\s\S]*?)\}/g;

// 2. HATA TİPİ: Kapanış etiketinin / karakterinden sonra bozulması
// Örn: / aria-label="Search">
const PATTERN_SELF_CLOSING = /\/\s*aria-label\s*=\s*("[^"]+"|{[^}]+})>/g;

let fixedCount = 0;

function processDirectory(dir) {
  const absDir = path.join(__dirname, dir);
  if (!fs.existsSync(absDir)) return;

  const files = fs.readdirSync(absDir);
  for (const file of files) {
    const fullPath = path.join(absDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(path.join(dir, file));
    } else if (/\.(tsx|jsx|ts|js)$/.test(fullPath)) {
      let content = fs.readFileSync(fullPath, "utf-8");
      let modified = false;

      if (PATTERN_ONCHANGE.test(content)) {
        content = content.replace(PATTERN_ONCHANGE, "onChange={$1 => $3} aria-label=$2");
        modified = true;
      }

      if (PATTERN_SELF_CLOSING.test(content)) {
        content = content.replace(PATTERN_SELF_CLOSING, "aria-label=$1 />");
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log(`✅ Düzeltildi: ${path.relative(__dirname, fullPath)}`);
        fixedCount++;
      }
    }
  }
}

console.log("🔍 Sözdizimi (Syntax) hataları taranıyor...");
DIRS.forEach(processDirectory);

if (fixedCount > 0) {
  console.log(`\n✨ İşlem tamamlandı! Toplam ${fixedCount} dosya onarıldı.`);
  console.log("Lütfen projeyi derlemeyi deneyin: npm run build");
} else {
  console.log("\n👍 Herhangi bir bozuk sözdizimi bulunamadı. Projeniz temiz!");
}