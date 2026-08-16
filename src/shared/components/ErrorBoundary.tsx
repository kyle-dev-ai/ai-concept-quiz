import { Component, type ErrorInfo, type ReactNode } from 'react'
import type { Telemetry } from '../../application/ports/telemetry'

interface ErrorBoundaryProps {
  readonly children: ReactNode
  readonly telemetry: Telemetry
}

interface ErrorBoundaryState {
  readonly hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.telemetry.captureException(error, {
      area: 'react-error-boundary',
      operation: errorInfo.componentStack ?? undefined,
    })
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="fatal-error">
          <span className="eyebrow">잠시 멈췄어요</span>
          <h1>학습 화면을 다시 불러와주세요.</h1>
          <p>저장된 진도는 그대로 유지돼요.</p>
          <button
            type="button"
            className="button button--primary"
            onClick={() => location.reload()}
          >
            다시 불러오기
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
