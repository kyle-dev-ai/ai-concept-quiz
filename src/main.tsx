import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { appDependencies } from './app/dependencies'
import { ErrorBoundary } from './shared/components/ErrorBoundary'

const rootElement = document.getElementById('root')

if (rootElement === null) {
  throw new Error('Root element를 찾을 수 없습니다.')
}

appDependencies.themeController.apply('light')

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary telemetry={appDependencies.telemetry}>
      <App dependencies={appDependencies} />
    </ErrorBoundary>
  </StrictMode>,
)
