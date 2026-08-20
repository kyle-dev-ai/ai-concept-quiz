import type { StudyQuestion } from './question'
import { applyTermAliases } from './term-aliases'

// 말한 답과 모범 답을 비교해 점수를 낸다.
//
// 이 점수는 채점이 아니라 자기평가를 돕는 참고선이다. 자기평가만으로는
// "아 알지" 하고 넘어가는 편향을 막을 수 없어서, 실제로 입 밖에 낸 내용과
// 모범 답이 얼마나 겹치는지를 숫자로 보여준다.
//
// 서버로 음성을 보내 의미 유사도를 재는 방법도 있지만, 이 앱은 로컬 우선이라
// 브라우저 안에서 끝나는 문자열 비교만 쓴다. 그래서 표현이 달라도 뜻이 같은
// 답은 낮게 나올 수 있고, 화면에서도 참고값이라고 밝힌다.

/**
 * 비교 전에 공백과 문장부호를 지우고 소문자로 맞춘 뒤,
 * 한국어로 말한 용어를 모범 답과 같은 영문 표기로 모은다.
 */
function normalize(text: string): string {
  return applyTermAliases(text.toLowerCase().replace(/[^0-9a-z가-힣]/g, ''))
}

/** 한국어는 형태소 분석 없이도 글자 2-gram이 잘 맞아 bigram 다중집합을 쓴다. */
function bigramCounts(text: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (let index = 0; index + 1 < text.length; index += 1) {
    const gram = text.slice(index, index + 2)
    counts.set(gram, (counts.get(gram) ?? 0) + 1)
  }
  return counts
}

/**
 * 두 문자열의 글자 bigram Dice 계수를 0~100으로 돌려준다.
 * 길이가 2글자 미만이면 bigram이 없어 완전 일치 여부로 판단한다.
 */
export function textSimilarity(spoken: string, reference: string): number {
  const left = normalize(spoken)
  const right = normalize(reference)

  if (left.length === 0 || right.length === 0) {
    return 0
  }
  if (left.length < 2 || right.length < 2) {
    return left === right ? 100 : 0
  }

  const leftGrams = bigramCounts(left)
  const rightGrams = bigramCounts(right)

  let shared = 0
  for (const [gram, leftCount] of leftGrams) {
    const rightCount = rightGrams.get(gram)
    if (rightCount !== undefined) {
      shared += Math.min(leftCount, rightCount)
    }
  }

  const total = left.length - 1 + (right.length - 1)
  return Math.round(((2 * shared) / total) * 100)
}

// 조사가 붙은 어절은 그대로 비교하면 거의 걸리지 않는다("가중치의" vs "가중치").
// 형태소 분석기를 넣을 만한 규모가 아니라 빈도 높은 조사만 잘라낸다.
const particles = [
  '으로써',
  '에서는',
  '으로',
  '에서',
  '에게',
  '이라',
  '라고',
  '보다',
  '까지',
  '부터',
  '마다',
  '는',
  '은',
  '이',
  '가',
  '을',
  '를',
  '의',
  '와',
  '과',
  '에',
  '로',
  '도',
  '만',
]

function stem(token: string): string {
  for (const particle of particles) {
    if (token.length > particle.length + 1 && token.endsWith(particle)) {
      return token.slice(0, token.length - particle.length)
    }
  }
  return token
}

/** 핵심어 판정에 쓸 2글자 이상 토큰. */
function contentTokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^0-9a-z가-힣]+/)
    .map((token) => stem(token))
    .filter((token) => token.length >= 2)
}

export interface KeyPointCoverage {
  readonly keyPoint: string
  readonly covered: boolean
}

export interface SpokenAnswerScore {
  /** 모범 답과의 표현 유사도(0~100). */
  readonly similarity: number
  readonly coverage: readonly KeyPointCoverage[]
  readonly coveredCount: number
  readonly keyPointCount: number
}

/**
 * 핵심 포인트를 말했는지 판정한다.
 * 포인트의 내용어 절반 이상이 발화에 나오면 짚은 것으로 본다.
 */
function coversKeyPoint(spokenNormalized: string, keyPoint: string): boolean {
  const tokens = contentTokens(keyPoint)
  if (tokens.length === 0) {
    return false
  }

  const hits = tokens.filter((token) => spokenNormalized.includes(normalize(token))).length
  return hits * 2 >= tokens.length
}

/** 발화 전사와 문항을 비교해 유사도와 핵심 포인트 적중을 계산한다. */
export function scoreSpokenAnswer(transcript: string, question: StudyQuestion): SpokenAnswerScore {
  const spokenNormalized = normalize(transcript)
  const coverage = question.keyPoints.map((keyPoint) => ({
    keyPoint,
    covered: spokenNormalized.length > 0 && coversKeyPoint(spokenNormalized, keyPoint),
  }))

  return {
    similarity: textSimilarity(transcript, question.shortAnswer),
    coverage,
    coveredCount: coverage.filter((entry) => entry.covered).length,
    keyPointCount: coverage.length,
  }
}

/**
 * 인식기가 내놓은 후보 중 모범 답에 가장 가까운 것으로 채점한다.
 *
 * 한국어 인식기는 영문 용어를 뭉개는 일이 잦아, 첫 후보만 쓰면 실제로 제대로
 * 말한 답이 낮게 나온다. 후보는 모두 사용자가 말했을 수 있는 문장이므로
 * 인식기의 불확실성 때문에 감점되지 않게 한다.
 */
export function scoreBestCandidate(
  candidates: readonly string[],
  question: StudyQuestion,
): SpokenAnswerScore | null {
  const scored = candidates
    .filter((candidate) => candidate.trim().length > 0)
    .map((candidate) => scoreSpokenAnswer(candidate, question))

  return scored.reduce<SpokenAnswerScore | null>(
    (best, current) => (best === null || current.similarity > best.similarity ? current : best),
    null,
  )
}

/** 점수를 자기평가로 곧장 연결하지 않고, 어느 쪽인지 말로 안내할 때 쓴다. */
export function similarityBand(similarity: number): 'low' | 'partial' | 'high' {
  if (similarity >= 55) {
    return 'high'
  }
  return similarity >= 30 ? 'partial' : 'low'
}
