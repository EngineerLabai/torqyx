import { expect, test } from "@playwright/test";

const routes = ["/tr", "/en", "/tr/tools", "/en/tools"];

test.describe("i18n visual smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("ael_consent", "accept");
      window.localStorage.setItem(
        "ael_consent_prefs",
        JSON.stringify({ analytics: true, advertising: false }),
      );
      document.cookie = "ael_consent=accept; path=/";
    });
  });

  for (const route of routes) {
    test(`visual render ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 960 });
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status(), `GET ${route} should return 200`).toBe(200);

      await expect(page.locator("main, body").first()).toBeVisible();
      const bodyText = await page.locator("body").innerText();
      expect(bodyText.includes("\uFFFD")).toBeFalsy();

      const lang = await page.evaluate(() => document.documentElement.lang);
      const expectedLang = route.startsWith("/en") ? "en" : "tr";
      expect(lang).toBe(expectedLang);

      const screenshot = await page.screenshot({ fullPage: true, animations: "disabled" });
      expect(screenshot.byteLength).toBeGreaterThan(35_000);
    });
  }
});
