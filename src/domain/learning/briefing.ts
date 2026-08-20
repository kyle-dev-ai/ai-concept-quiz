/** 홈에 들어섰을 때 오늘이 어떤 상태인지 한 줄로 말해준다. */
export type BriefingTone = 'fresh' | 'progress' | 'done'

export interface DailyBriefing {
  readonly greeting: string
  readonly headline: string
  readonly detail: string
  readonly tone: BriefingTone
}

export interface BriefingInput {
  readonly nickname: string
  readonly reviewedToday: number
  readonly goal: number
  readonly dueCount: number
  readonly streak: number
  readonly now?: Date
}

function greetingFor(hour: number): string {
  if (hour < 6) {
    return '늦은 밤이네요'
  }
  if (hour < 12) {
    return '좋은 아침이에요'
  }
  return hour < 18 ? '좋은 오후예요' : '오늘 하루 마무리해요'
}

/**
 * 오늘 몫이 얼마나 남았는지에 따라 첫 화면의 문장을 고른다.
 *
 * 홈에 들어왔을 때 가장 먼저 읽히는 자리라, 통계가 아니라
 * 지금 무엇을 하면 되는지를 말한다.
 */
export function dailyBriefing({
  nickname,
  reviewedToday,
  goal,
  dueCount,
  streak,
  now = new Date(),
}: BriefingInput): DailyBriefing {
  const greeting = `${greetingFor(now.getHours())}, ${nickname}님`

  if (reviewedToday >= goal && goal > 0) {
    return {
      greeting,
      headline: '오늘 몫 완료',
      detail: streak > 1 ? `${streak}일째 이어가는 중이에요.` : '내일도 이 자리에서 이어가요.',
      tone: 'done',
    }
  }

  if (reviewedToday > 0) {
    return {
      greeting,
      headline: `${goal - reviewedToday}개만 더`,
      detail: '이어서 하면 오늘 몫이 끝나요.',
      tone: 'progress',
    }
  }

  if (dueCount > 0) {
    return {
      greeting,
      headline: `복습 ${dueCount}개가 기다려요`,
      detail: '잊을 때쯤 다시 만나는 개념이에요.',
      tone: 'fresh',
    }
  }

  return {
    greeting,
    headline: '오늘 첫 개념',
    detail: '15초만 소리 내어 설명해보세요.',
    tone: 'fresh',
  }
}
