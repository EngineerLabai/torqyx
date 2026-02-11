import { test, expect } from "@playwright/test";

const paths = ["/tr/tools/compressor-cc", "/en/tools/compressor-cc"];

test.describe("compressor-cc route", () => {
  for (const path of paths) {
    test(`GET ${path} returns 200 with visible H1`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `GET ${path} should return 200`).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    });
  }
});
