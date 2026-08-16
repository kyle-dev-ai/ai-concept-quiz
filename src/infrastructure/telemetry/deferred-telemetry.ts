import type { ProductEvent, Telemetry, TelemetryContext } from '../../application/ports/telemetry'

interface PendingException {
  readonly error: unknown
  readonly context: TelemetryContext
}

const maximumPendingExceptions = 10

export class DeferredTelemetry implements Telemetry {
  private delegate: Telemetry | null = null
  private pendingExceptions: PendingException[] = []

  public track(event: ProductEvent): void {
    this.delegate?.track(event)
  }

  public captureException(error: unknown, context: TelemetryContext): void {
    if (this.delegate !== null) {
      this.delegate.captureException(error, context)
      return
    }

    this.pendingExceptions = [...this.pendingExceptions, { error, context }].slice(
      -maximumPendingExceptions,
    )
  }

  public attach(delegate: Telemetry): void {
    if (this.delegate !== null) {
      return
    }

    this.delegate = delegate
    const pending = this.pendingExceptions
    this.pendingExceptions = []
    for (const item of pending) {
      delegate.captureException(item.error, item.context)
    }
  }
}
