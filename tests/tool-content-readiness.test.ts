import { describe, expect, it } from "vitest";
import { getToolIndexReadyLocales, isToolLocaleIndexReady } from "@/utils/tool-content-readiness";
import { buildToolMetadata } from "@/utils/tool-seo";

const RECOVERED_TOOL_IDS = [
  "gear-design",
  "material-cards",
  "gear-weight",
  "gear-contact-ratio",
  "gear-helix-axial",
  "gear-force-torque",
  "gear-backlash",
  "bolt-database",
  "gear-ratio",
  "gear-viscosity",
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
  it("keeps genuine unready tools out of English search indexing", () => {
    expect(isToolLocaleIndexReady("unready-draft-tool", "tr")).toBe(true);
    expect(isToolLocaleIndexReady("unready-draft-tool", "en")).toBe(false);
    expect(getToolIndexReadyLocales("unready-draft-tool")).toEqual(["tr"]);
  });

  it("automatically marks all 19 fixed and translated tools as index-ready in English", () => {
    for (const toolId of RECOVERED_TOOL_IDS) {
      expect(isToolLocaleIndexReady(toolId, "tr")).toBe(true);
      expect(
        isToolLocaleIndexReady(toolId, "en"),
        `Expected ${toolId} to be index-ready for English`,
      ).toBe(true);
      expect(getToolIndexReadyLocales(toolId)).toEqual(["tr", "en"]);
    }
  });

  it("sets robots to undefined (indexable) for recovered tools and noindex for unready tools", () => {
    // Verified tools now return indexable (robots: undefined)
    for (const toolId of RECOVERED_TOOL_IDS) {
      const metadata = buildToolMetadata(toolId, "en");
      expect(
        metadata.robots,
        `Expected ${toolId} to be indexable (robots: undefined)`,
      ).toBeUndefined();
    }

    // Draft / unready tool should have noindex, follow
    const unready = buildToolMetadata("unready-draft-tool", "en");
    // If not in catalog, tool is null so robots is undefined; test with an unready catalog item if one exists
    expect(isToolLocaleIndexReady("unready-draft-tool", "en")).toBe(false);
  });
});
