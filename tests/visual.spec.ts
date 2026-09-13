import { test, expect } from "@playwright/test";
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

test("inspect motion-enabled hero and editorial at desktop and mobile sizes", async ({
  page,
}) => {
  await mkdir("artifacts", { recursive: true });
  await page.goto("/");
  for (const width of [1440, 390]) {
    await page.evaluate(() => localStorage.clear());
    await page.setViewportSize({ width, height: 960 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page
      .locator(".hero-buttons")
      .evaluate((e) => Promise.all(e.getAnimations().map((a) => a.finished)));
    await page.screenshot({ path: `artifacts/motion-hero-${width}.png` });
    const y = await page
      .locator(".editorial")
      .evaluate((e) => e.getBoundingClientRect().top + scrollY);
    await page.evaluate(
      (top) => scrollTo({ top: top - 200, behavior: "instant" }),
      y,
    );
    await page
      .locator(".editorial-wide")
      .evaluate((e: HTMLImageElement) => e.decode());
    await expect(page.locator(".editorial")).toHaveClass(/in-view/);
    await page
      .locator(".editorial")
      .evaluate((e) => Promise.all(e.getAnimations().map((a) => a.finished)));
    await page.screenshot({ path: `artifacts/motion-editorial-${width}.png` });
    await page.locator("select").selectOption("light");
    await page.getByRole("button", { name: "Switch to English" }).click();
    await page.screenshot({
      path: `artifacts/motion-editorial-light-en-${width}.png`,
    });
  }
});
