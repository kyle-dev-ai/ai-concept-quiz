import { useState } from 'react'
import type { AnswerMode } from '../../domain/preferences/answer-mode'

interface AnswerModeToggleProps {
  readonly mode: AnswerMode
  readonly onChange: (mode: AnswerMode) => Promise<void>
}

/**
 * 기본 답변 방식을 고르는 스위치.
 * 학습 중에도 바꿀 수 있지만, 자주 있는 자리를 기본값으로 두면 매번 고르지 않아도 된다.
 */
export function AnswerModeToggle({ mode, onChange }: AnswerModeToggleProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)
  const isSilent = mode === 'silent'

  async function toggle() {
    if (isSaving) {
      return
    }

    setIsSaving(true)
    setHasError(false)
    try {
      await onChange(isSilent ? 'spoken' : 'silent')
    } catch {
      setHasError(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="sound-toggle">
      <div className="sound-toggle__copy">
        <strong>무음 모드</strong>
        <span>마이크를 켜지 않고 핵심 키워드를 적어요. 지하철이나 사무실에서 쓰세요.</span>
        {hasError ? (
          <small role="alert" className="sound-toggle__error">
            설정을 저장하지 못했어요. 다시 눌러주세요.
          </small>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isSilent}
        aria-label="무음 모드"
        className="switch"
        disabled={isSaving}
        onClick={() => void toggle()}
      >
        <span className="switch__track" aria-hidden="true">
          <span className="switch__thumb" />
        </span>
        <span className="switch__state">{isSilent ? '켜짐' : '꺼짐'}</span>
      </button>
    </div>
  )
}
