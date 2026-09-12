import { defineConfig } from "@playwright/test";
const production = process.env.TEST_PRODUCTION === "1";
const port = production ? 4173 : 5173;
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL,
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: production
      ? "npm run preview -- --port 4173"
      : "npm run dev -- --port 5173",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
