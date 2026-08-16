# AI Concept Quiz MVP specification

- Work ID: `ai-concept-quiz-mvp`
- Status: approved by user direction
- Product name: 어텐션! (working title)
- Platform: Apps in Toss WebView

## Outcome

AI를 공부하는 사용자가 3~5분 안에 한 개념을 자기 말로 설명해 보고, 정답과 비교해 이해도를 기록한다. 사용자가 선택한 목표에 따라 우선 학습할 카테고리를 추천하되, 전체 랜덤 또는 특정 카테고리만 골라 학습할 수 있어야 한다.

## Users

- Primary: 2027년 AI 대학원 진학과 구술시험을 준비하는 실무 개발자
- Secondary: AI 직무 전환·이직을 준비하는 개발자
- Secondary: RAG/Agent를 만드는 중 이론과 시스템 기초를 보강하려는 실무자

## MVP scope

- 학습 목표 선택 및 기기 내 저장
  - AI 대학원 진학
  - AI 직무 전환·이직
  - AI 실무 역량 강화
- 목표별 추천 카테고리와 추천 학습 범위
- `추천`, `전체 · 랜덤`, `Math`, `ML`, `DL`, `Transformer`, `LLM`, `RAG`, `Agent`, `AI System` 필터
- 39개의 검수 가능한 샘플 Q&A
- 답 공개 전 생각하기 → 핵심 답변 → 깊이 이해 → 꼬리 질문 흐름
- `알았다 / 애매했다 / 몰랐다` 자기평가와 로컬 진도
- 카테고리별 용어집과 검색
- 비활성 광고 구좌 컴포넌트와 provider 경계 (`learn-home-inline`, `study-bottom-banner`, `session-complete`)
- `local`, `standalone`, `prd` 실행 프로파일과 standalone PWA 산출물
- 모바일 우선 반응형 UI, 키보드 포커스, reduced motion 지원
- versioned prompt·schema·golden set을 사용하는 AI-native 콘텐츠 개발 하네스

## Non-goals

- 실시간 AI 호출 또는 자동 채점
- 로그인, 서버, 클라우드 동기화, 사용자 개인정보 수집
- Notion API/CSV 자동 가져오기
- 실제 광고 SDK, 광고 그룹 ID, 결제, 수익 정산
- 입시 일정 알림과 대학별 모집요강 자동 수집
- 과학적인 spaced repetition 알고리즘

## Acceptance criteria

1. 사용자는 학습 목표를 선택하고 다시 바꿀 수 있으며 새로고침 후에도 유지된다.
2. 목표가 바뀌면 추천 카테고리, 추천 설명, 추천 학습 덱이 함께 바뀐다.
3. 특정 카테고리로 시작한 세션에는 다른 카테고리 문제가 나오지 않는다.
4. `전체 · 랜덤`은 모든 샘플을 대상으로 중복 없는 무작위 순서를 만든다.
5. 문제의 답은 명시적인 조작 전까지 노출되지 않는다.
6. 자기평가를 누르면 해당 문제의 상태와 복습 횟수가 로컬에 저장되고 진도 화면에 반영된다.
7. 용어집은 텍스트 검색과 카테고리 필터를 함께 적용한다.
8. 광고 기능 플래그가 꺼진 MVP에서는 광고 SDK 호출과 빈 광고 UI가 나타나지 않는다. 학습 화면 최하단 placement도 공간을 차지하지 않는다.
9. 프로덕션 빌드가 Apps in Toss의 `.ait` 산출물까지 생성한다.
10. standalone 빌드는 Apps in Toss 없이 HTTPS 호스팅에서 설치·오프라인 실행 가능한 PWA 파일을 만든다.
11. Biome, TypeScript, 단위·컴포넌트 테스트가 통과한다.
12. 39개 전체 콘텐츠 contract와 development/regression/challenge golden set이 100% 통과한다.

## Product phases

### Phase 0 — sample MVP (this work)

로컬 데이터 39개, 목표 추천, 카테고리 학습, 자기평가, 용어집, 로컬 진도를 검증한다. 사용자 런타임에는 AI를 호출하지 않지만 기획·콘텐츠 생성·평가·릴리스는 AI-native operating model을 따른다.

### Phase 1 — content operations

Notion CSV 스키마와 AI-assisted candidate 생성, 검증/변환 파이프라인을 추가하고 150개 핵심 개념으로 확장한다. 틀린 내용의 버전과 검수 상태를 관리한다. standalone PWA를 무료 HTTPS 정적 호스팅에 올려 실제 휴대폰 재방문을 검증한다.

### Phase 2 — retention and monetization

학습 리마인드, 약한 개념 우선 복습, 사용 이벤트 계측을 붙인 뒤 데이터로 광고 위치를 결정한다. 코드에는 향후 띠배너 위치를 예약하지만 첫 광고 실험은 세션 완료 또는 용어집 전환 지점부터 A/B 검증한다.

### Phase 3 — optional runtime AI

AI-native 개발 방식은 Phase 0부터 적용한다. 사용자 설명의 루브릭 기반 피드백, 꼬리 질문 생성처럼 사용자 런타임에서 비용이 드는 AI는 학습효과가 검증된 기능에만 서버를 통해 제한적으로 사용한다.

## Risks and mitigations

- 내용 오류: 샘플은 출처·검수 상태를 추가할 수 있는 데이터 구조로 유지하고 Phase 1에서 콘텐츠 검증 게이트를 둔다.
- 로컬 데이터 소실: MVP 제약으로 명시하고 서버 동기화는 유지율 확인 뒤 결정한다.
- 목표 추천의 과신: 추천은 진단 결과가 아니라 시작 경로임을 UI에서 설명하고 사용자가 언제든 범위를 바꿀 수 있게 한다.
- 광고가 학습 흐름을 해침: 기능 플래그와 UI 경계만 만들고 실제 광고는 데이터 없이 활성화하지 않는다.
- appName 변경 제한: 콘솔 등록 전 `ai-concept-quiz` 사용 가능 여부를 확인하고 최종 appName을 확정한다.

## Success evidence for the next decision

- 지인 또는 본인 사용 20세션 이상
- 한 세션에서 답 공개 후 자기평가 완료율 60% 이상
- 7일 내 재방문 사용자가 5명 이상 또는 본인 기준 주 4회 이상 사용
- 위 신호가 확인될 때만 150개 콘텐츠와 광고 실험에 투자한다.
