import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

vi.mock("server-only", () => ({}));

describe("tool related content and similar calculators logic", async () => {
  const { toolCatalog } = await import("@/tools/_shared/catalog");
  const { TOOL_RELATED_CONTENT } = await import("@/data/tool-related-content");
  const { getRelatedForTool } = await import("@/utils/related-items");

  const guidesDir = path.join(process.cwd(), "content", "guides");
  const glossaryDir = path.join(process.cwd(), "content", "glossary");

  const existingGuideSlugs = new Set(
    fs
      .readdirSync(guidesDir)
      .map((f) => f.replace(/\.(tr|en)\.(mdx|md)$/, ""))
  );

  const existingGlossarySlugs = new Set(
    fs
      .readdirSync(glossaryDir)
      .map((f) => f.replace(/\.(tr|en)\.(mdx|md)$/, ""))
  );

  describe("data mapping integrity (TOOL_RELATED_CONTENT)", () => {
    it("has an entry for each tool in toolCatalog", () => {
      for (const tool of toolCatalog) {
        expect(
          TOOL_RELATED_CONTENT[tool.id],
          `Missing TOOL_RELATED_CONTENT mapping for tool id: ${tool.id}`
        ).toBeDefined();
      }
    });

    it("references only existing guide slugs", () => {
      for (const [toolId, mapping] of Object.entries(TOOL_RELATED_CONTENT)) {
        for (const slug of mapping.guideSlugs ?? []) {
          expect(
            existingGuideSlugs.has(slug),
            `Tool ${toolId} references non-existent guide slug "${slug}"`
          ).toBe(true);
        }
      }
    });

    it("references only existing glossary slugs", () => {
      for (const [toolId, mapping] of Object.entries(TOOL_RELATED_CONTENT)) {
        for (const slug of mapping.glossarySlugs ?? []) {
          expect(
            existingGlossarySlugs.has(slug),
            `Tool ${toolId} references non-existent glossary slug "${slug}"`
          ).toBe(true);
        }
      }
    });

    it("contains at most 4 guides and 4 glossary terms per tool", () => {
      for (const [toolId, mapping] of Object.entries(TOOL_RELATED_CONTENT)) {
        expect(
          (mapping.guideSlugs ?? []).length,
          `Tool ${toolId} has more than 4 mapped guides`
        ).toBeLessThanOrEqual(4);
        expect(
          (mapping.glossarySlugs ?? []).length,
          `Tool ${toolId} has more than 4 mapped glossary terms`
        ).toBeLessThanOrEqual(4);
      }
    });
  });

  describe("getRelatedForTool execution", () => {
    it("returns empty arrays if tool has no mapping or empty mapping", async () => {
      const dummyTool = {
        id: "non-existent-tool-xyz",
        type: "calculator" as const,
        access: "free" as const,
        status: "verified" as const,
        title: "Non Existent Tool",
        description: "Test description",
        href: "/tools/dummy",
      };

      const result = await getRelatedForTool(dummyTool);
      expect(result.guides).toEqual([]);
      expect(result.glossary).toEqual([]);
    });

    it("returns only mapped guides and terms for bolt-calculator", async () => {
      const boltTool = toolCatalog.find((t) => t.id === "bolt-calculator")!;
      const mapping = TOOL_RELATED_CONTENT["bolt-calculator"]!;

      const resultTr = await getRelatedForTool(boltTool, { locale: "tr" });
      expect(resultTr.guides.length).toBeGreaterThan(0);
      expect(resultTr.guides.length).toBeLessThanOrEqual(4);
      for (const guide of resultTr.guides) {
        expect(mapping.guideSlugs).toContain(guide.slug);
      }

      for (const term of resultTr.glossary) {
        expect(mapping.glossarySlugs).toContain(term.slug);
      }

      const resultEn = await getRelatedForTool(boltTool, { locale: "en" });
      expect(resultEn.guides.length).toBeGreaterThan(0);
      expect(resultEn.guides.length).toBeLessThanOrEqual(4);
      for (const guide of resultEn.guides) {
        expect(mapping.guideSlugs).toContain(guide.slug);
      }
    });
  });

  describe("similar calculators selection logic", () => {
    const getSimilarCalculators = (toolId: string) => {
      const current = toolCatalog.find((t) => t.id === toolId);
      if (!current || !current.category) return [];

      const sameCategoryCandidates = toolCatalog.filter(
        (tool) => tool.id !== current.id && tool.category === current.category
      );

      if (sameCategoryCandidates.length === 0) return [];

      const currentTags = new Set(current.tags ?? []);

      const scored = sameCategoryCandidates.map((tool) => {
        let tagMatchCount = 0;
        (tool.tags ?? []).forEach((tag) => {
          if (currentTags.has(tag)) {
            tagMatchCount += 1;
          }
        });
        const score = 1 + tagMatchCount * 2;
        return { tool, score };
      });

      scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.tool.id.localeCompare(b.tool.id);
      });

      return scored.slice(0, 4).map((item) => item.tool);
    };

    it("strictly returns at most 4 links all from the exact same category", () => {
      for (const tool of toolCatalog) {
        const similar = getSimilarCalculators(tool.id);
        expect(similar.length).toBeLessThanOrEqual(4);
        for (const item of similar) {
          expect(
            item.category,
            `Similar calculator ${item.id} has category ${item.category}, expected ${tool.category}`
          ).toBe(tool.category);
          expect(item.id).not.toBe(tool.id);
        }
      }
    });

    it("returns empty array for compressor-cc because it is the only Automotive tool (no cross-category padding)", () => {
      const similar = getSimilarCalculators("compressor-cc");
      expect(similar).toEqual([]);
    });

    it("ranks candidates with shared tags higher than candidates without shared tags", () => {
      // bolt-calculator is in Mechanical with tag "torque"
      const similar = getSimilarCalculators("bolt-calculator");
      expect(similar.length).toBe(4);

      // Other mechanical tools with tag "torque": torque-power, shaft-torsion, gear-design, gear-force-torque
      const firstPick = similar[0];
      expect(firstPick.tags).toContain("torque");
    });
  });
});
