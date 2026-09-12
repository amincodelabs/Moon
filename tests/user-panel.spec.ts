import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-09-12T12:00:00Z"));
  await page.goto("/");
  await page
    .getByRole("button", { name: "ورود / ثبت‌نام", exact: true })
    .click();
  await page.getByRole("button", { name: "ورود به حساب نمایشی" }).click();
  await page.getByRole("button", { name: "حساب کاربری", exact: true }).click();
});

test("authenticated account opens a useful dashboard", async ({ page }) => {
  await expect(page.getByRole("dialog")).toContainText(
    "خوش آمدید، کاوشگر آسمان",
  );
  await expect(page.getByRole("dialog")).toContainText("سکه آوااستار");
  await expect(page.getByRole("dialog")).toContainText("سفارش #AV-1048");
  await expect(
    page.getByRole("button", { name: "سفارش‌های من" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "علاقه‌مندی‌ها" }),
  ).toBeVisible();
});

test("account tabs switch content without losing dialog focus", async ({
  page,
}) => {
  const dialog = page.getByRole("dialog");
  await page.getByRole("button", { name: "علاقه‌مندی‌ها" }).click();
  await expect(dialog).toContainText("ذخیره‌شده برای بعد");
  await page.getByRole("button", { name: "آدرس‌ها" }).click();
  await expect(dialog).toContainText("آدرس‌ها");
  await page.getByRole("button", { name: "پروفایل من" }).click();
  await expect(dialog).toContainText("زبان و نمایش را هر زمان تغییر دهید");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("account preferences change language and theme in place", async ({
  page,
}) => {
  await page.getByRole("button", { name: "پروفایل من" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("combobox", { name: "زبان" }).selectOption("en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(dialog).toContainText("Account settings");
  await dialog.getByRole("combobox", { name: "Theme" }).selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(dialog).toContainText("Sky explorer");
});

test("dashboard remains keyboard accessible", async ({ page }) => {
  const dialog = page.getByRole("dialog");
  await page.getByRole("button", { name: "نمای کلی" }).focus();
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await expect(
    page.getByRole("button", { name: "خروج از حساب نمایشی" }),
  ).toBeVisible();
});
