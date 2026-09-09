import { defineConfig } from '@playwright/test';

const port = Number(process.env.PREVIEW_PORT || 4173);

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: `http://localhost:${port}`,
  },
  webServer: {
    command: `node node_modules/vite/bin/vite.js preview --port ${port} --strictPort`,
    port,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
