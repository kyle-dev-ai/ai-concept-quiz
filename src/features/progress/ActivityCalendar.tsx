import type { LearningProgress } from '../../domain/learning/progress'
import { type ActivityDay, activityWeeks } from '../../domain/learning/progress'

interface ActivityCalendarProps {
  readonly progress: LearningProgress
  /**
   * 보여줄 주 수. 월요일에 시작하는 주로 끊는다.
   * 길게 잡을수록 빈칸이 많아져 기록이 짧을 때 실패처럼 읽힌다.
   */
  readonly weeks?: number
}

const weekdayLabels = ['월', '화', '수', '목', '금', '토', '일'] as const

/** 그 주에 달이 바뀌면 왼쪽에 달을 적어 언제쯤인지 알 수 있게 한다. */
function monthLabel(week: readonly ActivityDay[], previous: readonly ActivityDay[] | undefined) {
  const first = week[0]
  if (first === undefined) {
    return null
  }

  const changed = previous === undefined || week.some((day) => day.dayOfMonth === 1)
  return changed ? `${week.find((day) => day.dayOfMonth === 1)?.month ?? first.month}월` : null
}

/**
 * 최근 학습한 날을 요일에 맞춰 보여주는 달력.
 *
 * `activityDates`는 1년치가 쌓이는데 지금까지 연속 일수 계산에만 쓰였다.
 * 채워진 칸과 빈 칸이 요일 위에 나란히 서면 오늘 칸을 채우고 싶어진다.
 */
export function ActivityCalendar({ progress, weeks = 4 }: ActivityCalendarProps) {
  const calendar = activityWeeks(progress, weeks)
  const activeCount = calendar.flat().filter((day) => day.isActive).length
  const dayCount = calendar.flat().filter((day) => !day.isFuture).length

  return (
    <section className="activity-calendar" aria-labelledby="activity-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">STUDY LOG</span>
          <h2 id="activity-title">최근 {weeks}주</h2>
        </div>
        <span className="progress-mini">
          {dayCount}일 중 {activeCount}일 학습
        </span>
      </div>

      <table className="activity-calendar__table">
        <caption className="sr-only">
          최근 {weeks}주 학습 기록. {dayCount}일 중 {activeCount}일 학습했습니다.
        </caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">월</span>
            </th>
            {weekdayLabels.map((label) => (
              <th key={label} scope="col" data-weekend={label === '토' || label === '일'}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendar.map((week, index) => (
            <tr key={week[0]?.date}>
              <th scope="row" className="activity-calendar__month">
                {monthLabel(week, calendar[index - 1])}
              </th>
              {week.map((day) => (
                <td key={day.date}>
                  {day.isFuture ? (
                    <span className="activity-day activity-day--future" aria-hidden="true">
                      {day.dayOfMonth}
                    </span>
                  ) : (
                    <span
                      className="activity-day"
                      data-active={day.isActive}
                      data-today={day.isToday}
                      role="img"
                      aria-label={`${day.month}월 ${day.dayOfMonth}일 ${day.isActive ? '학습함' : '학습 안 함'}`}
                    >
                      {day.dayOfMonth}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
