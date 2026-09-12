import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-09-12T12:00:00Z"));
  await page.goto("/");
});

test("hero parallax and progress track scroll without shifting layout", async ({
  page,
}) => {
  const depth = page.locator(".hero-depth");
  const initial = await depth.evaluate((e) => getComputedStyle(e).transform);
  const height = await page
    .locator(".hero")
    .evaluate((e) => e.getBoundingClientRect().height);
  await page.evaluate(() => scrollTo({ top: 400, behavior: "instant" }));
  await expect
    .poll(() => depth.evaluate((e) => getComputedStyle(e).transform))
    .not.toBe(initial);
  expect(
    await page
      .locator(".hero")
      .evaluate((e) => e.getBoundingClientRect().height),
  ).toBe(height);
  await expect
    .poll(() =>
      page
        .locator(".reading-progress")
        .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a),
    )
    .toBeGreaterThan(0);
  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      page
        .locator(".reading-progress")
        .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a),
    )
    .toBeCloseTo(1, 2);
  await expect(page.locator(".campaign")).toBeInViewport();
});

test("editorial holds briefly, crossfades existing imagery, and releases", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  const article = page.locator(".editorial");
  const image = page.locator(".editorial-image");
  const overlay = page.locator(".editorial-wide");
  await expect(image).toHaveCSS("position", "sticky");
  const start = await article.evaluate(
    (e) => e.getBoundingClientRect().top + scrollY,
  );
  await page.evaluate(
    (y) => scrollTo({ top: y - 500, behavior: "instant" }),
    start,
  );
  const opacity = await overlay.evaluate((e) =>
    Number(getComputedStyle(e).opacity),
  );
  const top = await page
    .locator(".masthead")
    .evaluate((e) => e.getBoundingClientRect().height + 32);
  await page.evaluate(
    (y) => scrollTo({ top: y, behavior: "instant" }),
    start - top + 30,
  );
  await expect
    .poll(async () => Math.abs((await image.boundingBox())!.y - top))
    .toBeLessThan(2);
  await page.evaluate(() => scrollBy({ top: 50, behavior: "instant" }));
  await expect
    .poll(async () => Math.abs((await image.boundingBox())!.y - top))
    .toBeLessThan(2);
  await expect
    .poll(() => overlay.evaluate((e) => Number(getComputedStyle(e).opacity)))
    .toBeGreaterThan(opacity);
  await page.evaluate(() => scrollBy({ top: 700, behavior: "instant" }));
  await expect
    .poll(async () => (await image.boundingBox())!.y)
    .toBeLessThan(top);
  await page.setViewportSize({ width: 360, height: 800 });
  await expect(image).toHaveCSS("position", "relative");
});

test("preference crossfades retain focus and settle on the requested layout", async ({
  page,
}) => {
  const toggle = page.getByRole("button", { name: "Switch to English" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(
    page.getByRole("button", { name: "تغییر زبان به فارسی" }),
  ).toBeFocused();
  await page.locator("select").selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "تغییر زبان به فارسی" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("reduced motion removes depth, masks and sticky hold", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const selector of [
    ".hero-depth",
    ".editorial-wide",
    ".tour-feature > img",
  ]) {
    await expect(page.locator(selector)).toHaveCSS("animation-name", "none");
  }
  await expect(page.locator(".hero-depth")).toHaveCSS("transform", "none");
  await expect(page.locator(".editorial-image")).toHaveCSS(
    "position",
    "relative",
  );
  await expect(page.locator(".editorial-image")).toHaveCSS("clip-path", "none");
  await expect(page.locator(".editorial-wide")).toHaveCSS("opacity", "0");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator(".hero-image")).toHaveCSS("animation-name", "none");
});

test("unsupported timeline and transition APIs retain usable fallbacks", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(document, "startViewTransition", {
      value: undefined,
    });
    const supports = CSS.supports.bind(CSS);
    CSS.supports = ((...args: string[]) =>
      args.join(" ").includes("animation-timeline")
        ? false
        : supports(args[0], args[1])) as typeof CSS.supports;
  });
  await page.reload();
  await page.evaluate(() => scrollTo({ top: 1200, behavior: "instant" }));
  await expect
    .poll(() =>
      page.locator(".reading-progress").evaluate((e) => e.style.transform),
    )
    .toMatch(/scaleX\(0\.[1-9]/);
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await page.locator("select").selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("touch image swipes preserve native page scrolling and visible controls", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  const card = page.locator(".product").first();
  const visual = card.locator(".product-visual");
  await visual.scrollIntoViewIfNeeded();
  const image = visual.locator("img");
  const first = await image.getAttribute("src");
  const client = await context.newCDPSession(page);
  async function swipe(dx: number, dy: number) {
    const box = (await visual.boundingBox())!;
    const x = box.x + box.width / 2,
      y = box.y + box.height / 2;
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    for (let i = 1; i <= 5; i++)
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x + (dx * i) / 5, y: y + (dy * i) / 5 }],
      });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  }
  await swipe(100, 0);
  await expect(image).not.toHaveAttribute("src", first!);
  const current = await image.getAttribute("src");
  const y = await page.evaluate(() => scrollY);
  await swipe(0, -100);
  await expect(image).toHaveAttribute("src", current!);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y);
  await visual.scrollIntoViewIfNeeded();
  await card.getByRole("button", { name: /تصویر قبلی/ }).tap();
  await expect(image).toHaveAttribute("src", first!);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await context.close();
});
