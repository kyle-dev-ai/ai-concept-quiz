import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { getLearnerLevel } from '../../domain/learning/progress'
import { StudyComplete } from './StudyComplete'

function renderComplete(overrides: Partial<Parameters<typeof StudyComplete>[0]> = {}) {
  return render(
    <StudyComplete
      reviewedCount={5}
      streak={11}
      masteryScore={32}
      level={getLearnerLevel(32)}
      dueTomorrow={7}
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
    expect(screen.getByLabelText('설명력 점수 32점')).toBeInTheDocument()
    // 32점이면 다음 레벨(40점)까지 8점 남았다.
    expect(screen.getByText('다음 레벨까지 8점')).toBeInTheDocument()
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
    renderComplete({ masteryScore: 90, level: getLearnerLevel(90) })

    expect(screen.getByText('AI 구술가')).toBeInTheDocument()
  })

  it('연속 기록이 없으면 통계를 띄우지 않는다', () => {
    renderComplete({ streak: 0 })

    expect(screen.queryByText('연속 학습')).not.toBeInTheDocument()
  })
})
