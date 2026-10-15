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

  it("builds consistent 3-level BreadcrumbList and WebApplication data", async () => {
    const { buildToolJsonLd } = await import("@/utils/tool-seo");
    const { CANONICAL_SITE_URL } = await import("@/utils/seo");

    for (const locale of ["tr", "en"] as const) {
      const toolData = buildToolJsonLd("bolt-calculator", locale);
      expect(toolData.operatingSystem).toBe("Web");
      expect(toolData.url).toBe(`${CANONICAL_SITE_URL}/${locale}/tools/bolt-calculator`);

      const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: locale === "tr" ? "Ana Sayfa" : "Home", item: `${CANONICAL_SITE_URL}/${locale}` },
          { "@type": "ListItem", position: 2, name: locale === "tr" ? "Hesaplayıcılar" : "Tools", item: `${CANONICAL_SITE_URL}/${locale}/tools` },
          { "@type": "ListItem", position: 3, name: toolData.name, item: toolData.url },
        ],
      };

      expect(breadcrumb.itemListElement).toHaveLength(3);
      expect(breadcrumb.itemListElement[0].item).toBe(`https://torqyx.com/${locale}`);
      expect(breadcrumb.itemListElement[1].item).toBe(`https://torqyx.com/${locale}/tools`);
      expect(breadcrumb.itemListElement[2].item).toBe(`https://torqyx.com/${locale}/tools/bolt-calculator`);
    }
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
