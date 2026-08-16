# ADR 0004: Defer monetization behind disabled ad slots

- Status: Accepted
- Date: 2026-08-16

## Context

월 10만~50만원, 장기 월 100만원 자동 수익이 목표지만 초기에는 유지율과 session completion 데이터가 없다. 광고를 학습 중간에 넣으면 답변 회상 흐름을 끊고 출시·개인정보·정책 범위를 늘릴 수 있다. 반대로 UI와 코드가 광고 SDK에 직접 결합되면 나중에 수익화 실험 비용이 커진다.

## Decision

- MVP의 모든 profile에서 광고 flag를 끄고 광고 SDK, placement ID, network call을 포함하지 않는다.
- UI에는 `AdSlot`과 의미 있는 placement 이름만 두며 비활성 상태에서는 DOM을 렌더링하지 않는다.
- 학습 화면 최하단에는 향후 320×50 또는 adaptive strip provider가 연결될 `study-bottom-banner` placement를 예약한다. 답을 생각하는 카드 안에는 넣지 않는다.
- 첫 실험 후보는 질문 사이가 아니라 `session-complete`처럼 학습이 끝난 경계로 제한한다.
- `AdMob`을 포함한 provider의 Apps in Toss 지원 여부는 가정하지 않는다. provider 선택, 동의, 최신 플랫폼 정책, 사업자·세무 요건, frequency cap은 활성화 직전에 별도 ADR로 결정한다.
- retention과 session completion을 먼저 검증하고 광고 수익은 MAU, fill rate, eCPM 가정으로 다시 계산한다.

## Consequences

- 초기 학습 경험과 출시 속도를 광고 최적화보다 우선한다.
- 광고 provider를 바꾸더라도 학습 화면의 domain flow는 유지할 수 있다.
- 예약된 띠배너는 기능 flag가 꺼진 동안 공간도 차지하지 않는다.
- v1.0.0에는 수익이 발생하지 않는다.
- 실제 월 수익 목표 달성 가능성은 트래픽 데이터가 생기기 전에는 검증되지 않는다.
