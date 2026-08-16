export type AppTab = 'learn' | 'library' | 'progress'

interface BottomNavigationProps {
  readonly activeTab: AppTab
  readonly onChange: (tab: AppTab) => void
}

const tabs: readonly { id: AppTab; label: string; icon: string }[] = [
  { id: 'learn', label: '학습', icon: '✦' },
  { id: 'library', label: '용어집', icon: '⌕' },
  { id: 'progress', label: '기록', icon: '↗' },
]

export function BottomNavigation({ activeTab, onChange }: BottomNavigationProps) {
  return (
    <nav className="bottom-navigation" aria-label="주요 화면">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className="bottom-navigation__item"
          data-active={activeTab === tab.id}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          onClick={() => onChange(tab.id)}
        >
          <span className="bottom-navigation__icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
