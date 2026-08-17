import type { LearningGoal } from './goal'
import type { LearnerGroup } from './learner-profile'
import type { CategoryId, StudyQuestion, StudyScope } from './question'

export type RandomSource = () => number

// 한 세션에 담는 최대 문항 수. 콘텐츠가 늘어도 세션은 끝이 보여야 한다.
// 이 상한이 없으면 대학원 목표에서 전체 문항이 한 세션이 되어 완료가 불가능해진다.
export const maxSessionLength = 25

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
  const scoped = shuffleQuestions(questionsForScope(questions, scope, goal, learnerGroup), random)
  return scoped.slice(0, maxSessionLength)
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
