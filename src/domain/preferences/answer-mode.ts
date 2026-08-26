/**
 * 답을 떠올리는 방식.
 *
 * `spoken`은 소리 내어 설명하고 브라우저 음성 인식으로 받아적는다.
 * `silent`는 지하철, 사무실, 강의실처럼 소리를 낼 수 없는 자리를 위한 모드다.
 * 마이크를 아예 켜지 않고 핵심 키워드를 적어 핵심 포인트 적중만 확인한다.
 */
export const answerModes = ['spoken', 'silent'] as const

export type AnswerMode = (typeof answerModes)[number]

export function isAnswerMode(value: unknown): value is AnswerMode {
  return answerModes.some((mode) => mode === value)
}
