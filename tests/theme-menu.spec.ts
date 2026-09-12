import { expect, test } from "@playwright/test";

test("theme toggles between light and dark without a menu on landing and store", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.addInitScript(() => {
    localStorage.setItem("avastar-language", "en");
    localStorage.setItem("avastar-theme", "system");
  });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/store"]) {
      await page.goto(route);
      const controls = page.locator(".preferences").first();
      const toggle = controls.getByRole("switch");
      await expect(toggle).toHaveAttribute("aria-checked", "false");
      await toggle.click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await toggle.focus();
      await toggle.press("Space");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await expect(controls.getByRole("listbox")).toHaveCount(0);
      await expect(toggle).toBeFocused();
      await expect(controls.locator("[aria-haspopup], select")).toHaveCount(0);
    }
  }
});
