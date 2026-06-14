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
});
