import { type PointerEvent as ReactPointerEvent, useRef, useState } from 'react'

export type AppTab = 'learn' | 'library' | 'progress' | 'profile'

interface BottomNavigationProps {
  readonly activeTab: AppTab
  readonly onChange: (tab: AppTab) => void
}

const tabs: readonly { id: AppTab; label: string }[] = [
  { id: 'learn', label: '학습' },
  { id: 'library', label: '용어집' },
  { id: 'progress', label: '기록' },
  { id: 'profile', label: '프로필' },
]

const dragThreshold = 8

function dragPositionAt(clientX: number, navigation: HTMLElement): number {
  const bounds = navigation.getBoundingClientRect()
  const horizontalPadding = 7
  const usableWidth = Math.max(1, bounds.width - horizontalPadding * 2)
  const itemWidth = usableWidth / tabs.length
  const position = (clientX - bounds.left - horizontalPadding) / itemWidth - 0.5
  return Math.min(tabs.length - 1, Math.max(0, position))
}

function tabAtPosition(clientX: number, navigation: HTMLElement): AppTab {
  const index = Math.round(dragPositionAt(clientX, navigation))
  return tabs[index]?.id ?? 'learn'
}

function NavigationIcon({ tab }: { readonly tab: AppTab }) {
  if (tab === 'learn') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" />
      </svg>
    )
  }

  if (tab === 'library') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 5.5h5a3 3 0 0 1 3 3v10a3 3 0 0 0-3-3H4zM20 5.5h-5a3 3 0 0 0-3 3v10a3 3 0 0 1 3-3h5z" />
      </svg>
    )
  }

  if (tab === 'progress') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M5 18v-5M12 18V9M19 18V5M4 20h16" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  )
}

export function BottomNavigation({ activeTab, onChange }: BottomNavigationProps) {
  const [previewTab, setPreviewTab] = useState<AppTab | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const activePointer = useRef<number | null>(null)
  const didDrag = useRef(false)
  const dragStartX = useRef(0)
  const previousDragPosition = useRef(tabs.findIndex((tab) => tab.id === activeTab))
  const lastDragEndedAt = useRef(0)

  function beginDrag(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    activePointer.current = event.pointerId
    didDrag.current = false
    dragStartX.current = event.clientX
    previousDragPosition.current = tabs.findIndex((tab) => tab.id === activeTab)
    setPreviewTab(activeTab)
  }

  function previewDrag(event: ReactPointerEvent<HTMLElement>) {
    if (activePointer.current !== event.pointerId) {
      return
    }

    if (!didDrag.current && Math.abs(event.clientX - dragStartX.current) < dragThreshold) {
      return
    }

    if (!didDrag.current) {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }

    const position = dragPositionAt(event.clientX, event.currentTarget)
    const delta = position - previousDragPosition.current
    didDrag.current = true
    previousDragPosition.current = position
    event.currentTarget.style.setProperty('--dock-drag-position', position.toFixed(3))
    event.currentTarget.style.setProperty(
      '--dock-drag-stretch',
      Math.min(1.1, 1 + Math.abs(delta) * 0.065).toFixed(3),
    )
    setIsDragging(true)
    setPreviewTab(tabAtPosition(event.clientX, event.currentTarget))
  }

  function finishDrag(event: ReactPointerEvent<HTMLElement>) {
    if (activePointer.current !== event.pointerId) {
      return
    }

    const nextTab = tabAtPosition(event.clientX, event.currentTarget)
    activePointer.current = null
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture?.(event.pointerId)
    }

    if (didDrag.current) {
      event.preventDefault()
      lastDragEndedAt.current = Date.now()
      onChange(nextTab)
    }

    didDrag.current = false
    event.currentTarget.style.removeProperty('--dock-drag-position')
    event.currentTarget.style.removeProperty('--dock-drag-stretch')
    setPreviewTab(null)
    setIsDragging(false)
  }

  function cancelDrag(event: ReactPointerEvent<HTMLElement>) {
    activePointer.current = null
    didDrag.current = false
    event.currentTarget.style.removeProperty('--dock-drag-position')
    event.currentTarget.style.removeProperty('--dock-drag-stretch')
    setPreviewTab(null)
    setIsDragging(false)
  }

  function selectFromClick(tab: AppTab) {
    if (Date.now() - lastDragEndedAt.current < 350) {
      return
    }
    onChange(tab)
  }

  return (
    <nav
      className="bottom-navigation"
      data-active-tab={activeTab}
      data-preview-tab={previewTab ?? undefined}
      data-dragging={isDragging}
      aria-label="주요 화면"
      onPointerDown={beginDrag}
      onPointerMove={previewDrag}
      onPointerUp={finishDrag}
      onPointerCancel={cancelDrag}
    >
      <span className="bottom-navigation__indicator" aria-hidden="true" />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className="bottom-navigation__item"
          data-active={activeTab === tab.id}
          data-preview={isDragging && previewTab === tab.id}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          onClick={() => selectFromClick(tab.id)}
        >
          <span className="bottom-navigation__icon" aria-hidden="true">
            <NavigationIcon tab={tab.id} />
          </span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
