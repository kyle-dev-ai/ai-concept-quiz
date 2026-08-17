import type { KnowledgeRating, LearningProgress, QuestionProgress } from './progress'
import type { StudyQuestion } from './question'

// 한 번 "알았다"를 찍은 문항이 다시 나오지 않으면 학습이 아니라 진도 체크가 된다.
// 자기평가와 반복 횟수로 다음에 다시 볼 시점을 정해, 잊을 때쯤 다시 만나게 한다.
//
// 간격은 자기평가 기반이라 정답 채점을 전제하는 방식과 다르다.
// 사용자가 스스로 "알았다"고 한 것이므로 판단이 틀릴 수 있고, 그래서 간격을
// 공격적으로 늘리지 않는다. 확실히 아는 문항을 몇 번 더 보는 비용이
// 모르는 문항을 놓치는 비용보다 싸다.

/** 자기평가와 누적 복습 횟수로 정하는 다음 복습까지의 일수. */
export function reviewIntervalDays(rating: KnowledgeRating, reviewCount: number): number {
  if (rating === 'unknown') {
    return 1
  }
  if (rating === 'unsure') {
    return reviewCount >= 3 ? 5 : 3
  }
  if (reviewCount <= 1) {
    return 7
  }
  return reviewCount === 2 ? 21 : 60
}

function daysBetween(from: Date, to: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const fromDay = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const toDay = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.floor((toDay - fromDay) / millisecondsPerDay)
}

/** 마지막 복습 이후 지난 일수에서 목표 간격을 뺀 값. 0 이상이면 복습할 때가 됐다. */
export function overdueDays(entry: QuestionProgress, now: Date): number {
  const lastReviewed = new Date(entry.lastReviewedAt)
  if (Number.isNaN(lastReviewed.getTime())) {
    return 0
  }
  return daysBetween(lastReviewed, now) - reviewIntervalDays(entry.rating, entry.reviewCount)
}

export interface ReviewPlan {
  /** 복습할 때가 된 문항. 많이 밀린 것부터. */
  readonly due: readonly StudyQuestion[]
  /** 아직 한 번도 보지 않은 문항. */
  readonly fresh: readonly StudyQuestion[]
  /** 이미 봤고 아직 복습 시점이 아닌 문항. */
  readonly resting: readonly StudyQuestion[]
}

/** 복습 시점을 기준으로 문항을 세 갈래로 나눈다. 정렬만 하고 잘라내지 않는다. */
export function planReview(
  questions: readonly StudyQuestion[],
  progress: LearningProgress,
  now = new Date(),
): ReviewPlan {
  const due: { question: StudyQuestion; overdue: number }[] = []
  const fresh: StudyQuestion[] = []
  const resting: StudyQuestion[] = []

  for (const question of questions) {
    const entry = progress.questions[question.id]
    if (entry === undefined) {
      fresh.push(question)
      continue
    }

    const overdue = overdueDays(entry, now)
    if (overdue >= 0) {
      due.push({ question, overdue })
    } else {
      resting.push(question)
    }
  }

  due.sort((left, right) => right.overdue - left.overdue)
  return { due: due.map((entry) => entry.question), fresh, resting }
}

/**
 * 복습할 문항을 먼저, 그다음 새 문항을 배치한다.
 * 복습만 계속 나와 새 내용을 못 만나는 것을 막으려고 복습 비중에 상한을 둔다.
 */
export function orderByReview(
  questions: readonly StudyQuestion[],
  progress: LearningProgress,
  sessionLength: number,
  now = new Date(),
): StudyQuestion[] {
  const plan = planReview(questions, progress, now)
  const maxDue = Math.max(1, Math.ceil(sessionLength * 0.6))
  const takenDue = plan.due.slice(0, maxDue)

  return [...takenDue, ...plan.fresh, ...plan.due.slice(maxDue), ...plan.resting]
}
