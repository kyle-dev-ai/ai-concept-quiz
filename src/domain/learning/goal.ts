import type { CategoryId } from './question'

export const learningGoalIds = [
  'ai-basics',
  'graduate-school',
  'career-switch',
  'ai-practice',
] as const

export type LearningGoalId = (typeof learningGoalIds)[number]

export interface LearningGoal {
  readonly id: LearningGoalId
  readonly label: string
  readonly shortLabel: string
  readonly description: string
  readonly recommendation: string
  readonly recommendedCategories: readonly CategoryId[]
}

export const learningGoals: readonly LearningGoal[] = [
  {
    id: 'ai-basics',
    label: 'AI 기초·교양',
    shortLabel: 'AI 입문',
    description: '비개발자도 자주 듣는 AI 용어부터 부담 없이 시작해요.',
    recommendation: 'ML의 큰 그림을 잡고 LLM → Agent로 가볍게',
    recommendedCategories: ['ml', 'llm', 'agent'],
  },
  {
    id: 'graduate-school',
    label: 'AI 대학원 진학',
    shortLabel: '대학원',
    description: '구술에서 원리와 수식을 자기 말로 설명하는 힘을 만들어요.',
    recommendation: 'Math → ML → DL → Transformer를 잡고 프로젝트 질문까지',
    recommendedCategories: ['math', 'ml', 'dl', 'transformer', 'llm', 'rag', 'agent', 'ai-system'],
  },
  {
    id: 'career-switch',
    label: 'AI 직무 전환·이직',
    shortLabel: '이직',
    description: '면접 기본기와 실제 AI 기능 설계를 함께 준비해요.',
    recommendation: 'ML/DL 기본기 위에 LLM → RAG → Agent를 연결',
    recommendedCategories: ['ml', 'dl', 'llm', 'rag', 'agent', 'ai-system'],
  },
  {
    id: 'ai-practice',
    label: 'AI 실무 역량 강화',
    shortLabel: '실무',
    description: '지금 만드는 Agent의 품질, 비용, 운영 질문에 집중해요.',
    recommendation: 'Transformer 핵심을 짚고 RAG → Agent → System으로',
    recommendedCategories: ['transformer', 'llm', 'rag', 'agent', 'ai-system'],
  },
]

export const learningGoalById = Object.fromEntries(
  learningGoals.map((goal) => [goal.id, goal]),
) as Record<LearningGoalId, LearningGoal>

export function isLearningGoalId(value: unknown): value is LearningGoalId {
  return typeof value === 'string' && learningGoalIds.includes(value as LearningGoalId)
}
