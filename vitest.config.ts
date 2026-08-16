import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '#platform-key-value-store': fileURLToPath(
        new URL('./src/infrastructure/storage/browser-key-value-store.ts', import.meta.url),
      ),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0-test'),
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    clearMocks: true,
  },
})
