import type { Locale } from "@/utils/locale";

const ENGLISH_LABEL_TOKENS = ["Standards", "Project Hub", "Workflow", "Tracker", "Revision", "RFQ"] as const;

export const UI_LABELS = {
  standards: { tr: "Standartlar", en: "Standards" },
  projectHub: { tr: "Proje Merkezi", en: "Project Hub" },
  workflow: { tr: "İş Akışı", en: "Workflow" },
  tracker: { tr: "Takip Paneli", en: "Tracker" },
  revision: { tr: "Revizyon", en: "Revision" },
  rfq: { tr: "Teklif İsteği", en: "RFQ" },
} as const satisfies Record<string, Record<Locale, string>>;

export type UiLabelKey = keyof typeof UI_LABELS;

export const getUiLabel = (locale: Locale, key: UiLabelKey) => UI_LABELS[key][locale];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsToken = (text: string, token: string) => {
  const escaped = escapeRegExp(token);
  if (token.includes(" ")) {
    return new RegExp(escaped, "i").test(text);
  }
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
};

const collectStrings = (value: unknown, collector: string[]) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) {
      collector.push(trimmed);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, collector));
    return;
  }

  if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((item) => collectStrings(item, collector));
  }
};

export const warnIfEnglishLabelsInTurkish = (
  componentName: string,
  locale: Locale,
  renderedLabelData: unknown,
) => {
  if (process.env.NODE_ENV === "production" || locale !== "tr") return;

  const labels: string[] = [];
  collectStrings(renderedLabelData, labels);
  if (labels.length === 0) return;

  const uniqueLabels = Array.from(new Set(labels));
  const hits = ENGLISH_LABEL_TOKENS.filter((token) => uniqueLabels.some((label) => containsToken(label, token)));
  if (hits.length === 0) return;

  console.warn(`[i18n-guard][${componentName}] English token(s) in Turkish labels: ${hits.join(", ")}`, {
    labels: uniqueLabels,
  });
};
