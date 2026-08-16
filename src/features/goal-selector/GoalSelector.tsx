import { type LearningGoalId, learningGoals } from '../../domain/learning/goal'

interface GoalSelectorProps {
  readonly selectedGoal: LearningGoalId
  readonly onChange: (goalId: LearningGoalId) => void
}

export function GoalSelector({ selectedGoal, onChange }: GoalSelectorProps) {
  return (
    <fieldset className="goal-selector">
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
            onChange={() => onChange(goal.id)}
          />
          <span>{goal.shortLabel}</span>
        </label>
      ))}
    </fieldset>
  )
}
