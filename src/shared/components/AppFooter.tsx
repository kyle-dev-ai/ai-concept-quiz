import { appMetadata } from '../../app/config/app-metadata'

export function AppFooter() {
  return (
    <footer className="app-footer">
      <span>{appMetadata.copyright}</span>
      <span aria-hidden="true">·</span>
      <span>v{appMetadata.version}</span>
    </footer>
  )
}
