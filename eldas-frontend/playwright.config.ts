import { defineConfig } from "@playwright/test";

const frontendPort = 4173;
const backendPort = 8001;

export default defineConfig({
  testDir: "./e2e",
  timeout: 180_000,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: `http://127.0.0.1:${frontendPort}`,
    browserName: "chromium",
    channel: process.env.PLAYWRIGHT_CHANNEL ?? "msedge",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  webServer: [
    {
      command: "powershell -NoLogo -NoProfile -ExecutionPolicy Bypass -File scripts\\run_e2e_backend.ps1",
      cwd: "..",
      url: `http://127.0.0.1:${backendPort}/health`,
      timeout: 120_000,
      reuseExistingServer: false,
    },
    {
      command: "npm run e2e:web",
      url: `http://127.0.0.1:${frontendPort}`,
      timeout: 180_000,
      reuseExistingServer: false,
    },
  ],
});
