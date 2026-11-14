import { describe, expect, it } from "vitest";
import {
  ENGLISH_GUIDE_PENDING_TOOL_IDS,
  getToolIndexReadyLocales,
  isToolLocaleIndexReady,
} from "@/utils/tool-content-readiness";
import { buildToolMetadata } from "@/utils/tool-seo";
import { NOINDEX_FOLLOW_ROBOTS } from "@/utils/metadata";

const READY_EN_TOOL_IDS = [
  "basic-engineering",
  "bearing-life",
  "belt-length",
  "bending-stress",
  "bolt-calculator",
  "compressor-cc",
  "fillet-weld",
  "hydraulic-cylinder",
  "param-chart",
  "pipe-pressure-loss",
  "sanity-check",
  "shaft-torsion",
  "simple-stress",
  "tolerance-lab",
  "torque-power",
  "unit-converter",
  "gear-design",
  "gear-ratio",
  "production-project",
  "heat-treatment",
  "strength-statics",
  "heat-energy",
  "fluids-hvac",
  "materials-manufacturing",
  "machine-elements",
  "sealing-guide",
  "coating-guide",
] as const;

describe("tool content index-readiness policy", () => {
  it("keeps tools pending guides out of English search indexing and sitemap", () => {
    for (const toolId of ENGLISH_GUIDE_PENDING_TOOL_IDS) {
      expect(isToolLocaleIndexReady(toolId, "tr")).toBe(true);
      expect(
        isToolLocaleIndexReady(toolId, "en"),
        `Expected ${toolId} without guide to be non-indexed in English`,
      ).toBe(false);
      expect(getToolIndexReadyLocales(toolId)).toEqual(["tr"]);

      const metadata = buildToolMetadata(toolId, "en");
      expect(metadata.robots).toEqual(NOINDEX_FOLLOW_ROBOTS);
    }
  });

  it("marks all tools with verified guides as index-ready in English", () => {
    for (const toolId of READY_EN_TOOL_IDS) {
      expect(isToolLocaleIndexReady(toolId, "tr")).toBe(true);
      expect(
        isToolLocaleIndexReady(toolId, "en"),
        `Expected ${toolId} to be index-ready for English`,
      ).toBe(true);
      expect(getToolIndexReadyLocales(toolId)).toEqual(["tr", "en"]);

      const metadata = buildToolMetadata(toolId, "en");
      expect(
        metadata.robots,
        `Expected ${toolId} to be indexable (robots: undefined)`,
      ).toBeUndefined();
    }
  });

  it("handles unready draft tool IDs cleanly", () => {
    expect(isToolLocaleIndexReady("unready-draft-tool", "tr")).toBe(true);
    expect(isToolLocaleIndexReady("unready-draft-tool", "en")).toBe(false);
    expect(getToolIndexReadyLocales("unready-draft-tool")).toEqual(["tr"]);
  });
});
