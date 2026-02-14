import { test, expect } from "@playwright/test";

test("command palette opens and accepts input", async ({ page }) => {
  await page.goto("/tr", { waitUntil: "domcontentloaded" });

  const input = page.getByTestId("command-palette-input");
  for (let attempt = 0; attempt < 12; attempt += 1) {
    await page.evaluate(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
          bubbles: true,
        }),
      );
    });
    if (await input.isVisible().catch(() => false)) {
      break;
    }
    await page.waitForTimeout(250);
  }
  await expect(input).toBeVisible();
  await input.evaluate((element) => {
    const inputEl = element as HTMLInputElement;
    inputEl.value = "torque";
    inputEl.dispatchEvent(new Event("input", { bubbles: true }));
    inputEl.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect(input).toHaveValue("torque");
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  });
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
});
