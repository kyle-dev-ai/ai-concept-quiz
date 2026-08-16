# ADR 0004: Defer monetization behind disabled ad slots

- Status: Accepted
- Date: 2026-08-16

## Context

월 10만~50만원, 장기 월 100만원 자동 수익이 목표지만 초기에는 유지율과 session completion 데이터가 없다. 광고를 학습 중간에 넣으면 답변 회상 흐름을 끊고 출시·개인정보·정책 범위를 늘릴 수 있다. 반대로 UI와 코드가 광고 SDK에 직접 결합되면 나중에 수익화 실험 비용이 커진다.

## Decision

- MVP의 모든 profile에서 광고 flag를 끄고 광고 SDK, placement ID, network call을 포함하지 않는다.
- UI에는 `AdSlot`과 의미 있는 placement 이름만 두며 비활성 상태에서는 DOM을 렌더링하지 않는다. 현재 이름은 홈, 용어집, 기록, 프로필, 학습 하단, 세션 완료의 6개다.
- 띠배너 후보는 스크롤 가능한 홈·용어집·기록·프로필·학습 하단의 5곳이다. 온보딩, 로딩, modal에는 두지 않고 답을 생각하는 카드 안에도 넣지 않는다.
- `session-complete`는 띠배너가 아니라 향후 전면형 실험 경계로만 예약한다.
- Apps channel은 Apps in Toss 공식 통합 광고와 WebView banner API만 후보로 삼는다. 통합 광고가 내부적으로 Toss Ads와 AdMob 중 하나를 선택할 수 있지만 앱이 외부 AdMob 또는 원티드 SDK를 직접 삽입하지 않는다.
- banner provider는 `rendered`, `no fill`, `failed`, `unsupported`를 구분한다. 렌더 전에는 작은 loading shell만 두고, 실패·No Fill·미지원이면 구좌 DOM을 제거해 기존 콘텐츠가 공간을 채운다.
- 실제 활성화 전 사업자 등록, 정산 검토, 광고 그룹 ID, 교육 서비스 수익화 자격 조건과 CSP/SDK 호환성을 별도 release gate로 확인한다.
- 광고 그룹 카테고리는 앱 정보에서 자동 제안되고 콘솔에서 바꿀 수 있지만, 특정 입시·이직 광고 소재만 노출된다고 보장하지 않는다.
- retention과 session completion을 먼저 검증하고 광고 수익은 MAU, fill rate, eCPM 가정으로 다시 계산한다.

## Consequences

- 초기 학습 경험과 출시 속도를 광고 최적화보다 우선한다.
- 광고 provider를 바꾸더라도 학습 화면의 domain flow는 유지할 수 있다.
- 예약된 띠배너는 기능 flag가 꺼진 동안 공간도 차지하지 않는다.
- 현재 `AdSlot` 이름은 provider-neutral하지만 Apps channel의 구현체는 공식 Apps in Toss ads로 제한된다.
- production adapter가 아직 연결되지 않은 상태에서 flag가 켜져도 구좌는 자동으로 접히며 깨진 image나 빈 box가 남지 않는다.
- v1.0.0에는 수익이 발생하지 않는다.
- 실제 월 수익 목표 달성 가능성은 트래픽 데이터가 생기기 전에는 검증되지 않는다.
