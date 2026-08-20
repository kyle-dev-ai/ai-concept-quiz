import { createPlatformKeyValueStore } from '#platform-key-value-store'
import type { AppBadge } from '../application/ports/app-badge'
import type { BannerAdProvider } from '../application/ports/banner-ad-provider'
import type { ChallengeShare } from '../application/ports/challenge-share'
import type { ProfileRepository } from '../application/ports/profile-repository'
import type { ProgressRepository } from '../application/ports/progress-repository'
import type { QuestionRepository } from '../application/ports/question-repository'
import type { SpeechRecognizer } from '../application/ports/speech-recognizer'
import type { Telemetry } from '../application/ports/telemetry'
import type { ThemeController } from '../application/ports/theme-controller'
import type { ThemePreferenceRepository } from '../application/ports/theme-preference-repository'
import { StaticQuestionRepository } from '../content/static-question-repository'
import { UnavailableBannerAdProvider } from '../infrastructure/ads/unavailable-banner-ad-provider'
import { BrowserAppBadge } from '../infrastructure/badge/browser-app-badge'
import { BrowserChallengeShare } from '../infrastructure/share/browser-challenge-share'
import { BrowserSpeechRecognizer } from '../infrastructure/speech/browser-speech-recognizer'
import { LocalProfileRepository } from '../infrastructure/storage/local-profile-repository'
import { LocalProgressRepository } from '../infrastructure/storage/local-progress-repository'
import { LocalThemePreferenceRepository } from '../infrastructure/storage/local-theme-preference-repository'
import { createRuntimeTelemetry } from '../infrastructure/telemetry/runtime-telemetry'
import { BrowserThemeController } from '../infrastructure/theme/browser-theme-controller'
import { runtimeConfig } from './config/runtime-config'

export interface AppDependencies {
  readonly questions: QuestionRepository
  readonly profiles: ProfileRepository
  readonly progress: ProgressRepository
  readonly themePreferences: ThemePreferenceRepository
  readonly themeController: ThemeController
  readonly telemetry: Telemetry
  readonly challengeShare: ChallengeShare
  readonly bannerAds: BannerAdProvider
  readonly speechRecognizer: SpeechRecognizer
  readonly appBadge: AppBadge
}

export function createAppDependencies(): AppDependencies {
  const storage = createPlatformKeyValueStore()

  return {
    questions: new StaticQuestionRepository(),
    profiles: new LocalProfileRepository(storage),
    progress: new LocalProgressRepository(storage),
    themePreferences: new LocalThemePreferenceRepository(storage),
    themeController: new BrowserThemeController(),
    telemetry: createRuntimeTelemetry(runtimeConfig),
    challengeShare: new BrowserChallengeShare(),
    bannerAds: new UnavailableBannerAdProvider(),
    speechRecognizer: new BrowserSpeechRecognizer(),
    appBadge: new BrowserAppBadge(),
  }
}

export const appDependencies = createAppDependencies()
