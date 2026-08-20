import { useState } from 'react'
import type { SoundPreference } from '../../domain/preferences/sound'

interface SoundToggleProps {
  readonly preference: SoundPreference
  readonly onChange: (preference: SoundPreference) => Promise<void>
}

/**
 * 카운트다운 소리를 켜고 끄는 스위치.
 * 도서관이나 카페에서 학습할 때 소리를 못 끄면 앱을 못 켠다.
 */
export function SoundToggle({ preference, onChange }: SoundToggleProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)
  const isOn = preference === 'on'

  async function toggle() {
    if (isSaving) {
      return
    }

    setIsSaving(true)
    setHasError(false)
    try {
      await onChange(isOn ? 'off' : 'on')
    } catch {
      setHasError(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="sound-toggle">
      <div className="sound-toggle__copy">
        <strong>카운트다운 소리</strong>
        <span>답이 열리기 전 마지막 초를 소리로 알려줘요.</span>
        {hasError ? (
          <small role="alert" className="sound-toggle__error">
            설정을 저장하지 못했어요. 다시 눌러주세요.
          </small>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label="카운트다운 소리"
        className="switch"
        disabled={isSaving}
        onClick={() => void toggle()}
      >
        <span className="switch__track" aria-hidden="true">
          <span className="switch__thumb" />
        </span>
        <span className="switch__state">{isOn ? '켜짐' : '꺼짐'}</span>
      </button>
    </div>
  )
}
