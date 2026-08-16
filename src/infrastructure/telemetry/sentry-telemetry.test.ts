import type { ErrorEvent as SentryErrorEvent } from '@sentry/react'
import { describe, expect, it, vi } from 'vitest'
import { SentryTelemetry, scrubSentryEvent } from './sentry-telemetry'

describe('SentryTelemetry', () => {
  it('user, request, free-text context와 URL query/hash를 제거한다', () => {
    const event: SentryErrorEvent = {
      type: undefined,
      message: '사용자 자유 입력',
      user: { email: 'private@example.com' },
      request: { url: 'https://example.com/study?goal=private#answer' },
      breadcrumbs: [{ message: 'clicked private value' }],
      contexts: { learner: { nickname: '비공개' } },
      extra: { storage: '{private}' },
      tags: { area: 'progress', private: 'remove-me' },
      exception: {
        values: [
          {
            type: 'StorageError',
            value: 'payload was private',
            stacktrace: {
              frames: [
                {
                  filename: 'https://example.com/assets/app.js?token=secret#frame',
                  abs_path: 'https://example.com/assets/app.js?token=secret',
                },
              ],
            },
          },
        ],
      },
    }

    expect(scrubSentryEvent(event)).toMatchObject({
      message: undefined,
      user: undefined,
      request: undefined,
      breadcrumbs: undefined,
      contexts: undefined,
      extra: undefined,
      tags: { area: 'progress' },
      exception: {
        values: [
          {
            value: 'Captured StorageError',
            stacktrace: {
              frames: [
                {
                  filename: 'https://example.com/assets/app.js',
                  abs_path: 'https://example.com/assets/app.js',
                },
              ],
            },
          },
        ],
      },
    })
  })

  it('고정된 area tag만 exception과 함께 전달한다', () => {
    const setTag = vi.fn()
    const captureException = vi.fn(() => 'event-id')
    const telemetry = new SentryTelemetry({
      captureException,
      withScope: (callback) => callback({ setTag } as never),
    })
    const error = new Error('storage failed')

    telemetry.captureException(error, { area: 'Progress Save', operation: 'private value' })

    expect(setTag).toHaveBeenCalledWith('area', 'progress-save')
    expect(captureException).toHaveBeenCalledWith(error)
  })
})
