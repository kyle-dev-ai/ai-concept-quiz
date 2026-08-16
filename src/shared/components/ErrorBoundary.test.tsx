import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

function BrokenScreen(): never {
  throw new Error('render failed')
}

describe('ErrorBoundary', () => {
  it('예상하지 못한 render 오류를 기록하고 복구 화면을 보여준다', () => {
    const captureException = vi.fn()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(
      <ErrorBoundary telemetry={{ track: vi.fn(), captureException }}>
        <BrokenScreen />
      </ErrorBoundary>,
    )

    expect(
      screen.getByRole('heading', { name: '학습 화면을 다시 불러와주세요.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '다시 불러오기' })).toBeInTheDocument()
    expect(captureException).toHaveBeenCalledWith(expect.any(Error), {
      area: 'react-error-boundary',
      operation: 'render',
    })

    consoleError.mockRestore()
  })
})
