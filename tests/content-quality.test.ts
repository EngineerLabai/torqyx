import { describe, expect, it } from "vitest";
import { countContentWords, getContentQualityIssues, isContentIndexable } from "@/utils/content-quality";

const buildBlog = (content: string) => ({
  type: "blog" as const,
  title: "Engineering calculation guide",
  description: "A practical engineering calculation guide with references and worked examples.",
  content,
});

describe("content quality", () => {
  it("rejects thin blog content", () => {
    const item = buildBlog("Short draft.");

    expect(isContentIndexable(item)).toBe(false);
    expect(getContentQualityIssues(item)).toContain("body_under_250_words");
  });

  it("rejects placeholder and outline markers", () => {
    const item = buildBlog(`${"Useful sentence ".repeat(260)} H2 iskeletini hazırlar.`);

    expect(isContentIndexable(item)).toBe(false);
    expect(getContentQualityIssues(item)).toContain("low_value_marker:h2 iskeletini");
  });

  it("accepts substantial content without draft markers", () => {
    const item = buildBlog(
      "This worked example explains the engineering decision, assumptions, units, references, and validation checks. ".repeat(
        32,
      ),
    );

    expect(countContentWords(item.content)).toBeGreaterThan(250);
    expect(isContentIndexable(item)).toBe(true);
  });

  it("keeps generated glossary templates out of the search index", () => {
    const item = {
      type: "glossary" as const,
      title: "Datum",
      description: "Datum is a core engineering term. Definition, usage notes, and a practical example.",
      content:
        "A datum is a reference feature. In a design check, first define the relevant load, dimension, material, or flow condition. ".repeat(
          8,
        ),
    };

    expect(isContentIndexable(item)).toBe(false);
    expect(getContentQualityIssues(item)).toContain(
      "generated_glossary_marker:is a core engineering term. definition, usage notes, and a practical example.",
    );
  });

  it("rejects thin glossary terms with under 300 words", () => {
    const item = {
      type: "glossary" as const,
      title: "Yorulma",
      description: "Yorulma tanımı ve analitik formülleri.",
      content: "Yorulma dinamik çevrimsel yükler altında malzemenin hasara uğramasıdır. ".repeat(10),
    };

    expect(countContentWords(item.content)).toBeLessThan(300);
    expect(isContentIndexable(item)).toBe(false);
    expect(getContentQualityIssues(item)).toContain("body_under_300_words");
  });

  it("accepts rich glossary terms with 300+ words and no draft markers", () => {
    const item = {
      type: "glossary" as const,
      title: "Yük Kaybı",
      description: "Darcy-Weisbach denklemi ve çözümlü pompa basma yüksekliği hesabı.",
      content:
        "Yük kaybı akış esnasında mekanik enerjinin geri döndürülemez biçimde ısıya dönüşmesidir. Darcy-Weisbach denklemi sürtünmeyi hesaplar. ".repeat(
          20,
        ),
    };

    expect(countContentWords(item.content)).toBeGreaterThanOrEqual(300);
    expect(isContentIndexable(item)).toBe(true);
    expect(getContentQualityIssues(item)).toHaveLength(0);
  });

  it("respects explicit noindex flag on content items", () => {
    const item = {
      type: "glossary" as const,
      title: "Özel Terim",
      description: "Açıklama",
      content: "Uzun içerik metni açıklaması ile birlikte detaylı tasarım bilgileri. ".repeat(40),
      noindex: true,
    };

    expect(isContentIndexable(item)).toBe(false);
    expect(getContentQualityIssues(item)).toContain("explicit_noindex");
  });
});
