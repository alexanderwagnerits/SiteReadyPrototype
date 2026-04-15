// @ts-check
// Eigene Playwright-Config für Cross-Browser-Tests (Firefox + WebKit/Safari)
// Nutzung: npx playwright test --config=tests/multi-browser.config.js

const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./",
  testMatch: "multi-browser.spec.js",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3000",
    headless: true,
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 60000,
      },
});
