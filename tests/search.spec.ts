import { test, expect } from "@playwright/test";

test("command palette search navigates to tool", async ({ page }) => {
  await page.goto("/tr");
  await page.keyboard.press("Control+K");

  const input = page.getByTestId("command-palette-input");
  await expect(input).toBeVisible();
  await input.fill("torque-power");

  const firstResult = page.getByTestId("command-palette-result").first();
  await expect(firstResult).toBeVisible();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/tr\/tools\/torque-power/);
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
});
