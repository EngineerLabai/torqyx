type ContentQualityCandidate = {
  type: "blog" | "guides" | "glossary" | "qa";
  title: string;
  description: string;
  content: string;
};

const MIN_BODY_WORDS: Partial<Record<ContentQualityCandidate["type"], number>> = {
  blog: 250,
  guides: 220,
  glossary: 80,
};

const LOW_VALUE_MARKERS = [
  "placeholder",
  "[placeholder]",
  "formül burada",
  "formula here",
  "taslak olarak",
  "draft content",
  "h2 iskeletini",
  "ana iskeletini",
  "ana başlıklarını oluşturur",
  "başlangıç yapısını hazırlar",
  "başlangıç içeriği",
] as const;

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const countContentWords = (value: string) => value.trim().split(/\s+/u).filter(Boolean).length;

export const getContentQualityIssues = (item: ContentQualityCandidate) => {
  const issues: string[] = [];
  const minWords = MIN_BODY_WORDS[item.type];
  const searchableText = normalizeText(`${item.title}\n${item.description}\n${item.content}`);

  if (minWords && countContentWords(item.content) < minWords) {
    issues.push(`body_under_${minWords}_words`);
  }

  LOW_VALUE_MARKERS.forEach((marker) => {
    if (searchableText.includes(normalizeText(marker))) {
      issues.push(`low_value_marker:${marker}`);
    }
  });

  return issues;
};

export const isContentIndexable = (item: ContentQualityCandidate) => getContentQualityIssues(item).length === 0;
