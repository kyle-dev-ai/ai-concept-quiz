import { describe, expect, it, vi } from 'vitest'
import type { Telemetry } from '../../application/ports/telemetry'
import { DeferredTelemetry } from './deferred-telemetry'

function createTelemetrySpy(): Telemetry {
  return {
    track: vi.fn(),
    captureException: vi.fn(),
  }
}

describe('DeferredTelemetry', () => {
  it('adapter가 준비되기 전 exception을 bounded queue에 담아 재생한다', () => {
    const deferred = new DeferredTelemetry()
    const delegate = createTelemetrySpy()

    for (let index = 0; index < 12; index += 1) {
      deferred.captureException(new Error(`error-${index}`), {
        area: 'bootstrap',
        operation: 'load',
      })
    }
    deferred.attach(delegate)

    expect(delegate.captureException).toHaveBeenCalledTimes(10)
    expect(delegate.captureException).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ message: 'error-2' }),
      { area: 'bootstrap', operation: 'load' },
    )
  })

  it('product event를 원격 adapter가 붙기 전에는 보관하지 않는다', () => {
    const deferred = new DeferredTelemetry()
    const delegate = createTelemetrySpy()

    deferred.track({ name: 'answer_revealed', questionId: 'attention' })
    deferred.attach(delegate)

    expect(delegate.track).not.toHaveBeenCalled()
  })
})
