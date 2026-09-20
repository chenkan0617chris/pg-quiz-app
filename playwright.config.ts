import { defineConfig, devices } from '@playwright/test';

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: externalBaseUrl ?? 'http://127.0.0.1:3100',
    ...devices['iPhone 13'],
    browserName: 'chromium',
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: 'npm run build && npm run start -- --hostname 127.0.0.1 --port 3100',
        url: 'http://127.0.0.1:3100/en/pipeline',
        reuseExistingServer: false,
        timeout: 120_000,
      },
});
