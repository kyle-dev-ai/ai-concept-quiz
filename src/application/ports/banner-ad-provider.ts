export const adPlacements = [
  'learn-home-inline',
  'library-inline-banner',
  'progress-inline-banner',
  'profile-inline-banner',
  'study-bottom-banner',
  'session-complete',
] as const

export type AdPlacement = (typeof adPlacements)[number]

export interface BannerAdAttachment {
  readonly placement: AdPlacement
  readonly target: HTMLElement
  readonly onRendered: () => void
  readonly onUnavailable: (reason?: unknown) => void
}

export interface BannerAdProvider {
  attach(attachment: BannerAdAttachment): () => void
}
