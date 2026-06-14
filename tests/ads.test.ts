import { describe, expect, it } from "vitest";
import { isAdsAllowedPath, normalizeAdPath } from "@/utils/ads";

describe("AdSense route policy", () => {
  it("normalizes localized public paths", () => {
    expect(normalizeAdPath("/tr/blog/example")).toBe("/blog/example");
    expect(normalizeAdPath("/en/tools/bolt-calculator/report")).toBe("/tools/bolt-calculator/report");
  });

  it("allows article pages only", () => {
    expect(isAdsAllowedPath("/tr/blog/example")).toBe(true);
    expect(isAdsAllowedPath("/en/blog/example")).toBe(true);
  });

  it("blocks behavioral, report, and error-like surfaces", () => {
    expect(isAdsAllowedPath("/tr/tools/bolt-calculator/report")).toBe(false);
    expect(isAdsAllowedPath("/tr/request-tool")).toBe(false);
    expect(isAdsAllowedPath("/tr/404")).toBe(false);
    expect(isAdsAllowedPath("/tr/premium")).toBe(false);
  });
});
