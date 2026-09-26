import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { toolDocStandardSchema } from "@/lib/tool-docs/schema";

const CONTENT_ROOT = join(process.cwd(), "content", "tools");

const priorityEnglishDocs = ["bearing-life", "hydraulic-cylinder", "shaft-torsion"];

describe("priority English tool documentation", () => {
  it.each(priorityEnglishDocs)("keeps %s as a complete, non-placeholder standard document", (slug) => {
    const source = readFileSync(join(CONTENT_ROOT, `${slug}.en.json`), "utf8");
    const document = toolDocStandardSchema.parse(JSON.parse(source));

    expect(source.toLowerCase()).not.toContain("placeholder");
    expect(document.howTo).toHaveLength(3);
    expect(document.examples.length).toBeGreaterThanOrEqual(2);
    expect(document.references.length).toBeGreaterThanOrEqual(2);
    expect(document.commonMistakes.length).toBeGreaterThanOrEqual(3);
    expect(document.assumptions?.length).toBeGreaterThanOrEqual(3);
    expect(document.lastUpdated).toBe("2026-09-26");
  });
});
