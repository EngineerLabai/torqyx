import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const locales = {
  en: path.join(rootDir, "messages", "en.json"),
  tr: path.join(rootDir, "messages", "tr.json"),
};

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const flattenKeys = (value, prefix, acc) => {
  if (Array.isArray(value)) {
    if (value.length === 0 && prefix) {
      acc.add(`${prefix}[]`);
      return;
    }
    value.forEach((item, index) => {
      const next = prefix ? `${prefix}[${index}]` : `[${index}]`;
      flattenKeys(item, next, acc);
    });
    return;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0 && prefix) {
      acc.add(prefix);
      return;
    }
    entries.forEach(([key, val]) => {
      const next = prefix ? `${prefix}.${key}` : key;
      flattenKeys(val, next, acc);
    });
    return;
  }

  if (prefix) {
    acc.add(prefix);
  }
};

const loadJson = (filePath) => {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
};

const toKeySet = (obj) => {
  const acc = new Set();
  flattenKeys(obj, "", acc);
  return acc;
};

const enData = loadJson(locales.en);
const trData = loadJson(locales.tr);

const enKeys = toKeySet(enData);
const trKeys = toKeySet(trData);

const missingInTr = [...enKeys].filter((key) => !trKeys.has(key));
const missingInEn = [...trKeys].filter((key) => !enKeys.has(key));

if (missingInTr.length || missingInEn.length) {
  if (missingInTr.length) {
    console.error("Missing keys in tr.json:");
    missingInTr.forEach((key) => console.error(`  - ${key}`));
  }
  if (missingInEn.length) {
    console.error("Missing keys in en.json:");
    missingInEn.forEach((key) => console.error(`  - ${key}`));
  }
  process.exit(1);
}

console.log(`i18n key validation passed (${enKeys.size} keys).`);
