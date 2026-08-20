import type { LearningProgress } from '../../domain/learning/progress'
import { type ActivityDay, recentActivity } from '../../domain/learning/progress'

interface ActivityCalendarProps {
  readonly progress: LearningProgress
  /** 보여줄 날짜 수. 주 단위로 떨어지도록 7의 배수를 쓴다. */
  readonly days?: number
}

function weeksOf(days: readonly ActivityDay[]): ActivityDay[][] {
  const weeks: ActivityDay[][] = []
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7))
  }
  return weeks
}

/**
 * 최근 학습한 날을 칸으로 보여주는 달력.
 *
 * `activityDates`는 1년치가 쌓이는데 지금까지 연속 일수 계산에만 쓰였다.
 * 채워진 칸과 빈 칸이 나란히 보이면 오늘 칸을 채우고 싶어진다.
 */
export function ActivityCalendar({ progress, days = 70 }: ActivityCalendarProps) {
  const activity = recentActivity(progress, days)
  const activeCount = activity.filter((day) => day.isActive).length

  return (
    <section className="activity-calendar" aria-labelledby="activity-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">STUDY LOG</span>
          <h2 id="activity-title">최근 {days}일</h2>
        </div>
        <span className="progress-mini">{activeCount}일 학습</span>
      </div>

      <div
        className="activity-grid"
        role="img"
        aria-label={`최근 ${days}일 중 ${activeCount}일 학습`}
      >
        {weeksOf(activity).map((week) => (
          <div className="activity-week" key={week[0]?.date}>
            {week.map((day) => (
              <i
                key={day.date}
                data-active={day.isActive}
                data-today={day.isToday}
                title={day.date}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
