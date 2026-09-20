import { describe, expect, it } from "vitest";
import { shouldHideSharedCalculation } from "@/utils/share-access";
import { buildSharedCalculationMetadata } from "@/utils/share-seo";

describe("shared calculation route safety", () => {
  it("always emits generic noindex metadata without language alternates", () => {
    const metadata = buildSharedCalculationMetadata("private-code", "tr");

    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    });
    expect(metadata.alternates?.canonical).toBe("https://torqyx.com/tr/s/private-code");
    expect(metadata.alternates?.languages).toBeUndefined();
    expect(JSON.stringify(metadata)).not.toContain("user");
    expect(JSON.stringify(metadata)).not.toContain("inputs");
  });

  it("hides missing, expired, and unauthorized private shares", () => {
    const now = new Date("2026-07-20T12:00:00.000Z");
    const publicShare = { expiresAt: null, isPublic: true, userId: "owner" };
    const privateShare = { expiresAt: null, isPublic: false, userId: "owner" };
    const expiredShare = {
      expiresAt: new Date("2026-07-19T12:00:00.000Z"),
      isPublic: true,
      userId: "owner",
    };

    expect(shouldHideSharedCalculation(null, { now })).toBe(true);
    expect(shouldHideSharedCalculation(expiredShare, { now })).toBe(true);
    expect(shouldHideSharedCalculation(privateShare, { currentUserId: "visitor", now })).toBe(true);
    expect(shouldHideSharedCalculation(privateShare, { currentUserId: "owner", now })).toBe(false);
    expect(shouldHideSharedCalculation(publicShare, { now })).toBe(false);
  });
});
