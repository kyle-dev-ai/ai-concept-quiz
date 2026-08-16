import { useState } from 'react'
import { type LearningGoalId, learningGoals } from '../../domain/learning/goal'

interface GoalSelectorProps {
  readonly selectedGoal: LearningGoalId
  readonly onChange: (goalId: LearningGoalId) => Promise<void>
}

export function GoalSelector({ selectedGoal, onChange }: GoalSelectorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)

  async function change(goalId: LearningGoalId) {
    if (isSaving || goalId === selectedGoal) {
      return
    }

    setIsSaving(true)
    setSaveError(false)
    try {
      await onChange(goalId)
    } catch {
      setSaveError(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="goal-selector-shell">
      <fieldset className="goal-selector" disabled={isSaving} aria-busy={isSaving}>
        <legend className="sr-only">학습 목표</legend>
        {learningGoals.map((goal) => (
          <label
            key={goal.id}
            className="goal-selector__item"
            data-selected={selectedGoal === goal.id}
          >
            <input
              type="radio"
              name="learning-goal"
              value={goal.id}
              checked={selectedGoal === goal.id}
              onChange={() => void change(goal.id)}
            />
            <span>{goal.shortLabel}</span>
          </label>
        ))}
      </fieldset>
      {saveError ? (
        <small className="goal-selector__error" role="alert">
          목표를 저장하지 못했어요. 다시 선택해주세요.
        </small>
      ) : null}
    </div>
  )
}
