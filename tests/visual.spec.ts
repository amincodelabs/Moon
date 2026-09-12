import { test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
test("capture complete page for visual inspection", async ({ page }) => {
  await mkdir("artifacts", { recursive: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/");
    for (const img of await page.locator("img").all())
      await img.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: `artifacts/persian-dark-${width}.png`,
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "Switch to English" }).click();
  await page.locator("select").selectOption("light");
  await page.screenshot({
    path: "artifacts/english-light-1440.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.screenshot({
    path: "artifacts/english-light-360.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.screenshot({ path: "artifacts/search-mobile.png" });
});
