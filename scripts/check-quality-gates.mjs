import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sourceRoots = ["app", "components", "content", "data", "lib", "messages", "tools", "types", "utils"];
const sourceExtensions = new Set([".ts", ".tsx", ".json"]);
const ignoredDirectories = new Set([".next", "node_modules", ".git", "coverage"]);

const uiTermsByLocale = {
  tr: [
    /\bInputs?\b/i,
    /\bResults?\b/i,
    /\bCalculate\b/i,
    /\bReset\b/i,
    /\bEnter(?:\s+value)?\b/i,
    /\bDynamic load rating\b/i,
    /\bHow it works\b/i,
  ],
  en: [
    /\bHesapla\b/i,
    /\bSonuçlar\b/i,
    /\bGirdiler\b/i,
    /\bYük\b/i,
    /\bUzunluk\b/i,
    /\bGerilme\b/i,
    /\bKuvvet\b/i,
    /\bSıcaklık\b/i,
    /\bBasınç\b/i,
    /\bDeğer\b/i,
    /\bMalzeme\b/i,
    /\bGüvenlik\b/i,
  ],
};

const genericDocumentationPhrases = [
  "ISO / DIN / VDI references and common engineering handbooks",
  "ISO / DIN / VDI kaynakları ve yaygın mühendislik el kitapları",
  "Girdi seti: Proje verileri",
  "standard tables are in the same order of magnitude",
];

const deprecatedSchemaPatterns = [
  /["']@type["']\s*:\s*["']FAQPage["']/,
  /["']@type["']\s*:\s*["']HowTo["']/,
  /["']@type["']\s*:\s*["']EngineeringApplication["']/,
  /["']aggregateRating["']\s*:/,
  /["']ratingCount["']\s*:/,
];

function flattenStrings(value, currentPath = "") {
  if (typeof value === "string") return [{ path: currentPath, value }];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenStrings(item, `${currentPath}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      flattenStrings(item, currentPath ? `${currentPath}.${key}` : key),
    );
  }
  return [];
}

function collectFiles(directory) {
  const absoluteDirectory = path.join(root, directory);
  if (!fs.existsSync(absoluteDirectory)) return [];

  return fs.readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return ignoredDirectories.has(entry.name) ? [] : collectFiles(relativePath);
    }
    return sourceExtensions.has(path.extname(entry.name)) ? [relativePath] : [];
  });
}

const failures = [];

for (const locale of ["tr", "en"]) {
  const file = path.join(root, "messages", `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(file, "utf8"));

  for (const entry of flattenStrings(messages)) {
    if (entry.path.endsWith(".id") || entry.path.endsWith(".href")) continue;
    const visibleValue = entry.value.replace(/\{[^}]+\}/g, "");
    const matched = uiTermsByLocale[locale].find((term) => term.test(visibleValue));
    if (matched) {
      failures.push(
        `${path.relative(root, file)}:${entry.path} contains the other locale's UI term (${matched}).`,
      );
    }
  }
}

const sourceFiles = sourceRoots.flatMap(collectFiles);
for (const relativePath of sourceFiles) {
  const contents = fs.readFileSync(path.join(root, relativePath), "utf8");
  const genericPhrase = genericDocumentationPhrases.find((phrase) => contents.includes(phrase));
  if (genericPhrase) {
    failures.push(`${relativePath} contains generic documentation filler: "${genericPhrase}".`);
  }

  if (relativePath !== "types/structured-data.ts") {
    const deprecatedSchema = deprecatedSchemaPatterns.find((pattern) => pattern.test(contents));
    if (deprecatedSchema) {
      failures.push(`${relativePath} emits a prohibited structured-data property (${deprecatedSchema}).`);
    }
  }
}

if (failures.length > 0) {
  console.error("[quality-gates] FAILED");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`[quality-gates] PASS (${sourceFiles.length} source files and both locale dictionaries checked)`);
