import type { ChallengeShare } from '../application/ports/challenge-share'
import type { ProfileRepository } from '../application/ports/profile-repository'
import type { ProgressRepository } from '../application/ports/progress-repository'
import type { QuestionRepository } from '../application/ports/question-repository'
import type { Telemetry } from '../application/ports/telemetry'
import { StaticQuestionRepository } from '../content/static-question-repository'
import { BrowserChallengeShare } from '../shared/storage/browser-challenge-share'
import { createKeyValueStore } from '../shared/storage/key-value-stores'
import { LocalProfileRepository } from '../shared/storage/local-profile-repository'
import { LocalProgressRepository } from '../shared/storage/local-progress-repository'
import { ConsoleTelemetry, NoopTelemetry } from '../shared/storage/telemetry-adapters'
import { runtimeConfig } from './config/runtime-config'

export interface AppDependencies {
  readonly questions: QuestionRepository
  readonly profiles: ProfileRepository
  readonly progress: ProgressRepository
  readonly telemetry: Telemetry
  readonly challengeShare: ChallengeShare
}

export function createAppDependencies(): AppDependencies {
  const storage = createKeyValueStore(runtimeConfig.profile)

  return {
    questions: new StaticQuestionRepository(),
    profiles: new LocalProfileRepository(storage),
    progress: new LocalProgressRepository(storage),
    telemetry: runtimeConfig.profile === 'local' ? new ConsoleTelemetry() : new NoopTelemetry(),
    challengeShare: new BrowserChallengeShare(),
  }
}

export const appDependencies = createAppDependencies()
