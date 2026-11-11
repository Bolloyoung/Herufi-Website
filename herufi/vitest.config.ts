import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // Tests never touch CSS. An inline PostCSS config stops Vite from loading the
  // project's postcss.config.js (Tailwind), which stalls vitest at startup.
  css: { postcss: { plugins: [] } },
  resolve: { alias: { '@': fileURLToPath(new URL('./', import.meta.url)) } },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
})
