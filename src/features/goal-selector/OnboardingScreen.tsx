import { useState } from 'react'
import { type LearningGoalId, learningGoals } from '../../domain/learning/goal'
import {
  createNickname,
  type LearnerGroupId,
  type LearnerProfile,
  learnerGroups,
} from '../../domain/learning/learner-profile'

export interface OnboardingValue {
  readonly nickname: string
  readonly groupId: LearnerGroupId
  readonly learningGoalId: LearningGoalId
  readonly goalNote: string
}

interface OnboardingScreenProps {
  readonly initialProfile?: LearnerProfile
  readonly onComplete: (value: OnboardingValue) => void | Promise<void>
  readonly onCancel?: () => void
}

const defaultGoalByGroup: Record<LearnerGroupId, LearningGoalId> = {
  'teen-student': 'ai-basics',
  'university-student': 'ai-basics',
  'graduate-learner': 'graduate-school',
  'career-switcher': 'career-switch',
  professional: 'ai-practice',
  general: 'ai-basics',
}

export function OnboardingScreen({ initialProfile, onComplete, onCancel }: OnboardingScreenProps) {
  const [groupId, setGroupId] = useState<LearnerGroupId | null>(initialProfile?.groupId ?? null)
  const [goalId, setGoalId] = useState<LearningGoalId>(
    initialProfile?.learningGoalId ?? 'ai-basics',
  )
  const [goalNote, setGoalNote] = useState(initialProfile?.goalNote ?? '')
  const [nickname, setNickname] = useState(initialProfile?.nickname ?? createNickname())
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)

  function selectGroup(nextGroupId: LearnerGroupId) {
    setGroupId(nextGroupId)
    if (initialProfile === undefined) {
      setGoalId(defaultGoalByGroup[nextGroupId])
    }
  }

  async function submit(value: OnboardingValue) {
    setIsSaving(true)
    setSaveError(false)
    try {
      await onComplete(value)
    } catch {
      setSaveError(true)
    } finally {
      setIsSaving(false)
    }
  }

  function complete() {
    if (groupId === null) {
      return
    }

    void submit({ nickname, groupId, learningGoalId: goalId, goalNote })
  }

  function skip() {
    void submit({ nickname, groupId: 'general', learningGoalId: 'ai-basics', goalNote: '' })
  }

  return (
    <main className="onboarding" data-engaged={groupId !== null}>
      <div className="onboarding__topline">
        <span className="brand-mark" aria-hidden="true">
          A!
        </span>
        <span className="eyebrow">내 질문 덱 만들기</span>
      </div>

      <header className="onboarding__header">
        <h1 className="onboarding__watermark">
          What are you <br />
          working toward?
        </h1>
        <div className="onboarding__signal" data-active={groupId !== null} aria-hidden="true">
          <div>
            <i />
            <b />
            <i />
            <b />
            <i />
          </div>
          <span>{groupId === null ? 'FIND YOUR START' : 'START FOUND'}</span>
        </div>
      </header>

      <fieldset className="onboarding__section">
        <legend>지금 나는</legend>
        <div className="choice-grid">
          {learnerGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              className="choice-card"
              data-selected={groupId === group.id}
              aria-pressed={groupId === group.id}
              onClick={() => selectGroup(group.id)}
            >
              <strong>{group.label}</strong>
              <span>{group.description}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="onboarding__section">
        <legend>가장 가까운 목표</legend>
        <div className="goal-choice-list">
          {learningGoals.map((goal) => (
            <button
              key={goal.id}
              type="button"
              className="goal-choice"
              data-selected={goalId === goal.id}
              aria-pressed={goalId === goal.id}
              onClick={() => setGoalId(goal.id)}
            >
              <span>{goal.label}</span>
              <small>{goal.description}</small>
            </button>
          ))}
        </div>
      </fieldset>

      <label className="text-field" htmlFor="goal-note">
        <span>
          내 목표 한 줄 <small>선택</small>
        </span>
        <input
          id="goal-note"
          value={goalNote}
          maxLength={60}
          placeholder="예: 11월 구술에서 Attention을 설명하고 싶어요"
          onChange={(event) => setGoalNote(event.target.value)}
        />
        <small>{goalNote.length}/60</small>
      </label>

      <div className="nickname-card">
        <div>
          <span>오늘의 학습 이름</span>
          <strong>{nickname}</strong>
        </div>
        <button type="button" className="text-button" onClick={() => setNickname(createNickname())}>
          다시 뽑기
        </button>
      </div>

      <div className="onboarding__actions">
        <button
          type="button"
          className="button button--primary button--large"
          disabled={groupId === null || isSaving}
          onClick={complete}
        >
          {isSaving
            ? '저장 중…'
            : initialProfile === undefined
              ? '저장하고 시작하기'
              : '변경사항 저장'}
        </button>
        {saveError ? (
          <small className="onboarding__save-error" role="alert">
            저장하지 못했어요. 잠시 후 다시 눌러주세요.
          </small>
        ) : null}
        {onCancel === undefined ? (
          <button type="button" className="text-button" disabled={isSaving} onClick={skip}>
            일단 둘러보기
          </button>
        ) : (
          <button type="button" className="text-button" disabled={isSaving} onClick={onCancel}>
            취소
          </button>
        )}
      </div>
    </main>
  )
}
