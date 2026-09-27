import { describe, expect, it } from "vitest";
import { getToolIndexReadyLocales, isToolLocaleIndexReady } from "@/utils/tool-content-readiness";
import { buildToolMetadata } from "@/utils/tool-seo";

describe("tool content index-readiness policy", () => {
  it("keeps incomplete English documentation out of search indexing", () => {
    expect(isToolLocaleIndexReady("fillet-weld", "tr")).toBe(true);
    expect(isToolLocaleIndexReady("fillet-weld", "en")).toBe(true);
    expect(isToolLocaleIndexReady("gear-design", "en")).toBe(false);
    expect(isToolLocaleIndexReady("gear-design/calculators/module-calculator", "en")).toBe(false);
  });

  it("does not emit unsupported English alternate targets", () => {
    expect(getToolIndexReadyLocales("gear-design")).toEqual(["tr"]);
    expect(getToolIndexReadyLocales("bearing-life")).toEqual(["tr", "en"]);
  });

  it("sets noindex,follow on incomplete English tool pages", () => {
    const incomplete = buildToolMetadata("basic-engineering", "en");
    const complete = buildToolMetadata("bearing-life", "en");

    expect(incomplete.robots).toMatchObject({ index: false, follow: true });
    expect(complete.robots).toBeUndefined();
  });
});
