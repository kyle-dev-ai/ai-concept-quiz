import { describe, expect, it } from 'vitest'
import { learningGoalById } from './goal'
import { learnerGroupById } from './learner-profile'
import type { StudyQuestion } from './question'
import { createStudyQueue, getDailyQuestion, questionsForScope, searchQuestions } from './session'

const questions: readonly StudyQuestion[] = [
  {
    id: 'ml-foundation',
    category: 'ml',
    difficulty: 'foundation',
    term: 'ML',
    prompt: 'Machine Learning은 무엇인가요?',
    shortAnswer: '데이터에서 패턴을 학습하는 AI 방법입니다.',
    deepAnswer: '명시적 규칙 대신 objective와 데이터로 파라미터를 학습합니다.',
    keyPoints: ['데이터', '학습'],
    followUp: 'AI와 어떤 관계인가요?',
    prerequisites: [],
  },
  {
    id: 'dl-advanced',
    category: 'dl',
    difficulty: 'advanced',
    term: 'Backpropagation',
    prompt: 'Backpropagation은 무엇인가요?',
    shortAnswer: 'Chain Rule로 gradient를 계산합니다.',
    deepAnswer: '계산 그래프의 뒤에서 앞으로 local gradient를 누적합니다.',
    keyPoints: ['Chain Rule', 'Gradient'],
    followUp: 'Optimizer와 무엇이 다른가요?',
    prerequisites: [],
  },
  {
    id: 'agent-foundation',
    category: 'agent',
    difficulty: 'foundation',
    term: 'Agent',
    prompt: 'Agent는 무엇인가요?',
    shortAnswer: '목표에 맞춰 다음 행동을 선택합니다.',
    deepAnswer: '모델이 tool과 실행 순서를 동적으로 선택할 수 있습니다.',
    keyPoints: ['목표', '행동'],
    followUp: 'Workflow와 무엇이 다른가요?',
    prerequisites: [],
  },
]

describe('study session', () => {
  it('특정 카테고리 queue에는 다른 카테고리가 섞이지 않는다', () => {
    const queue = createStudyQueue(
      questions,
      'ml',
      learningGoalById['graduate-school'],
      learnerGroupById['graduate-learner'],
      () => 0,
    )

    expect(queue).toHaveLength(1)
    expect(queue.every((question) => question.category === 'ml')).toBe(true)
  })

  it('AI 입문자의 추천 queue에서는 advanced 질문을 제외한다', () => {
    const queue = questionsForScope(
      questions,
      'recommended',
      learningGoalById['ai-basics'],
      learnerGroupById.general,
    )

    expect(queue.map((question) => question.id)).toEqual(['ml-foundation', 'agent-foundation'])
  })

  it('대학원 목표는 이론부터 AI 시스템까지 모든 카테고리를 추천한다', () => {
    const goal = learningGoalById['graduate-school']

    expect(goal.recommendedCategories).toEqual([
      'math',
      'ml',
      'dl',
      'transformer',
      'llm',
      'rag',
      'agent',
      'ai-system',
    ])
  })

  it('같은 날짜에는 같은 daily question을 고른다', () => {
    const date = new Date(2026, 7, 16)
    expect(getDailyQuestion(questions, date)?.id).toBe(getDailyQuestion(questions, date)?.id)
  })

  it('term과 질문 본문을 대소문자와 관계없이 검색한다', () => {
    expect(searchQuestions(questions, 'machine', 'all').map((question) => question.id)).toEqual([
      'ml-foundation',
    ])
  })
})
