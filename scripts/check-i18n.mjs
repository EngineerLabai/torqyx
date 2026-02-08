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

const flattenEntries = (value, prefix, acc) => {
  if (Array.isArray(value)) {
    if (value.length === 0 && prefix) {
      acc.set(prefix, value);
      return;
    }
    value.forEach((item, index) => {
      const next = prefix ? `${prefix}[${index}]` : `[${index}]`;
      flattenEntries(item, next, acc);
    });
    return;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0 && prefix) {
      acc.set(prefix, value);
      return;
    }
    entries.forEach(([key, val]) => {
      const next = prefix ? `${prefix}.${key}` : key;
      flattenEntries(val, next, acc);
    });
    return;
  }

  if (prefix) {
    acc.set(prefix, value);
  }
};

const loadJson = (filePath) => {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
};

const toEntryMap = (obj) => {
  const acc = new Map();
  flattenEntries(obj, "", acc);
  return acc;
};

const enData = loadJson(locales.en);
const trData = loadJson(locales.tr);

const enEntries = toEntryMap(enData);
const trEntries = toEntryMap(trData);

const enKeys = new Set(enEntries.keys());
const trKeys = new Set(trEntries.keys());

const missingInTr = [...enKeys].filter((key) => !trKeys.has(key));
const missingInEn = [...trKeys].filter((key) => !enKeys.has(key));

const emptyValues = (entries) =>
  [...entries.entries()].filter(([, value]) => typeof value === "string" && value.trim().length === 0);

const emptyInTr = emptyValues(trEntries);
const emptyInEn = emptyValues(enEntries);

if (missingInTr.length || missingInEn.length || emptyInTr.length || emptyInEn.length) {
  if (missingInTr.length) {
    console.error("Missing keys in tr.json:");
    missingInTr.forEach((key) => console.error(`  - ${key}`));
  }
  if (missingInEn.length) {
    console.error("Missing keys in en.json:");
    missingInEn.forEach((key) => console.error(`  - ${key}`));
  }
  if (emptyInTr.length) {
    console.error("Empty values in tr.json:");
    emptyInTr.forEach(([key]) => console.error(`  - ${key}`));
  }
  if (emptyInEn.length) {
    console.error("Empty values in en.json:");
    emptyInEn.forEach(([key]) => console.error(`  - ${key}`));
  }
  process.exit(1);
}

console.log(`i18n validation passed (${enKeys.size} keys).`);
