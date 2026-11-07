import { describe, expect, it } from "vitest";
import { isAdsAllowedPath, normalizeAdPath } from "@/utils/ads";
import { isBlogPostAdEligible, BLOG_AD_MIN_WORDS } from "@/utils/blog-ad-eligibility";
import { isToolAdEligible, DEEP_CONTENT_TOOL_IDS } from "@/utils/tool-ad-eligibility";

describe("AdSense route policy and content eligibility", () => {
  it("normalizes localized public paths", () => {
    expect(normalizeAdPath("/tr/blog/example")).toBe("/blog/example");
    expect(normalizeAdPath("/en/tools/bolt-calculator/report")).toBe("/tools/bolt-calculator/report");
    expect(normalizeAdPath("/tr/tools/torque-power")).toBe("/tools/torque-power");
  });

  it("allows article blog pages", () => {
    expect(isAdsAllowedPath("/tr/blog/example")).toBe(true);
    expect(isAdsAllowedPath("/en/blog/example")).toBe(true);
  });

  it("allows deep engineering calculator pages with 600+ word guides only", () => {
    // Verified 9 priority tools with 600+ word deep guides
    expect(isAdsAllowedPath("/tr/tools/torque-power")).toBe(true);
    expect(isAdsAllowedPath("/en/tools/bolt-calculator")).toBe(true);
    expect(isAdsAllowedPath("/tr/tools/shaft-torsion")).toBe(true);
    expect(isAdsAllowedPath("/tr/tools/bending-stress")).toBe(true);
    expect(isAdsAllowedPath("/tr/tools/pipe-pressure-loss")).toBe(true);
    expect(isAdsAllowedPath("/tr/tools/hydraulic-cylinder")).toBe(true);
    expect(isAdsAllowedPath("/tr/tools/tolerance-lab")).toBe(true);
    expect(isAdsAllowedPath("/tr/tools/fillet-weld")).toBe(true);
    expect(isAdsAllowedPath("/tr/tools/unit-converter")).toBe(true);

    // Tools without deep 600+ word guides must be blocked
    expect(isAdsAllowedPath("/tr/tools/bearing-life")).toBe(false);
    expect(isAdsAllowedPath("/tr/tools/compressor-cc")).toBe(false);
    expect(isAdsAllowedPath("/tr/tools/gear-module")).toBe(false);
  });

  it("blocks behavioral, report, directory and error surfaces", () => {
    expect(isAdsAllowedPath("/tr/tools/bolt-calculator/report")).toBe(false);
    expect(isAdsAllowedPath("/tr/tools")).toBe(false);
    expect(isAdsAllowedPath("/tr/quality-tools")).toBe(false);
    expect(isAdsAllowedPath("/tr/project-hub")).toBe(false);
    expect(isAdsAllowedPath("/tr/request-tool")).toBe(false);
    expect(isAdsAllowedPath("/tr/404")).toBe(false);
    expect(isAdsAllowedPath("/tr/satis-iade-teslimat")).toBe(false);
    expect(isAdsAllowedPath("/tr/gizlilik")).toBe(false);
    expect(isAdsAllowedPath("/tr/cerez-politikasi")).toBe(false);
  });

  it("requires 600+ words of unique, non-draft, quality-gated content for blog posts", () => {
    expect(BLOG_AD_MIN_WORDS).toBe(600);

    const validPost = {
      type: "blog" as const,
      title: "Engineering calculation guide",
      description: "A complete engineering calculation guide with assumptions and verification steps.",
      content: "engineering ".repeat(600),
      draft: false,
    };

    expect(isBlogPostAdEligible(validPost)).toBe(true);
    // Draft blocked
    expect(isBlogPostAdEligible({ ...validPost, draft: true })).toBe(false);
    // Under 600 words blocked
    expect(isBlogPostAdEligible({ ...validPost, content: "engineering ".repeat(599) })).toBe(false);
    expect(isBlogPostAdEligible({ ...validPost, content: "too short" })).toBe(false);
    // Null blocked
    expect(isBlogPostAdEligible(null)).toBe(false);
  });

  it("evaluates tool eligibility based on deep guide presence and locale readiness", () => {
    // 9 verified deep content tools in TR and EN
    expect(DEEP_CONTENT_TOOL_IDS.size).toBe(9);
    for (const toolId of DEEP_CONTENT_TOOL_IDS) {
      expect(isToolAdEligible(toolId, "tr")).toBe(true);
      expect(isToolAdEligible(toolId, "en")).toBe(true);
    }

    // Tools without deep guides
    expect(isToolAdEligible("bearing-life", "tr")).toBe(false);
    expect(isToolAdEligible("compressor-cc", "en")).toBe(false);
    expect(isToolAdEligible("unknown-tool", "tr")).toBe(false);
    expect(isToolAdEligible(null, "tr")).toBe(false);
  });
});
