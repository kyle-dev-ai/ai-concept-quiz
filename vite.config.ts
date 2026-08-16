import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import aitDevtools from '@apps-in-toss/devtools/unplugin'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { createContentSecurityPolicy } from './src/app/config/content-security-policy.js'

const require = createRequire(import.meta.url)
const packageJson = require('./package.json') as { version: string }

function securityPolicyPlugin(mode: string): Plugin {
  return {
    name: 'attention-security-policy',
    transformIndexHtml() {
      if (mode !== 'production' && mode !== 'standalone') {
        return []
      }

      const environment = loadEnv(mode, process.cwd(), '')
      return [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: createContentSecurityPolicy(environment.VITE_SENTRY_DSN),
          },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isStandalone = mode === 'standalone'
  const platformStoragePath = fileURLToPath(
    new URL(
      mode === 'production'
        ? './src/infrastructure/storage/toss-key-value-store.ts'
        : './src/infrastructure/storage/browser-key-value-store.ts',
      import.meta.url,
    ),
  )

  return {
    plugins: [
      securityPolicyPlugin(mode),
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
          globPatterns: ['**/*.{js,css,html,json,svg}'],
          globIgnores: ['**/monitoring-sentry-*.js', '**/sentry-telemetry-*.js'],
        },
      }),
    ],
    resolve: {
      alias: {
        '#platform-key-value-store': platformStoragePath,
      },
    },
    build: {
      outDir: isStandalone ? 'dist-standalone' : 'dist',
      rollupOptions: {
        output: {
          chunkFileNames(chunkInfo) {
            const containsSentry = chunkInfo.moduleIds.some((id) =>
              id.includes('/node_modules/@sentry/'),
            )
            return containsSentry ? 'assets/monitoring-sentry-[hash].js' : 'assets/[name]-[hash].js'
          },
        },
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
  }
})
