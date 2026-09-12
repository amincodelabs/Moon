import { test, expect } from "@playwright/test";

test("sort icon stays centered and both price handles remain usable", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/store/category/telescopes");
    const sort = page.locator(".shop-sort-control");
    await sort.scrollIntoViewIfNeeded();
    const box = await sort.boundingBox();
    const icon = await sort.locator("svg").boundingBox();
    expect(
      Math.abs(box!.x + box!.width / 2 - icon!.x - icon!.width / 2),
    ).toBeLessThan(1);
    expect(
      Math.abs(box!.y + box!.height / 2 - icon!.y - icon!.height / 2),
    ).toBeLessThan(1);
    const sliders = page.locator(".shop-price-slider input");
    for (const index of [0, 1]) {
      const slider = sliders.nth(index);
      await slider.focus();
      await slider.press(index === 0 ? "End" : "Home");
      expect(Number(await slider.inputValue())).toBeGreaterThan(0);
      expect(
        await slider.evaluate(
          (el) =>
            getComputedStyle(el, "::-webkit-slider-runnable-track")
              .backgroundColor,
        ),
      ).toBe("rgba(0, 0, 0, 0)");
    }
    await sliders.nth(0).fill("0");
    await sliders.nth(1).fill("300000000");
    for (const index of [0, 1]) {
      const slider = sliders.nth(index);
      await slider.scrollIntoViewIfNeeded();
      const track = (await slider.boundingBox())!;
      const rtl = await slider.evaluate(
        (el) => getComputedStyle(el).direction === "rtl",
      );
      const startsLeft = (index === 0) !== rtl;
      const x = startsLeft ? track.x + 9 : track.x + track.width - 9;
      await page.mouse.move(x, track.y + track.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        x + (startsLeft ? 25 : -25),
        track.y + track.height / 2,
        { steps: 8 },
      );
      await page.mouse.up();
      expect(Number(await slider.inputValue())).not.toBe(
        index === 0 ? 0 : 300000000,
      );
    }
  }
});
