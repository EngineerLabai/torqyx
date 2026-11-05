import { describe, expect, it, vi } from "vitest";
import type { Locale } from "@/utils/locale";

vi.mock("server-only", () => ({}));

let currentMockLocale: Locale = "tr";
vi.mock("@/utils/locale-server", () => ({
  getLocaleFromCookies: vi.fn(async () => currentMockLocale),
}));

describe("tool and category render tests", () => {
  const locales: Locale[] = ["tr", "en"];

  describe("tool docs resolution and serialization for all catalog tools", async () => {
    const { toolCatalog } = await import("@/tools/_shared/catalog");
    const { getToolDocsResponse } = await import("@/lib/toolDocs/loadToolDoc");

    for (const locale of locales) {
      // Standalone tools with dedicated /tools/[slug] routes
      const standaloneTools = toolCatalog.filter(
        (tool) => tool.href.startsWith("/tools/") && !tool.href.includes("#")
      );

      for (const tool of standaloneTools) {
        const slug = tool.href.replace(/^\/tools\//, "");
        it(`loads tool docs cleanly without throwing for ${tool.id} (${slug}) [${locale}]`, async () => {
          const docs = await getToolDocsResponse(slug, locale);
          expect(docs).toBeDefined();
          expect(docs.tool).toBeDefined();
          expect(docs.tool?.id).toBe(tool.id);
          expect(typeof docs.hasDocs).toBe("boolean");
          // If docs are present and not draft, explanation or examples or standard must be available
          if (docs.hasDocs && !docs.isDraft) {
            expect(docs.explanation !== null || docs.examples !== null || docs.standard !== null).toBe(true);
          }
        });
      }

      // Explicitly test the 5 previously broken tools
      const targetTools = [
        "bolt-database",
        "heat-energy",
        "machine-elements",
        "strength-statics",
        "bolt-calculator",
      ];
      for (const slug of targetTools) {
        it(`specifically verifies ${slug} [${locale}] documentation compiles without error`, async () => {
          const docs = await getToolDocsResponse(slug, locale);
          expect(docs).toBeDefined();
          if (locale === "tr") {
            expect(docs.hasDocs).toBe(true);
            expect(docs.explanation !== null || docs.standard !== null).toBe(true);
          }
        });
      }
    }
  });

  describe("all navigable categories render cleanly without throwing", async () => {
    const { getNavigableCategoryIndex } = await import("@/utils/taxonomy");
    const { default: CategoryPage, generateMetadata } = await import("@/app/categories/[category]/page");

    for (const locale of locales) {
      const categories = await getNavigableCategoryIndex(locale);

      for (const cat of categories) {
        it(`renders category ${cat.slug} in ${locale} without errors`, async () => {
          currentMockLocale = locale;
          const pageResult = await CategoryPage({
            params: Promise.resolve({ category: cat.slug }),
          });
          expect(pageResult).toBeDefined();

          const metadata = await generateMetadata({
            params: Promise.resolve({ category: cat.slug }),
          });
          expect(metadata).toBeDefined();
          expect(metadata.title).toBeDefined();
        });
      }
    }

    it("renders general-engineering in both tr and en without throwing", async () => {
      currentMockLocale = "tr";
      const trResult = await CategoryPage({
        params: Promise.resolve({ category: "general-engineering" }),
      });
      expect(trResult).toBeDefined();

      currentMockLocale = "en";
      const enResult = await CategoryPage({
        params: Promise.resolve({ category: "general-engineering" }),
      });
      expect(enResult).toBeDefined();
    });
  });
});
