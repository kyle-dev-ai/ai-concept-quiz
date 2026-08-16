interface StudyBuddyProps {
  readonly mood?: 'calm' | 'thinking' | 'celebrate'
  readonly size?: 'small' | 'medium' | 'large'
}

export function StudyBuddy({ mood = 'calm', size = 'medium' }: StudyBuddyProps) {
  return (
    <svg
      className="study-buddy"
      data-mood={mood}
      data-size={size}
      viewBox="0 0 220 190"
      role="img"
      aria-label={mood === 'celebrate' ? '기뻐하는 학습 메이트 텐이' : '학습 메이트 텐이'}
    >
      <path className="study-buddy__antenna" d="M78 42 58 22m54 14V12m34 30 20-20" />
      <circle className="study-buddy__node" cx="56" cy="20" r="10" />
      <circle className="study-buddy__node study-buddy__node--lime" cx="112" cy="12" r="10" />
      <circle className="study-buddy__node" cx="168" cy="20" r="10" />
      <path
        className="study-buddy__body"
        d="M42 91c0-34 30-58 68-58h4c38 0 68 24 68 58v37c0 31-25 56-56 56H98c-31 0-56-25-56-56V91Z"
      />
      <path className="study-buddy__arm study-buddy__arm--left" d="M48 109 23 126" />
      <path className="study-buddy__arm study-buddy__arm--right" d="m176 109 23 17" />
      <g className="study-buddy__face">
        <ellipse cx="87" cy="91" rx="8" ry="11" />
        <ellipse cx="137" cy="91" rx="8" ry="11" />
        <path d="M96 116c9 8 23 8 32 0" />
      </g>
      <rect className="study-buddy__card" x="70" y="130" width="84" height="49" rx="10" />
      <path className="study-buddy__card-line" d="M86 146h51m-51 14h35" />
      <circle className="study-buddy__card-dot" cx="139" cy="160" r="7" />
    </svg>
  )
}
