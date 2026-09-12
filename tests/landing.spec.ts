import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-09-12T12:00:00Z"));
  await page.goto("/");
});
test("Persian destinations and honest future routes", async ({ page }) => {
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  for (const name of ["فروشگاه", "آموزش", "تورهای رصدی", "مجله"])
    await expect(
      page
        .getByRole("navigation", { name: "فهرست" })
        .getByRole("link", { name, exact: true }),
    ).toBeVisible();
  await page.locator(".destination").nth(1).click();
  await expect(page.getByRole("dialog")).toContainText(
    "این مسیر به‌زودی باز می‌شود",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".destination").nth(1)).toBeFocused();
});
test("language changes content, metadata and persists", async ({ page }) => {
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "only the beginning.",
  );
  await expect(page).toHaveTitle("AvaStar | The sky is only the beginning");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "تغییر زبان به فارسی" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});
test("all theme choices persist and system follows device", async ({
  page,
}) => {
  const select = page.getByRole("combobox", { name: "نمایش" });
  await select.selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(select).toHaveValue("light");
  await select.selectOption("system");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await select.selectOption("dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
test("landing account opens the full store account page", async ({ page }) => {
  await page
    .getByRole("button", { name: "ورود / ثبت‌نام", exact: true })
    .click();
  await expect(page).toHaveURL(/\/store\/account$/);
  await expect(
    page.getByRole("heading", { name: "خوش آمدید", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "تازه‌واردید؟ حساب بسازید" }),
  ).toBeVisible();
});
test("campaign dismissal persists", async ({ page }) => {
  await page.getByRole("button", { name: "بستن اطلاعیه" }).click();
  await expect(page.locator(".campaign")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".campaign")).toHaveCount(0);
});
test("product gallery advances and reverses", async ({ page }) => {
  const card = page.locator(".product").first();
  const image = card.locator("img");
  const first = await image.getAttribute("src");
  await card.getByRole("button", { name: /تصویر بعدی/ }).click();
  await expect(image).not.toHaveAttribute("src", first!);
  await expect(image).toHaveAttribute("alt", /نمای نزدیک/);
  await card.getByRole("button", { name: /تصویر قبلی/ }).click();
  await expect(image).toHaveAttribute("src", first!);
});
test("mobile menu supports keyboard, traps focus, restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const menu = page.getByRole("button", { name: "فهرست", exact: true });
  await menu.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((d) => d.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Switch to English" }),
  ).toBeVisible();
  await expect(page.getByRole("combobox", { name: "نمایش" })).toBeVisible();
});
test("search filters destinations, support is explicitly unavailable", async ({
  page,
}) => {
  await page.getByRole("button", { name: "جست‌وجو", exact: true }).click();
  await page.getByRole("textbox", { name: "جست‌وجو" }).fill("آموزش");
  await expect(page.getByRole("dialog").getByRole("link")).toHaveCount(1);
  await page.getByRole("dialog").getByRole("link").click();
  await expect(page.getByRole("dialog")).toContainText("این مسیر به‌زودی");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "جست‌وجو", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "راهنمای آوااستار" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "گفت‌وگو یا ارسال پیام هنوز فعال نیست",
  );
});
test("journey is optional and keyboard operable", async ({ page }) => {
  const button = page.getByRole("button", { name: /مجهز شوید/ });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#journey-detail")).toContainText("ابزار مناسب");
});
test("reduced motion leaves content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  for (const section of await page.locator(".section").all())
    expect(await section.evaluate((e) => getComputedStyle(e).opacity)).toBe(
      "1",
    );
  expect(
    await page
      .locator(".hero-image")
      .evaluate((e) => getComputedStyle(e).animationName),
  ).toBe("none");
});
for (const width of [360, 768, 1024, 1440])
  test(`layout and image loading at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
    });
    await page.setViewportSize({ width, height: 960 });
    for (const language of ["fa", "en"]) {
      if (language === "en")
        await page.getByRole("button", { name: "Switch to English" }).click();
      for (const img of await page.locator("img").all()) {
        await img.evaluate((e) =>
          e.scrollIntoView({ behavior: "instant", block: "center" }),
        );
        await expect(img).toHaveJSProperty("complete", true);
        expect(
          await img.evaluate((e) => (e as HTMLImageElement).naturalWidth),
        ).toBeGreaterThan(0);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
test("accessibility in both locales and themes, including overlays", async ({
  page,
}) => {
  for (const language of ["fa", "en"]) {
    if (language === "en")
      await page.getByRole("button", { name: "Switch to English" }).click();
    for (const theme of ["dark", "light"]) {
      await page.locator("select").selectOption(theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    }
  }
  await page.getByRole("button", { name: "Search", exact: true }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

for (const width of [360, 1440]) {
  test(`campaign stays above navigation on scroll at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => scrollTo({ top: 1600, behavior: "instant" }));
    const banner = page.locator(".campaign");
    const header = page.locator(".header");
    await expect(banner).toBeInViewport();
    await expect(header).toBeInViewport();
    const bannerBox = (await banner.boundingBox())!;
    const headerBox = (await header.boundingBox())!;
    expect(bannerBox.y).toBe(0);
    expect(Math.abs(headerBox.y - bannerBox.height)).toBeLessThan(1);
    await page.getByRole("button", { name: "بستن اطلاعیه" }).click();
    await expect(banner).toHaveCount(0);
    expect((await header.boundingBox())!.y).toBe(0);
    await page.locator(".brand").first().click();
    await page.getByRole("link", { name: "شروع کاوش", exact: true }).click();
    await expect
      .poll(async () => (await page.locator("#universe").boundingBox())!.y)
      .toBeGreaterThanOrEqual((await header.boundingBox())!.height);
  });
}

test("scroll reveals and journey motion respond to reduced-motion changes", async ({
  page,
}) => {
  const card = page.locator(".destination").first();
  await card.evaluate((e) =>
    e.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(card).toHaveClass(/in-view/);
  await expect
    .poll(() => card.evaluate((e) => getComputedStyle(e).animationName))
    .toBe("editorial-rise");
  const traveler = page.locator(".journey-traveler");
  const before = await traveler.evaluate((e) => getComputedStyle(e).transform);
  await page.getByRole("button", { name: /مجهز شوید/ }).click();
  await expect
    .poll(() => traveler.evaluate((e) => getComputedStyle(e).transform))
    .not.toBe(before);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() => card.evaluate((e) => getComputedStyle(e).animationName))
    .toBe("none");
  expect(
    await traveler.evaluate((e) => getComputedStyle(e).transitionDuration),
  ).toBe("0s");
  await expect(page.locator("#journey-detail")).toContainText("ابزار مناسب");
});
