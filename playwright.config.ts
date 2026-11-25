import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const authFile = path.join(__dirname, "playwright/.auth/user.json");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.UI_BASE_URL || "https://saucedemo.com",
    trace: "on-first-retry",
  },
  projects: [
    // 1. Setup project: Logs in once and writes user.json
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    // 2. Authenticated UI suites: Starts already logged in on /inventory.html
    {
      name: "chromium-authenticated",
      use: {
        ...devices["Desktop Chrome"],
        storageState: authFile,
      },
      dependencies: ["setup"],
      testMatch: [
        "**/inventory.spec.ts",
        "**/checkout.spec.ts",
        "**/network.spec.ts",
      ],
    },

    // 3. Unauthenticated & API suites: Starts with clean browser state
    {
      name: "chromium-unauthenticated",
      use: {
        ...devices["Desktop Chrome"],
      },
      testMatch: ["**/login.spec.ts", "**/api-booking.spec.ts"],
    },
  ],
});
