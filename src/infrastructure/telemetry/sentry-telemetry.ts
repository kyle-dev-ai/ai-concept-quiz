import type { Scope, ErrorEvent as SentryErrorEvent } from '@sentry/react'
import type { AppProfile } from '../../app/config/runtime-config'
import type { ProductEvent, Telemetry, TelemetryContext } from '../../application/ports/telemetry'
import { NoopTelemetry } from './basic-telemetry'
import type { DeferredTelemetry } from './deferred-telemetry'

interface SentryClient {
  readonly captureException: (error: unknown) => string
  readonly withScope: (callback: (scope: Scope) => void) => void
}

export interface SentryRuntimeOptions {
  readonly dsn: string
  readonly profile: AppProfile
  readonly release: string
}

function sanitizeFilename(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined
  }

  const queryIndex = value.indexOf('?')
  const hashIndex = value.indexOf('#')
  const end = [queryIndex, hashIndex]
    .filter((index) => index >= 0)
    .reduce((minimum, index) => Math.min(minimum, index), value.length)
  return value.slice(0, end)
}

function sanitizeArea(value: string): string {
  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .slice(0, 48)
  return sanitized.length > 0 ? sanitized : 'unknown'
}

export function scrubSentryEvent(event: SentryErrorEvent): SentryErrorEvent {
  return {
    ...event,
    breadcrumbs: undefined,
    contexts: undefined,
    extra: undefined,
    logentry: undefined,
    message: undefined,
    request: undefined,
    transaction: undefined,
    user: undefined,
    tags: event.tags?.area === undefined ? undefined : { area: event.tags.area },
    exception:
      event.exception === undefined
        ? undefined
        : {
            ...event.exception,
            values: event.exception.values?.map((exception) => ({
              ...exception,
              value:
                exception.type === undefined ? 'Captured exception' : `Captured ${exception.type}`,
              stacktrace:
                exception.stacktrace === undefined
                  ? undefined
                  : {
                      ...exception.stacktrace,
                      frames: exception.stacktrace.frames?.map((frame) => ({
                        ...frame,
                        abs_path: sanitizeFilename(frame.abs_path),
                        filename: sanitizeFilename(frame.filename),
                      })),
                    },
            })),
          },
  }
}

export class SentryTelemetry implements Telemetry {
  private readonly client: SentryClient

  public constructor(client: SentryClient) {
    this.client = client
  }

  public track(_event: ProductEvent): void {}

  public captureException(error: unknown, context: TelemetryContext): void {
    this.client.withScope((scope) => {
      scope.setTag('area', sanitizeArea(context.area))
      this.client.captureException(error)
    })
  }
}

export async function connectSentryTelemetry(
  telemetry: DeferredTelemetry,
  options: SentryRuntimeOptions,
): Promise<void> {
  try {
    const sentry = await import('@sentry/react')
    sentry.init({
      dsn: options.dsn,
      enabled: true,
      environment: options.profile,
      release: options.release,
      sendDefaultPii: false,
      tracesSampleRate: 0,
      maxBreadcrumbs: 0,
      beforeSend: scrubSentryEvent,
    })
    telemetry.attach(new SentryTelemetry(sentry))
  } catch {
    console.error('[attention:monitoring] Sentry 초기화에 실패했습니다.')
    telemetry.attach(new NoopTelemetry())
  }
}
