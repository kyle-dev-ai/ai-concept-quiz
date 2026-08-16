import type { LearningGoal } from './goal'
import type { LearnerGroup } from './learner-profile'
import type { CategoryId, StudyQuestion, StudyScope } from './question'

export type RandomSource = () => number

export function questionsForScope(
  questions: readonly StudyQuestion[],
  scope: StudyScope,
  goal: LearningGoal,
  learnerGroup?: LearnerGroup,
): StudyQuestion[] {
  if (scope === 'all') {
    return [...questions]
  }

  if (scope === 'recommended') {
    const recommended = new Set<CategoryId>(goal.recommendedCategories)
    return questions.filter(
      (question) =>
        recommended.has(question.category) &&
        (learnerGroup === undefined ||
          learnerGroup.recommendedDifficulties.includes(question.difficulty)),
    )
  }

  return questions.filter((question) => question.category === scope)
}

export function shuffleQuestions(
  questions: readonly StudyQuestion[],
  random: RandomSource = Math.random,
): StudyQuestion[] {
  const shuffled = [...questions]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[target] as StudyQuestion
    shuffled[target] = current as StudyQuestion
  }

  return shuffled
}

export function createStudyQueue(
  questions: readonly StudyQuestion[],
  scope: StudyScope,
  goal: LearningGoal,
  learnerGroup?: LearnerGroup,
  random: RandomSource = Math.random,
): StudyQuestion[] {
  return shuffleQuestions(questionsForScope(questions, scope, goal, learnerGroup), random)
}

export function getDailyQuestion(
  questions: readonly StudyQuestion[],
  date = new Date(),
): StudyQuestion | undefined {
  if (questions.length === 0) {
    return undefined
  }

  const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  const hash = [...dateKey].reduce((value, character) => value * 31 + character.charCodeAt(0), 7)
  return questions[Math.abs(hash) % questions.length]
}

export function searchQuestions(
  questions: readonly StudyQuestion[],
  query: string,
  category: CategoryId | 'all',
): StudyQuestion[] {
  const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR')

  return questions.filter((question) => {
    if (category !== 'all' && question.category !== category) {
      return false
    }

    if (normalizedQuery.length === 0) {
      return true
    }

    return [question.term, question.prompt, question.shortAnswer, ...question.keyPoints]
      .join(' ')
      .toLocaleLowerCase('ko-KR')
      .includes(normalizedQuery)
  })
}
