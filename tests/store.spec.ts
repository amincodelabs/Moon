import { test, expect } from "@playwright/test";

test("store is a separate page reached from the landing page", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "کاوش در فروشگاه" }).click();
  await expect(page).toHaveURL(/\/store$/);
  await expect(
    page.getByRole("heading", { name: "کاوش در فروشگاه" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "سبد خرید" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
