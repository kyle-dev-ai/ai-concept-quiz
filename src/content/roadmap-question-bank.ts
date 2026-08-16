import type { StudyQuestion } from '../domain/learning/question'
import { agentRoadmapQuestions } from './roadmap-questions/agent.ts'
import { aiSystemRoadmapQuestions } from './roadmap-questions/ai-system.ts'
import { dlRoadmapQuestions } from './roadmap-questions/dl.ts'
import { llmRoadmapQuestions } from './roadmap-questions/llm.ts'
import { mathRoadmapQuestions } from './roadmap-questions/math.ts'
import { mlRoadmapQuestions } from './roadmap-questions/ml.ts'
import { ragRoadmapQuestions } from './roadmap-questions/rag.ts'
import { transformerRoadmapQuestions } from './roadmap-questions/transformer.ts'

export const roadmapQuestions = [
  ...mathRoadmapQuestions,
  ...mlRoadmapQuestions,
  ...dlRoadmapQuestions,
  ...transformerRoadmapQuestions,
  ...llmRoadmapQuestions,
  ...ragRoadmapQuestions,
  ...agentRoadmapQuestions,
  ...aiSystemRoadmapQuestions,
] as const satisfies readonly StudyQuestion[]
