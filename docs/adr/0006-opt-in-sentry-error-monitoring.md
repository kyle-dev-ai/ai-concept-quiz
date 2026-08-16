# ADR 0006: Opt-in Sentry JavaScript error monitoring

- Status: Accepted
- Date: 2026-08-16

## Context

MVP는 서버와 로그인 없이 사용자 기기에서 실행된다. console log만으로는 public Apps in Toss 또는 standalone 사용자의 오류를 알 수 없다. 반면 초기부터 analytics, replay, tracing, 사용자 입력 전송까지 켜면 privacy와 bundle 비용이 불필요하게 커진다. Apps in Toss 공식 문서는 client error 확인 도구로 Sentry를 안내한다.

## Decision

- 기존 `Telemetry` port 뒤에 Sentry adapter를 둔다. feature와 domain은 Sentry SDK를 import하지 않는다.
- `VITE_SENTRY_DSN`이 비어 있으면 SDK를 import하거나 원격 요청하지 않는다.
- 설정된 standalone/prd에서만 SDK를 동적 import하고, 초기 오류를 잃지 않도록 작은 bounded queue가 있는 deferred telemetry를 사용한다.
- error monitoring만 사용한다. product events, Session Replay, tracing, profiling은 v1.0.0에서 전송하지 않는다.
- `sendDefaultPii`를 끄고 `beforeSend`에서 user, request, breadcrumbs, URL query/hash, free-text context를 제거한다.
- event에는 app release와 runtime profile만 low-cardinality tag로 남긴다.
- DSN은 environment config로 주입하며 auth token은 client bundle과 저장소에 절대 넣지 않는다.
- source map은 release 시 Apps in Toss 공식 upload flow 또는 Sentry CLI를 credential이 있는 운영자가 실행하고 public artifact에는 포함하지 않는다.
- 초기 alert channel은 Sentry free plan의 email이다. Slack은 실제 workspace와 plan을 정한 뒤 server-side integration으로 연결한다.

## Consequences

- 사용자 제보 없이도 JavaScript exception과 release/profile을 확인할 수 있다.
- DSN 미설정 개발·preview는 현재와 같은 local-only 동작을 유지한다.
- native crash나 WebView 자체 오류는 JavaScript SDK만으로 관측하지 못하므로 Apps in Toss 성능 dashboard와 실기기 QA를 함께 사용해야 한다.
- Sentry quota, account access, retention, alert delivery는 외부 운영 설정이며 출시 전 별도 확인이 필요하다.
- dynamic SDK chunk가 생기지만 initial bundle과 standalone precache에서는 제외한다.

