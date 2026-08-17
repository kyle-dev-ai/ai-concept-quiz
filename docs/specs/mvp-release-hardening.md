# MVP release hardening specification

- Work ID: `mvp-release-hardening`
- Status: approved by user direction
- Target: `v1.0.0`
- Date: 2026-08-16

## Outcome

기존 로컬 우선 MVP를 기능 손상 없이 가볍고 실패에 정직한 출시 후보로 만든다. 같은 source commit에서 Apps in Toss용 `.ait`와 custom domain에 올릴 standalone PWA를 만들 수 있어야 하며, 실제 사용자 오류는 설정을 켠 환경에서 Sentry로 확인할 수 있어야 한다.

## Scope

- TypeScript strictness와 module boundary를 repository 규칙에 맞춘다.
- browser와 Apps in Toss 저장소를 build-time adapter로 분리한다.
- 저장 실패 시 성공으로 보이지 않도록 온보딩, 목표 변경, 자기평가 UX를 보강한다.
- Sentry를 `Telemetry` port 뒤의 opt-in error adapter로 연결한다.
- 사용자 행동 분석, Session Replay, PII 전송 없이 JavaScript 오류만 수집한다.
- 모바일 WebView 기준 bundle budget, cache 전략, memory baseline을 기록한다.
- 동일 버전의 Apps in Toss package와 standalone PWA를 한 명령으로 검증한다.
- header, bottom navigation, legal/footer 책임을 분리하고 support contact 운영 방식을 문서화한다.
- 모든 화면에서 접근 가능한 system/light/dark 전환과 기기별 preference 저장을 제공한다.
- 첫 선택, 답 공개, 자기평가에는 저장을 지연시키지 않는 짧은 상태 피드백을 제공한다.
- release HTML에 unsafe inline/eval 없이 동작하는 strict Content Security Policy를 주입한다.
- Apps in Toss 공식 통합 광고, banner placement, 사업자·교육 category 수익화 조건을 backlog/ADR에 반영한다.
- 출시 체크리스트, incident runbook, dual-delivery 문서와 저장소 평가표를 갱신한다.

## Non-goals

- Apps in Toss 콘솔 등록, Sandbox 업로드, 심사 요청 또는 공개 배포
- custom domain 구매, DNS 변경 또는 hosting provider 생성
- Sentry 조직·프로젝트 생성, DSN·auth token 발급 또는 외부 alert 전송 테스트
- 실제 광고 SDK, 광고 그룹, 결제 또는 수익 정산 활성화
- product analytics, 로그인, backend, DB 또는 cloud sync 추가
- 162개 Q&A의 최종 사람 사실·수식·난이도 검수

## Acceptance criteria

1. app과 build config 모두 `strict`와 `noUncheckedIndexedAccess`를 통과한다.
2. `src/domain`은 React, browser API, Apps SDK, Sentry를 import하지 않는다.
3. feature는 concrete infrastructure adapter를 import하지 않는다.
4. browser storage를 사용할 수 없으면 쓰기가 성공한 것처럼 끝나지 않고 UI에서 재시도할 수 있다.
5. 자기평가와 목표 변경은 repository 저장 완료 후에만 화면 상태와 success message가 바뀐다.
6. local은 console diagnostics, DSN이 설정된 standalone/prd는 Sentry error adapter, 그 외 환경은 no-op을 사용한다.
7. Sentry event는 nickname, goal note, storage payload, URL query/hash, request/user data를 전송하지 않는다.
8. Session Replay, product analytics, tracing은 v1.0.0에서 꺼져 있다.
9. standalone 초기 bundle에는 Apps in Toss SDK가 포함되거나 precache되지 않는다.
10. standalone PWA는 hashed asset precache와 navigation fallback을 유지한다.
11. bundle budget script가 Apps/standalone 산출물 크기를 검증하고 초과 시 실패한다.
12. `npm run verify`가 format/lint, strict typecheck, tests, content eval, 두 web build, `.ait`, bundle budget을 모두 실행한다.
13. 모바일 browser flow와 warm heap soak에서 기능 회귀 또는 지속적인 DOM node 증가가 없어야 한다.
14. 앱 footer에는 copyright와 version만 두며 개인 이메일은 source에 넣지 않는다.
15. 실제 심사 전 남은 console, support contact, Sentry credential, Sandbox/Toss app test, 사람 콘텐츠 검수 항목이 명확히 표시된다.
16. 모든 화면 우측 상단에서 system/light/dark를 바꿀 수 있고 새로고침 뒤에도 선택이 유지된다.
17. 320px viewport에서 appearance control이 기존 header action과 겹치거나 가로 overflow를 만들지 않는다.
18. production/standalone HTML은 self-origin 중심 CSP를 포함하며 설정된 HTTPS Sentry origin만 `connect-src`에 추가한다.
19. 홈의 level, profile, appearance control은 같은 44px 높이와 상단 기준선에 정렬된다.
20. dark theme은 page, raised surface, inverse card의 명도 단계를 구분하고 lime surface 위에는 고정된 dark foreground를 사용한다.
21. 답 공개와 자기평가 상태 전환은 즉시 이해할 수 있는 시각 피드백을 주되 `prefers-reduced-motion`에서는 motion을 제거한다.
22. 학습, 용어집, 기록 화면의 영문 handwritten headline은 같은 display size와 행간 token을 사용한다.
23. 광고 6개 placement는 provider port 뒤에 있고 비활성·No Fill·실패·미지원 상태에서 빈 UI나 깨진 image를 남기지 않는다.
24. 학습자 프로필은 상단 action이 아니라 네 번째 primary navigation destination에서 확인·편집한다.
25. floating navigation은 tap, keyboard activation과 dock 내부 horizontal drag를 모두 지원하며 drag release 전에는 화면을 바꾸지 않는다.

## Performance budgets

- Apps in Toss `.ait`: 1 MiB 이하. 플랫폼 한도보다 의도적으로 훨씬 작게 유지한다.
- 각 profile initial JavaScript gzip: 125 KiB 이하.
- 각 profile total JavaScript gzip: 300 KiB 이하. 이 중 약 156 KiB는 DSN이 설정될 때만 받는 optional Sentry chunk다.
- 각 profile CSS gzip: 12 KiB 이하.
- 162개 정적 질문과 현재 화면 단위에서는 runtime list virtualization을 도입하지 않는다. Library filtering은 memoization하며 실제 저사양 WebView에서 scroll 성능을 확인한다.
- memory 결과는 desktop Chromium proxy로만 판정하며 iOS/Android WebView 실기기 확인을 출시 gate로 유지한다.

## Rollback

- 코드 회귀는 직전 local commit으로 되돌린 뒤 전체 verification을 재실행한다.
- Sentry 장애는 `VITE_SENTRY_DSN`을 비워 adapter를 no-op으로 전환한다.
- standalone 장애는 hosting provider에서 직전 immutable build로 되돌린다.
- Apps in Toss 공개 후 장애는 콘솔의 이전 배포 버전 rollback을 사용한다.
