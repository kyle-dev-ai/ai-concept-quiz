import type { ProductEvent, Telemetry, TelemetryContext } from '../../application/ports/telemetry'

export class ConsoleTelemetry implements Telemetry {
  public track(event: ProductEvent): void {
    console.info('[attention:event]', event)
  }

  public captureException(error: unknown, context: TelemetryContext): void {
    console.error('[attention:error]', { error, context })
  }
}

export class NoopTelemetry implements Telemetry {
  public track(_event: ProductEvent): void {}

  public captureException(_error: unknown, _context: TelemetryContext): void {}
}
