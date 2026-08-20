export const categoryIds = [
  'math',
  'ml',
  'dl',
  'transformer',
  'llm',
  'rag',
  'agent',
  'ai-system',
] as const

export type CategoryId = (typeof categoryIds)[number]
export type Difficulty = 'foundation' | 'intermediate' | 'advanced'
export type StudyScope = 'recommended' | 'all' | 'weak' | CategoryId

export interface StudyQuestion {
  readonly id: string
  readonly category: CategoryId
  readonly difficulty: Difficulty
  readonly term: string
  readonly prompt: string
  readonly shortAnswer: string
  readonly deepAnswer: string
  readonly keyPoints: readonly [string, string, ...string[]]
  readonly followUp: string
  readonly prerequisites: readonly string[]
}

export interface CategoryMeta {
  readonly id: CategoryId
  readonly label: string
  readonly shortLabel: string
  readonly description: string
}

export const categories: readonly CategoryMeta[] = [
  {
    id: 'math',
    label: 'Math',
    shortLabel: 'Math',
    description: '벡터, 미분, 확률을 AI 관점에서 이해해요.',
  },
  {
    id: 'ml',
    label: 'Machine Learning',
    shortLabel: 'ML',
    description: '학습 문제와 데이터 분리, 일반화의 기본을 다져요.',
  },
  {
    id: 'dl',
    label: 'Deep Learning',
    shortLabel: 'DL',
    description: '신경망의 순전파부터 역전파와 최적화까지 연결해요.',
  },
  {
    id: 'transformer',
    label: 'Transformer',
    shortLabel: 'TR',
    description: 'Attention과 Transformer 데이터 흐름을 설명해요.',
  },
  {
    id: 'llm',
    label: 'Large Language Model',
    shortLabel: 'LLM',
    description: '사전학습, 추론, 정렬과 경량 튜닝을 정리해요.',
  },
  {
    id: 'rag',
    label: 'Retrieval-Augmented Generation',
    shortLabel: 'RAG',
    description: '검색, chunking, reranking을 품질 관점에서 봐요.',
  },
  {
    id: 'agent',
    label: 'AI Agent',
    shortLabel: 'Agent',
    description: '도구, 계획, 메모리와 평가의 경계를 구분해요.',
  },
  {
    id: 'ai-system',
    label: 'AI System',
    shortLabel: 'System',
    description: '지연시간, 비용, 평가와 운영을 함께 생각해요.',
  },
]

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<CategoryId, CategoryMeta>

export const difficultyLabel: Record<Difficulty, string> = {
  foundation: '기초',
  intermediate: '중급',
  advanced: '심화',
}
