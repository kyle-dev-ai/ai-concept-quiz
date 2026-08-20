import { describe, expect, it } from 'vitest'
import { dailyBriefing } from './briefing'

const base = {
  nickname: '맥락 찾는 여우',
  reviewedToday: 0,
  goal: 5,
  dueCount: 0,
  streak: 0,
}

describe('dailyBriefing', () => {
  it('시간대에 맞는 인사를 고른다', () => {
    const at = (hour: number) =>
      dailyBriefing({ ...base, now: new Date(2026, 7, 21, hour) }).greeting

    expect(at(3)).toContain('늦은 밤이네요')
    expect(at(9)).toContain('좋은 아침이에요')
    expect(at(14)).toContain('좋은 오후예요')
    expect(at(21)).toContain('오늘 하루 마무리해요')
    expect(at(9)).toContain('맥락 찾는 여우님')
  })

  it('아직 시작 전이고 복습이 밀렸으면 복습을 먼저 말한다', () => {
    const briefing = dailyBriefing({ ...base, dueCount: 7 })

    expect(briefing.headline).toBe('복습 7개가 기다려요')
    expect(briefing.tone).toBe('fresh')
  })

  it('밀린 복습도 없으면 첫 개념을 권한다', () => {
    expect(dailyBriefing(base).headline).toBe('오늘 첫 개념')
  })

  it('시작했으면 남은 개수를 말한다', () => {
    const briefing = dailyBriefing({ ...base, reviewedToday: 2, dueCount: 9 })

    expect(briefing.headline).toBe('3개만 더')
    expect(briefing.tone).toBe('progress')
  })

  it('목표를 채우면 완료로 바꾸고 연속 기록을 붙인다', () => {
    const briefing = dailyBriefing({ ...base, reviewedToday: 5, streak: 12 })

    expect(briefing.headline).toBe('오늘 몫 완료')
    expect(briefing.detail).toContain('12일째')
    expect(briefing.tone).toBe('done')
  })

  it('첫날 완료에는 연속 기록 대신 내일을 말한다', () => {
    const briefing = dailyBriefing({ ...base, reviewedToday: 5, streak: 1 })

    expect(briefing.detail).toContain('내일')
  })
})
