import { appMetadata } from '../../app/config/app-metadata'
import type { RuntimeConfig } from '../../app/config/runtime-config'
import type { Telemetry } from '../../application/ports/telemetry'
import { ConsoleTelemetry, NoopTelemetry } from './basic-telemetry'
import { DeferredTelemetry } from './deferred-telemetry'

export function createRuntimeTelemetry(config: RuntimeConfig): Telemetry {
  if (config.profile === 'local') {
    return new ConsoleTelemetry()
  }

  if (config.sentryDsn === null) {
    return new NoopTelemetry()
  }

  const telemetry = new DeferredTelemetry()
  void import('./sentry-telemetry')
    .then(({ connectSentryTelemetry }) =>
      connectSentryTelemetry(telemetry, {
        dsn: config.sentryDsn ?? '',
        profile: config.profile,
        release: `${appMetadata.packageName}@${appMetadata.version}`,
      }),
    )
    .catch(() => {
      console.error('[attention:monitoring] Sentry adapter를 불러오지 못했습니다.')
      telemetry.attach(new NoopTelemetry())
    })

  return telemetry
}
