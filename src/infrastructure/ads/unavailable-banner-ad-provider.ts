import type {
  BannerAdAttachment,
  BannerAdProvider,
} from '../../application/ports/banner-ad-provider'

export class UnavailableBannerAdProvider implements BannerAdProvider {
  public attach({ onUnavailable }: BannerAdAttachment): () => void {
    onUnavailable('banner provider is not configured')
    return () => undefined
  }
}
