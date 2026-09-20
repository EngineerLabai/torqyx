import { describe, expect, it } from "vitest";
import { isAdsAllowedPath, normalizeAdPath } from "@/utils/ads";
import { isBlogPostAdEligible } from "@/utils/blog-ad-eligibility";

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
  });

  it("requires a real, published, quality-gated post in addition to the route pattern", () => {
    const validPost = {
      type: "blog" as const,
      title: "Engineering calculation guide",
      description: "A complete engineering calculation guide with assumptions and verification steps.",
      content: "engineering ".repeat(260),
      draft: false,
    };

    expect(isBlogPostAdEligible(validPost)).toBe(true);
    expect(isBlogPostAdEligible({ ...validPost, draft: true })).toBe(false);
    expect(isBlogPostAdEligible({ ...validPost, content: "too short" })).toBe(false);
    expect(isBlogPostAdEligible(null)).toBe(false);
  });
});
