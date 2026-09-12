import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
test("scroll frame and layout-shift probe", async ({ page }) => {
  test.skip(
    !process.env.PERF_PROBE,
    "Opt-in local comparison, not a hardware-independent benchmark.",
  );
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator("img").all()) {
    await image.evaluate((e) => e.scrollIntoView({ behavior: "instant" }));
    await expect(image).toHaveJSProperty("complete", true);
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  const client = await page.context().newCDPSession(page);
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const result = await page.evaluate(async () => {
    let cls = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        };
        if (!shift.hadRecentInput) cls += shift.value;
      }
    });
    observer.observe({ type: "layout-shift" });
    const frames: number[] = [];
    let previous = performance.now();
    const distance = document.documentElement.scrollHeight - innerHeight;
    for (let i = 0; i <= 150; i++) {
      await new Promise<void>((resolve) =>
        requestAnimationFrame((time) => {
          frames.push(time - previous);
          previous = time;
          scrollTo({ top: (distance * i) / 150, behavior: "instant" });
          resolve();
        }),
      );
    }
    observer.disconnect();
    const samples = frames.slice(2).sort((a, b) => a - b);
    return {
      frames: samples.length,
      p95FrameMs: samples[Math.floor(samples.length * 0.95)],
      framesOver50ms: samples.filter((n) => n > 50).length,
      scrollCLS: cls,
    };
  });
  await mkdir("artifacts", { recursive: true });
  await writeFile(
    `artifacts/performance-${process.env.PERF_PROBE}.json`,
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(result);
  expect(result.scrollCLS).toBeLessThan(0.01);
});
