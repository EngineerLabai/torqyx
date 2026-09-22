import { describe, expect, it } from "vitest";
import { buildToolSchema } from "@/tools/_shared/seo";
import {
  buildInternalLinkingMap,
  getLinkSuggestions,
} from "@/utils/internal-linking";

describe("structured-data policy", () => {
  it("emits WebApplication JSON-LD for a calculator", () => {
    const schema = buildToolSchema("bolt-calculator", "tr");
    const types = schema["@graph"].map((entry) => entry["@type"]);

    expect(types).toEqual(["WebApplication"]);
    expect(schema["@graph"][0]).toMatchObject({
      inLanguage: "tr-TR",
      url: "https://torqyx.com/tr/tools/bolt-calculator",
    });
  });

  it("does not emit deprecated rich-result schema types", () => {
    const schema = JSON.stringify(buildToolSchema("bearing-life", "en"));

    expect(schema).not.toContain('"FAQPage"');
    expect(schema).not.toContain('"HowTo"');
    expect(schema).not.toContain('"aggregateRating"');
  });
});

describe("internal linking system", () => {
  it("returns bounded, relevant suggestions", () => {
    const suggestions = getLinkSuggestions("shaft-torsion");

    expect(suggestions.some((suggestion) => suggestion.slug === "bearing-life")).toBe(true);
    expect(suggestions.length).toBeLessThanOrEqual(6);
  });

  it("builds a complete map for catalog tools", () => {
    const map = buildInternalLinkingMap();

    expect(map["bolt-calculator"]).toBeDefined();
    expect(Array.isArray(map["bolt-calculator"])).toBe(true);
  });
});
