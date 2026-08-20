import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CountUpNumber } from './CountUpNumber'

function setReducedMotion(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  })
}

afterEach(() => {
  Reflect.deleteProperty(window as unknown as Record<string, unknown>, 'matchMedia')
})

describe('CountUpNumber', () => {
  it('목표 숫자까지 올라간 뒤 멈춘다', async () => {
    setReducedMotion(false)
    render(
      <span data-testid="score">
        <CountUpNumber value={42} durationMs={30} />
      </span>,
    )

    await waitFor(() => expect(screen.getByTestId('score')).toHaveTextContent('42'))
  })

  it('움직임을 줄이는 설정이면 곧바로 목표 숫자를 보여준다', () => {
    setReducedMotion(true)
    render(
      <span data-testid="score">
        <CountUpNumber value={42} />
      </span>,
    )

    expect(screen.getByTestId('score')).toHaveTextContent('42')
  })

  it('0점은 애니메이션 없이 그대로 둔다', () => {
    setReducedMotion(false)
    render(
      <span data-testid="score">
        <CountUpNumber value={0} />
      </span>,
    )

    expect(screen.getByTestId('score')).toHaveTextContent('0')
  })
})
