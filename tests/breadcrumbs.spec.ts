import { expect, test } from "@playwright/test";

test("product breadcrumbs navigate back to category and store in both languages", async ({
  page,
}) => {
  for (const language of ["en", "fa"]) {
    await page.addInitScript(
      (language) => localStorage.setItem("avastar-language", language),
      language,
    );
    await page.setViewportSize({
      width: language === "fa" ? 390 : 1440,
      height: 900,
    });
    await page.goto("/store/product/refractor");
    const trail = page.locator(".shop-breadcrumbs");
    await expect(trail.locator("[aria-current=page]")).toHaveCount(1);
    await expect(trail.locator("li")).toHaveCount(4);
    await trail.locator('a[href="/store/category/telescopes"]').click();
    await expect(page).toHaveURL(/\/store\/category\/telescopes$/);
    await expect(trail.locator("li")).toHaveCount(3);
    await trail.locator('a[href="/store"]').click();
    await expect(page).toHaveURL(/\/store$/);
    await expect(trail.locator("li")).toHaveCount(2);
  }
});
