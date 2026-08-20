import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { getLearnerLevel } from '../../domain/learning/progress'
import { StudyComplete } from './StudyComplete'

function renderComplete(overrides: Partial<Parameters<typeof StudyComplete>[0]> = {}) {
  return render(
    <StudyComplete
      reviewedCount={5}
      streak={11}
      masteryScore={8}
      level={getLearnerLevel(8)}
      dueTomorrow={7}
      similarities={[]}
      recordsBroken={0}
      weakCount={0}
      onStartWeak={vi.fn()}
      adsEnabled={false}
      bannerAds={{ attach: () => () => undefined }}
      onRestart={vi.fn()}
      onHome={vi.fn()}
      {...overrides}
    />,
  )
}

describe('StudyComplete', () => {
  it('연속 학습과 다음 레벨까지 남은 점수를 보여준다', () => {
    renderComplete()

    expect(screen.getByLabelText('연속 학습 11일')).toBeInTheDocument()
    expect(screen.getByLabelText('설명력 점수 8점')).toBeInTheDocument()
    // 8점이면 다음 레벨(12점)까지 4점 남았다.
    expect(screen.getByText('다음 레벨까지 4점')).toBeInTheDocument()
  })

  it('내일 복습할 개념 수로 다시 올 이유를 알려준다', () => {
    renderComplete({ dueTomorrow: 7 })

    expect(screen.getByText('내일 복습할 개념')).toBeInTheDocument()
    expect(screen.getByText('7개')).toBeInTheDocument()
  })

  it('예정된 복습이 없으면 그렇다고 알린다', () => {
    renderComplete({ dueTomorrow: 0 })

    expect(screen.getByText('아직 예정 없음')).toBeInTheDocument()
    expect(screen.queryByText('내일 복습할 개념')).not.toBeInTheDocument()
  })

  it('최고 레벨이면 남은 점수 대신 레벨 이름을 보여준다', () => {
    renderComplete({ masteryScore: 70, level: getLearnerLevel(70) })

    expect(screen.getByText('AI 구술가')).toBeInTheDocument()
  })

  it('연속 기록이 없으면 통계를 띄우지 않는다', () => {
    renderComplete({ streak: 0 })

    expect(screen.queryByText('연속 학습')).not.toBeInTheDocument()
  })

  it('이번 세션 평균 유사도와 기록 경신 수를 보여준다', () => {
    renderComplete({ similarities: [40, 62, 75], recordsBroken: 2 })

    expect(screen.getByText('59%')).toBeInTheDocument()
    expect(screen.getByText(/개인 최고 기록 2개 경신/)).toBeInTheDocument()
  })

  it('음성 기록이 없으면 유사도 요약을 띄우지 않는다', () => {
    renderComplete({ similarities: [] })

    expect(screen.queryByText('말한 답 평균 유사도')).not.toBeInTheDocument()
  })

  it('기록을 경신하지 못한 날에는 경신 문구를 띄우지 않는다', () => {
    renderComplete({ similarities: [40], recordsBroken: 0 })

    expect(screen.getByText('말한 답 평균 유사도')).toBeInTheDocument()
    expect(screen.queryByText(/경신/)).not.toBeInTheDocument()
  })

  it('약점이 남아 있으면 다시 말하기로 이어준다', async () => {
    const onStartWeak = vi.fn()
    renderComplete({ weakCount: 4, onStartWeak })

    const callout = screen.getByRole('button', { name: /4개 개념 다시 말해보기/ })
    callout.click()

    expect(onStartWeak).toHaveBeenCalledTimes(1)
  })
})
