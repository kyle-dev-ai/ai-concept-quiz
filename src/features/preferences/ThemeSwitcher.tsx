import { useEffect, useId, useRef, useState } from 'react'
import type { ThemePreference } from '../../domain/preferences/theme'

interface ThemeSwitcherProps {
  readonly preference: ThemePreference
  readonly disabled?: boolean
  readonly onChange: (preference: ThemePreference) => Promise<void>
}

const options: readonly {
  readonly id: ThemePreference
  readonly label: string
}[] = [
  { id: 'light', label: '라이트' },
  { id: 'dark', label: '다크' },
  { id: 'system', label: '기기 설정' },
]

function ThemeIcon({ preference }: { readonly preference: ThemePreference }) {
  if (preference === 'light') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4m10.6 10.6 1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
      </svg>
    )
  }

  if (preference === 'dark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 15.2A8.6 8.6 0 0 1 8.8 4a8.6 8.6 0 1 0 11.2 11.2Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="12" rx="2.5" />
      <path d="M9 20h6M12 17v3M12 5v12" />
    </svg>
  )
}

export function ThemeSwitcher({ preference, disabled = false, onChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const selectedLabel = options.find((option) => option.id === preference)?.label ?? '라이트'

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function closeFromOutside(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', closeFromOutside)
    document.addEventListener('keydown', closeWithEscape)
    return () => {
      document.removeEventListener('pointerdown', closeFromOutside)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [isOpen])

  async function select(nextPreference: ThemePreference) {
    if (nextPreference === preference) {
      setIsOpen(false)
      triggerRef.current?.focus()
      return
    }

    setIsSaving(true)
    setSaveError(false)
    try {
      await onChange(nextPreference)
      setIsOpen(false)
      triggerRef.current?.focus()
    } catch {
      setSaveError(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="theme-switcher" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="theme-switcher__trigger"
        disabled={disabled}
        aria-label={`화면 모드: ${selectedLabel}`}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <ThemeIcon preference={preference} />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          className="theme-switcher__menu"
          role="radiogroup"
          aria-label="화면 모드 선택"
        >
          <span>APPEARANCE</span>
          {options.map((option) => (
            <label
              key={option.id}
              className="theme-switcher__option"
              data-selected={preference === option.id}
            >
              <input
                type="radio"
                name={`${menuId}-theme`}
                value={option.id}
                checked={preference === option.id}
                disabled={isSaving}
                onClick={() => {
                  if (preference === option.id) {
                    setIsOpen(false)
                    triggerRef.current?.focus()
                  }
                }}
                onChange={() => void select(option.id)}
              />
              <ThemeIcon preference={option.id} />
              <span>{option.label}</span>
              <i aria-hidden="true" />
            </label>
          ))}
          {saveError ? <small role="alert">저장하지 못했어요. 다시 선택해주세요.</small> : null}
        </div>
      ) : null}
    </div>
  )
}
