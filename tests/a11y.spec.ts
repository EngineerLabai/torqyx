import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/tr", "/en", "/tr/tools", "/en/tools"];

test.describe("accessibility smoke", () => {
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
    test(`axe critical violations ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });

      const report = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .exclude("iframe")
        .analyze();

      const criticalViolations = report.violations.filter((violation) => violation.impact === "critical");
      expect(criticalViolations, `Critical a11y violations on ${route}`).toEqual([]);
    });
  }
});
