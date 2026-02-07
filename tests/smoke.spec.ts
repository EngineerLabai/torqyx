import { test, expect } from "@playwright/test";

const paths = [
  "/tr",
  "/tr/tools",
  "/tr/tools/unit-converter",
  "/tr/tools/bolt-size-torque",
  "/tr/tools/sanity-check",
  "/tr/reference",
  "/tr/support",
  "/tr/tools/torque-power",
  "/tr/quality-tools",
  "/tr/fixture-tools",
  "/tr/changelog",
];

test.describe("smoke routes", () => {
  for (const path of paths) {
    test(`GET ${path} returns 200 with visible H1`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `GET ${path} should return 200`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    });
  }
});
