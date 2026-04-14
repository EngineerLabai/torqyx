import { describe, it, expect } from "vitest";
import { buildHowToSchema, buildLocalizedHowToSchemas } from "@/utils/howto-schema";
import { getLinkSuggestions, buildInternalLinkingMap } from "@/utils/internal-linking";
import { getToolPageTool } from "@/tools/tool-page-tools";
import { toolCatalog } from "@/tools/_shared/catalog";

describe("HowTo Schema System", () => {
  it("should build HowTo schema for bolt-calculator", () => {
    const tool = getToolPageTool("bolt-calculator");
    const catalogItem = toolCatalog.find(t => t.id === "bolt-calculator");

    expect(tool).toBeDefined();
    expect(catalogItem).toBeDefined();

    if (tool && catalogItem) {
      const toolConfig = {
        ...tool,
        id: catalogItem.id,
        title: catalogItem.title,
        description: catalogItem.description,
      };

      const schema = buildHowToSchema(toolConfig, "tr");

      expect(schema).toHaveProperty("name", catalogItem.title);
      expect(schema).toHaveProperty("description", catalogItem.description);
      expect(schema).toHaveProperty("step");
      expect(schema.step).toHaveLength(4); // 4 adım olmalı
      expect(schema).toHaveProperty("tool");
      expect(schema).toHaveProperty("application");
    }
  });

  it("should build localized schemas", () => {
    const tool = getToolPageTool("bolt-calculator");
    const catalogItem = toolCatalog.find(t => t.id === "bolt-calculator");

    if (tool && catalogItem) {
      const toolConfig = {
        ...tool,
        id: catalogItem.id,
        title: catalogItem.title,
        description: catalogItem.description,
      };

      const schemas = buildLocalizedHowToSchemas(toolConfig);

      expect(schemas).toHaveProperty("tr");
      expect(schemas).toHaveProperty("en");
      expect(schemas.tr.name).toBe(catalogItem.title);
      expect(schemas.en.name).toBe(catalogItem.title);
    }
  });

  it("should extract correct steps for Turkish locale", () => {
    const tool = getToolPageTool("bolt-calculator");
    const catalogItem = toolCatalog.find(t => t.id === "bolt-calculator");

    if (tool && catalogItem) {
      const toolConfig = {
        ...tool,
        id: catalogItem.id,
        title: catalogItem.title,
        description: catalogItem.description,
      };

      const schema = buildHowToSchema(toolConfig, "tr");

      expect(schema.step[0].name).toContain("Girdi");
      expect(schema.step[1].name).toContain("Hesaplamayı");
      expect(schema.step[2].name).toContain("Sonuçları");
      expect(schema.step[3].name).toContain("Varsayımları");
    }
  });
});

describe("Internal Linking System", () => {
  it("should generate link suggestions for bolt-calculator", () => {
    const suggestions = getLinkSuggestions("bolt-calculator");

    expect(suggestions).toBeDefined();
    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions.length).toBeGreaterThan(0);

    // İlk öneri yüksek relevance olmalı
    if (suggestions.length > 0) {
      expect(suggestions[0]).toHaveProperty("slug");
      expect(suggestions[0]).toHaveProperty("title");
      expect(suggestions[0]).toHaveProperty("anchorText");
      expect(suggestions[0]).toHaveProperty("relevance");
    }
  });

  it("should build complete internal linking map", () => {
    const linkingMap = buildInternalLinkingMap();

    expect(linkingMap).toBeDefined();
    expect(typeof linkingMap).toBe("object");

    // En azından bolt-calculator için öneriler olmalı
    expect(linkingMap).toHaveProperty("bolt-calculator");
    expect(Array.isArray(linkingMap["bolt-calculator"])).toBe(true);
  });

  it("should have logical relationships", () => {
    const shaftTorsionSuggestions = getLinkSuggestions("shaft-torsion");

    // shaft-torsion için bearing-life önerisi olmalı
    const hasBearingLife = shaftTorsionSuggestions.some(s => s.slug === "bearing-life");
    expect(hasBearingLife).toBe(true);
  });

  it("should limit suggestions to maximum 6", () => {
    const suggestions = getLinkSuggestions("gear-design");

    expect(suggestions.length).toBeLessThanOrEqual(6);
  });
});

describe("Integration Tests", () => {
  it("should work with tool-seo buildToolHowToJsonLd", async () => {
    const { buildToolHowToJsonLd } = await import("@/utils/tool-seo");

    const schema = buildToolHowToJsonLd("bolt-calculator", "tr");

    expect(schema).toBeDefined();
    if (schema) {
      expect(schema).toHaveProperty("name");
      expect(schema).toHaveProperty("step");
      expect(schema).toHaveProperty("application");
    }
  });
});