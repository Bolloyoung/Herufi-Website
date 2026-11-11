import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Integration tests run against real services started by
// deploy/listmonk/docker-compose.dev.yml (Postgres, Listmonk, Mailpit).
// They never use production credentials and never send real email.
export default defineConfig({
  // Tests never touch CSS. An inline PostCSS config stops Vite from loading the
  // project's postcss.config.js (Tailwind), which stalls vitest at startup.
  css: { postcss: { plugins: [] } },
  resolve: { alias: { '@': fileURLToPath(new URL('./', import.meta.url)) } },
  test: {
    include: ['tests/integration/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
})
