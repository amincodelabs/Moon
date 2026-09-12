import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function register(page: Page, next = "/store/account") {
  await page.goto(`/store/register?next=${encodeURIComponent(next)}`);
  await page.getByLabel("Full name", { exact: true }).fill("Sky Explorer");
  await page.getByLabel("Mobile number", { exact: true }).fill("09123456789");
  await page.getByLabel("Email", { exact: true }).fill("sky@example.com");
  await page
    .getByRole("button", { name: "Create demo account", exact: true })
    .click();
}
async function addAddress(page: Page) {
  await page.getByLabel("Address label", { exact: true }).fill("Home");
  await page.getByLabel("City in Iran", { exact: true }).fill("Tehran");
  await page
    .getByLabel("Postal code (10 digits)", { exact: true })
    .fill("1234567890");
  await page
    .getByLabel("Street, building and unit", { exact: true })
    .fill("Sample Street, building 12, unit 3");
  await page.getByRole("button", { name: "Save address", exact: true }).click();
}
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-09-12T12:00:00Z"));
  await page.addInitScript(() => {
    if (!localStorage.getItem("avastar-language"))
      localStorage.setItem("avastar-language", "en");
  });
});

test("landing navigation, deep links and browser history", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Explore the store", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/store$/);
  await expect(
    page.getByRole("heading", { name: "Explore the store" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Horizon 80 Refractor", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/store\/product\/refractor$/);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Horizon 80 Refractor",
  );
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Explore the store" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "AvaStar home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("store hero cycles through linked campaign banners", async ({ page }) => {
  await page.goto("/store");
  const hero = page.locator(".shop-editorial-hero");
  await expect(hero.locator("img")).toHaveAttribute("src", /sky-800/);
  await hero.getByRole("button", { name: "Next banner" }).click();
  await expect(hero.locator("img")).toHaveAttribute("src", /tour-800/);
  await expect(
    hero.getByRole("link", { name: "Discover dark skies" }),
  ).toHaveAttribute("href", "/tours");
  await hero.getByRole("button", { name: "Banner 3" }).click();
  await expect(hero.locator("img")).toHaveAttribute("src", /galaxy-800/);
  await expect(
    hero.getByRole("link", { name: "Learn before you choose" }),
  ).toHaveAttribute("href", "/education");
  await hero.getByRole("button", { name: "Previous banner" }).click();
  await expect(hero.locator("img")).toHaveAttribute("src", /tour-800/);
});

test("catalog search, filters, sorting, collections, gallery and persistent wishlist", async ({
  page,
}) => {
  await page.goto("/store");
  await expect(page.locator(".shop-collection")).toHaveCount(3);
  await expect(
    page.getByRole("heading", { name: "Top selling" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Selected collection" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "For starters" }),
  ).toBeVisible();
  const fullList = page.locator(".shop-full-list");
  await expect(fullList.locator(".shop-product")).toHaveCount(6);
  await page.getByRole("button", { name: "2" }).last().click();
  await expect(fullList.locator(".shop-product")).toHaveCount(1);
  await page.getByRole("button", { name: "1" }).last().click();
  await page.getByLabel("Search products", { exact: true }).fill("Atlas");
  await expect(fullList.locator(".shop-product")).toHaveCount(2);
  await page.getByLabel("Search products", { exact: true }).fill("");
  await page
    .getByRole("combobox", { name: "Brand", exact: true })
    .selectOption("Orbit");
  await page.getByLabel("In stock only", { exact: true }).check();
  await expect(fullList.locator(".shop-product")).toHaveCount(2);
  await page.getByLabel("Maximum price (IRR)", { exact: true }).fill("5000000");
  await expect(page.getByText("No matches yet")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.getByLabel("Telescopes", { exact: true }).check();
  await expect(fullList.locator(".shop-product")).toHaveCount(2);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.getByLabel("Sort products").selectOption("low");
  await expect(fullList.locator(".shop-product").first()).toContainText(
    "Orbit Redlight Torch",
  );
  await page.getByLabel("Sort products").selectOption("high");
  await expect(fullList.locator(".shop-product").first()).toContainText(
    "Zenith 90",
  );
  await page.getByLabel("Sort products").selectOption("new");
  await expect(fullList.locator(".shop-product").first()).toContainText(
    "Orbit Redlight Torch",
  );
  await page.getByLabel("Sort products").selectOption("best");
  await expect(fullList.locator(".shop-product").first()).toContainText(
    "Atlas 10×50",
  );
  await page.getByLabel("Sort products").selectOption("selected");
  const tile = fullList.locator(".shop-product").first();
  const image = await tile.locator("img").getAttribute("src");
  await tile.getByRole("button", { name: /Next image/ }).click();
  await expect(tile.locator("img")).not.toHaveAttribute("src", image!);
  await tile.getByRole("button", { name: /Previous image/ }).click();
  await expect(tile.locator("img")).toHaveAttribute("src", image!);
  await tile.getByRole("button", { name: "Save to wishlist" }).click();
  await page.getByRole("link", { name: "Wishlist", exact: true }).click();
  await page.reload();
  await expect(page.locator(".shop-product")).toHaveCount(1);
  await page.getByRole("button", { name: "Save to wishlist" }).click();
  await expect(page.getByText("Keep a little inspiration")).toBeVisible();
});

test("add-to-basket controls become a plus/minus quantity stepper", async ({
  page,
}) => {
  await page.goto("/store");
  const tile = page.locator(".shop-full-list .shop-product").first();
  await tile.getByRole("button", { name: "Add to cart", exact: true }).click();
  await expect(tile.locator(".shop-cart-stepper output")).toHaveText("1");
  await tile.getByRole("button", { name: /Increase quantity/ }).click();
  await expect(tile.locator(".shop-cart-stepper output")).toHaveText("2");
  await tile.getByRole("button", { name: /Decrease quantity/ }).click();
  await expect(tile.locator(".shop-cart-stepper output")).toHaveText("1");
  await page.goto("/store/product/refractor");
  await expect(
    page.locator(".shop-detail-actions .shop-cart-stepper output"),
  ).toHaveText("1");
  await page
    .locator(".shop-detail-actions")
    .getByRole("button", { name: /Increase quantity/ })
    .click();
  await expect(
    page.locator(".shop-detail-actions .shop-cart-stepper output"),
  ).toHaveText("2");
});

test("variants, cart quantities, vouchers and persistence through authentication", async ({
  page,
}) => {
  await page.goto("/store/product/refractor");
  const manual = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download product manual" }).click();
  expect((await manual).suggestedFilename()).toBe("refractor-manual.txt");
  await page.getByLabel("Model / finish").selectOption("1");
  await page
    .getByRole("button", { name: "Add to cart", exact: true })
    .first()
    .click();
  await page.getByLabel("Model / finish").selectOption("0");
  await page
    .getByRole("button", { name: "Add to cart", exact: true })
    .first()
    .click();
  await page.getByRole("link", { name: "Cart (2)", exact: true }).click();
  await expect(page.locator(".shop-cart-line")).toHaveCount(2);
  await page
    .locator(".shop-cart-line")
    .first()
    .getByRole("button", { name: /Increase quantity/ })
    .click();
  await expect(
    page.getByRole("link", { name: "Cart (3)", exact: true }),
  ).toBeVisible();
  await page
    .locator(".shop-cart-line")
    .first()
    .getByRole("button", { name: /Decrease quantity/ })
    .click();
  await page.getByLabel("Voucher code", { exact: true }).fill("NOPE");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("invalid");
  await page.getByLabel("Voucher code", { exact: true }).fill("SKY10");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.locator(".shop-breakdown")).toContainText("37,000,000 IRR");
  await page.getByRole("button", { name: "Remove voucher" }).click();
  await register(page, "/store/cart");
  await expect(page.locator(".shop-cart-line")).toHaveCount(2);
  await expect(page.locator(".shop-cart-line").first()).toContainText(
    "Travel kit",
  );
  await page.reload();
  await expect(
    page.getByRole("link", { name: "Cart (2)", exact: true }),
  ).toBeVisible();
  await page
    .locator(".shop-cart-line")
    .first()
    .getByRole("button", { name: /Remove item/ })
    .click();
  await expect(page.locator(".shop-cart-line")).toHaveCount(1);
});

for (const method of ["Online payment gateway", "SnappPay"])
  test(`complete purchase, retry, receipt, review and return via ${method}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/store/product/refractor");
    await page
      .getByRole("button", { name: "Add to cart", exact: true })
      .first()
      .click();
    await page.goto("/store/checkout");
    await expect(
      page.getByRole("heading", { name: "Welcome back" }),
    ).toBeVisible();
    await register(page, "/store/checkout");
    await addAddress(page);
    await page.getByLabel("Express delivery", { exact: false }).check();
    await page.getByLabel(method, { exact: false }).check();
    await page.getByLabel("Voucher code", { exact: true }).fill("SKY10");
    await page.getByRole("button", { name: "Apply", exact: true }).click();
    await page.getByLabel("Use eligible coins").check();
    await expect(page.locator(".shop-payable")).toContainText(
      "165,300,000 IRR",
    );
    await page
      .getByRole("button", { name: "Review order", exact: true })
      .click();
    await expect(
      page.getByText("Sample Street", { exact: false }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Confirm & proceed to payment" })
      .click();
    await page.getByRole("button", { name: "Simulate failed payment" }).click();
    await expect(page.getByRole("alert")).toContainText(
      "no coins were deducted",
    );
    expect(
      await page.evaluate(
        () => JSON.parse(localStorage.getItem("avastar-store-v1")!).coins,
      ),
    ).toBe(240);
    await page.getByRole("button", { name: "Retry payment" }).click();
    await page
      .getByRole("button", { name: "Simulate successful payment" })
      .click();
    await expect(
      page.getByRole("heading", { name: "You're all set." }),
    ).toBeVisible();
    const download = page.waitForEvent("download");
    await page.getByRole("link", { name: "Download receipt" }).click();
    expect((await download).suggestedFilename()).toContain("receipt.txt");
    await page.reload();
    expect(
      await page.evaluate(
        () => JSON.parse(localStorage.getItem("avastar-store-v1")!).coins,
      ),
    ).toBe(0);
    await expect(
      page.getByRole("link", { name: "Cart (0)", exact: true }),
    ).toBeVisible();
    await page.getByRole("link", { name: "View order", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Shipment tracking" }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Request a return", exact: true })
      .click();
    await page.locator('select[name="refractor-0"]').selectOption("1");
    await page
      .getByRole("combobox", { name: "Reason", exact: true })
      .selectOption("incorrect");
    await page.getByRole("button", { name: "Submit return request" }).click();
    await expect(
      page.getByText("Request status: Submitted", { exact: false }),
    ).toBeVisible();
    await expect(page.locator('select[name="refractor-0"]')).toBeDisabled();
    await page.goto("/store/product/refractor");
    await page
      .getByRole("combobox", { name: "Rating", exact: true })
      .selectOption("4");
    await page
      .getByLabel("Your review", { exact: true })
      .fill("A wonderful first instrument for the Moon.");
    await page.getByRole("button", { name: "Publish review" }).click();
    await page.reload();
    await expect(
      page.getByText("A wonderful first instrument for the Moon."),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });

test("account profile, address management, logout, login and recovery", async ({
  page,
}) => {
  await register(page);
  await page.getByRole("link", { name: "Profile", exact: true }).click();
  await page.getByLabel("Full name", { exact: true }).fill("Lunar Explorer");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await page.getByRole("link", { name: "Addresses", exact: true }).click();
  await page.getByRole("button", { name: "Add address", exact: true }).click();
  await addAddress(page);
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByLabel("City in Iran", { exact: true }).fill("Shiraz");
  await page.getByRole("button", { name: "Save address", exact: true }).click();
  await expect(page.getByText("Shiraz", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Remove", exact: true }).click();
  await page
    .getByRole("button", { name: "Confirm removal", exact: true })
    .click();
  await expect(
    page.getByText("Add your first delivery address", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.goto("/store/recovery");
  await page.getByLabel("Email", { exact: true }).fill("sky@example.com");
  await page.getByRole("button", { name: "Simulate account recovery" }).click();
  await expect(
    page.getByText("Demo recovery complete", { exact: false }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to sign in" }).click();
  await page.getByLabel("Email", { exact: true }).fill("sky@example.com");
  await page.getByRole("button", { name: "Sign in to demo" }).click();
  await expect(
    page.getByRole("heading", { name: "Hello, Lunar Explorer" }),
  ).toBeVisible();
});

test("mobile checkout, keyboard navigation and account accessibility in both directions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/store/product/binoculars");
  await page
    .getByRole("button", { name: "Add to cart", exact: true })
    .first()
    .click();
  await register(page, "/store/checkout");
  await addAddress(page);
  for (const language of ["en", "fa"]) {
    if ((await page.locator("html").getAttribute("lang")) !== language)
      await page.locator(".language-button").click();
    await page
      .locator(".theme-control select")
      .selectOption(language === "en" ? "light" : "dark");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      scan.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.locator("#shop-main").focus();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `artifacts/store-checkout-${language}-390.png`,
      fullPage: true,
    });
  }
  await page.locator(".language-button").click();
  await page.getByRole("button", { name: "Review order", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Everything look right?" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Confirm & proceed to payment" })
    .click();
  await page
    .getByRole("button", { name: "Simulate successful payment" })
    .click();
  await page.goto("/store/account");
  await page.screenshot({
    path: "artifacts/store-account-390.png",
    fullPage: true,
  });
  expect(
    (
      await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()
    ).violations.map((v) => v.id),
  ).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.screenshot({
    path: "artifacts/store-account-1440.png",
    fullPage: true,
  });
});

test("expired campaign, unavailable products and review eligibility", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2027-01-02T12:00:00Z"));
  await page.goto("/store/product/eyepiece");
  await expect(page.locator(".shop-promotion")).toHaveCount(0);
  await expect(
    page.locator(".shop-detail").getByRole("button", { name: "Out of stock" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Publish review" }),
  ).toHaveCount(0);
  await page.goto("/store/product/refractor");
  await page
    .getByRole("button", { name: "Add to cart", exact: true })
    .first()
    .click();
  await page.goto("/store/cart");
  await page.getByLabel("Voucher code", { exact: true }).fill("SKY10");
  await page.getByRole("button", { name: "Apply", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("expired");
});

test("desktop and mobile themes, RTL, accessibility, chat and screenshots", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/store");
    for (const language of ["en", "fa"]) {
      if ((await page.locator("html").getAttribute("lang")) !== language)
        await page.locator(".language-button").click();
      await page
        .locator(".theme-control select")
        .selectOption(language === "en" ? "light" : "dark");
      await expect(page.locator("html")).toHaveAttribute(
        "dir",
        language === "fa" ? "rtl" : "ltr",
      );
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        language === "en" ? "light" : "dark",
      );
      await page.evaluate(async () => {
        await Promise.allSettled(
          document.getAnimations().map((animation) => animation.finished),
        );
      });
      await expect(
        page.locator(".shop-filter-panel > .shop-text-link"),
      ).toHaveCSS(
        "color",
        language === "en" ? "rgb(132, 96, 46)" : "rgb(228, 182, 120)",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      ).toEqual([]);
      await page.locator("#shop-main").focus();
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      const controls = page
        .locator(".shop-product")
        .first()
        .locator(".shop-gallery-controls");
      const bounds = await controls.boundingBox();
      const gallery = await page
        .locator(".shop-product")
        .first()
        .locator(".shop-gallery")
        .boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(gallery!.x);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
        gallery!.x + gallery!.width,
      );
      await page.screenshot({
        path: `artifacts/store-${language}-${width}.png`,
        fullPage: true,
      });
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".language-button").click();
  await page.getByRole("button", { name: "Open chat" }).click();
  await page
    .getByLabel("Your message", { exact: true })
    .fill("Help me choose a telescope");
  await page.getByRole("button", { name: "Preview message" }).click();
  await expect(page.getByRole("log")).toContainText("Preview only · not sent");
  await page
    .getByRole("button", { name: "Customer support", exact: true })
    .click();
  await page
    .getByLabel("Your message", { exact: true })
    .fill("Help with a return");
  await page.getByRole("button", { name: "Preview message" }).click();
  await expect(page.getByRole("log")).toContainText("Help with a return");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open chat" })).toBeFocused();
  expect(errors).toEqual([]);
});
