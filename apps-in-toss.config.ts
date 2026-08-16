import { defineConfig } from '@apps-in-toss/web-framework/config'

// web-framework 3.x 기준: display name, app icon, webview type(partner)은 이 파일이 아니라
// Apps in Toss 콘솔에서 등록한다(2.x granite config의 brand.displayName/icon과
// webViewProps.type은 v3 마이그레이션에서 제거됨). appName은 콘솔에 등록한 ID와
// 정확히 일치해야 하며, 다르면 콘솔 등록 후 이 값을 맞춘다.
export default defineConfig({
  appName: 'ai-concept-quiz',
  brand: {
    primaryColor: '#2457F5',
  },
  permissions: [],
  webBundleDir: 'dist',
})
