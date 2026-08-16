import { createRequire } from 'node:module'
import aitDevtools from '@apps-in-toss/devtools/unplugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const require = createRequire(import.meta.url)
const packageJson = require('./package.json') as { version: string }

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isStandalone = mode === 'standalone'

  return {
    plugins: [
      aitDevtools.vite(),
      react(),
      VitePWA({
        disable: !isStandalone,
        registerType: 'autoUpdate',
        injectRegister: 'script-defer',
        includeAssets: ['app-icon.svg'],
        manifest: {
          name: '어텐션! AI 개념 퀴즈',
          short_name: '어텐션!',
          description: 'AI 개념을 구술 질문으로 설명하고 복습하는 로컬 우선 학습 앱',
          theme_color: '#2457f5',
          background_color: '#f4f7fc',
          display: 'standalone',
          orientation: 'portrait',
          lang: 'ko-KR',
          icons: [
            {
              src: '/app-icon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          navigateFallback: '/index.html',
          cleanupOutdatedCaches: true,
        },
      }),
    ],
    build: {
      outDir: isStandalone ? 'dist-standalone' : 'dist',
    },
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
  }
})
