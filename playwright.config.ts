import { defineConfig, devices } from '@playwright/test';

// The app lives under a sub-path. Keep a trailing slash so relative navigations (`./`) stay
// inside it; `goto('/')` would resolve to the host root, which is a 404 on demo.playwright.dev.
const withSlash = (url: string) => (url.endsWith('/') ? url : `${url}/`);
const UI_BASE_URL = withSlash(process.env.UI_BASE_URL ?? 'https://demo.playwright.dev/todomvc/');
const API_BASE_URL = process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: UI_BASE_URL },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_BASE_URL, extraHTTPHeaders: { Accept: 'application/json' } },
    },
  ],
});
