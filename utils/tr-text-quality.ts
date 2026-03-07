import type { Messages } from "@/utils/messages";

type SuspiciousRule = {
  pattern: RegExp;
  suggestion: string;
};

const SUSPICIOUS_RULES: SuspiciousRule[] = [
  { pattern: /\bUcretsiz\b/, suggestion: "Ücretsiz" },
  { pattern: /\bAraci\b/, suggestion: "Aracı" },
  { pattern: /\bAraçı\b/, suggestion: "Aracı" },
  { pattern: /\bAraçi\b/, suggestion: "Aracı" },
  { pattern: /\bDonusturucu\b/, suggestion: "Dönüştürücü" },
  { pattern: /\bSonuc\b/, suggestion: "Sonuç" },
  { pattern: /\bSik\b/, suggestion: "Sık" },
  { pattern: /\bGuncelleme\b/, suggestion: "Güncelleme" },
  { pattern: /\bDokuman\b/, suggestion: "Doküman" },
  { pattern: /\bCeviri\b/, suggestion: "Çeviri" },
  { pattern: /\bYukle\b/, suggestion: "Yükle" },
  { pattern: /\bPaylasim\b/, suggestion: "Paylaşım" },
  { pattern: /\bAdsiz\b/, suggestion: "Adsız" },
  { pattern: /\bbasligi\b/, suggestion: "başlığı" },
  { pattern: /\bbasarisiz\b/, suggestion: "başarısız" },
];

type StringEntry = {
  path: string;
  value: string;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const collectStringEntries = (value: unknown, path: string, acc: StringEntry[]) => {
  if (typeof value === "string") {
    acc.push({ path, value });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const nextPath = path ? `${path}[${index}]` : `[${index}]`;
      collectStringEntries(item, nextPath, acc);
    });
    return;
  }

  if (isPlainObject(value)) {
    Object.entries(value).forEach(([key, item]) => {
      const nextPath = path ? `${path}.${key}` : key;
      collectStringEntries(item, nextPath, acc);
    });
  }
};

export const runTrTextQualitySmokeTest = (messages: Messages) => {
  const entries: StringEntry[] = [];
  collectStringEntries(messages, "", entries);

  const issues: Array<{ path: string; value: string; suggestion: string }> = [];

  for (const entry of entries) {
    for (const rule of SUSPICIOUS_RULES) {
      if (rule.pattern.test(entry.value)) {
        issues.push({ path: entry.path, value: entry.value, suggestion: rule.suggestion });
      }
    }
  }

  if (issues.length === 0) return;

  const preview = issues.slice(0, 30);
  console.warn(`[i18n][tr-text-quality] ${issues.length} suspicious TR text pattern(s) found.`);
  preview.forEach((issue) => {
    console.warn(`- ${issue.path}: "${issue.value}" -> "${issue.suggestion}"`);
  });
  if (issues.length > preview.length) {
    console.warn(`[i18n][tr-text-quality] ...and ${issues.length - preview.length} more.`);
  }
};
