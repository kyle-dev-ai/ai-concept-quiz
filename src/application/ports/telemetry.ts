export type ProductEvent =
  | {
      readonly name: 'goal_selected'
      readonly goalId: string
    }
  | {
      readonly name: 'study_started'
      readonly scope: string
      readonly questionCount: number
    }
  | {
      readonly name: 'answer_revealed'
      readonly questionId: string
    }
  | {
      readonly name: 'review_recorded'
      readonly questionId: string
      readonly rating: string
    }
  | {
      readonly name: 'challenge_shared'
      readonly questionId: string
      readonly method: string
    }

export interface TelemetryContext {
  readonly area: string
  readonly operation?: string
}

export interface Telemetry {
  track(event: ProductEvent): void
  captureException(error: unknown, context: TelemetryContext): void
}
