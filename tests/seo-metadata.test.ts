import { describe, expect, it } from "vitest";
import { buildPageMetadata } from "@/utils/metadata";
import { buildOgImageUrl } from "@/utils/seo";

describe("SEO metadata helpers", () => {
  it("builds absolute dynamic OG image URLs with safe query params", () => {
    const url = new URL(
      buildOgImageUrl({
        title: "Bolt Calculator",
        description: "Deterministic engineering calculator",
        locale: "en",
        path: "/tools/bolt-calculator",
      }),
    );

    expect(url.origin).toBe("https://aiengineerslab.com");
    expect(url.pathname).toBe("/og");
    expect(url.searchParams.get("title")).toBe("Bolt Calculator");
    expect(url.searchParams.get("locale")).toBe("en");
    expect(url.searchParams.get("path")).toBe("/tools/bolt-calculator");
  });

  it("uses per-page dynamic OG images by default", () => {
    const metadata = buildPageMetadata({
      title: "Mechanical Engineering Calculators",
      description: "Engineering calculators with standards, formulas, and reports for fast technical decisions.",
      path: "/tools",
      locale: "en",
    });

    const images = metadata.openGraph?.images;
    expect(Array.isArray(images)).toBe(true);
    const [image] = images as Array<{ url: string }>;
    expect(image.url).toContain("/og?");
    expect(image.url).toContain("Mechanical+Engineering+Calculators");
  });
});
