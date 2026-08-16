# Logging, analytics, and error tracking

## MVP stance

현재 제품은 로그인과 개인정보를 수집하지 않는다. `local`에서는 `ConsoleTelemetry`가 개발 이벤트와 오류를 browser console에 남기고, `standalone`과 `prd`에서는 `NoopTelemetry`를 사용한다. React render 오류는 `ErrorBoundary`가 사용자에게 복구 화면을 제공한다.

이 선택은 “오류가 없다”는 뜻이 아니다. 외부 telemetry provider와 개인정보 문구를 성급하게 넣지 않는 대신 v1.0.0의 공개 범위를 작게 유지한다.

## Stable event contract

- `goal_selected`
- `study_started`
- `answer_revealed`
- `review_recorded`
- `challenge_shared`

이벤트에는 stable question ID, scope, rating처럼 분석에 필요한 최소 값만 허용한다. 닉네임, 한 줄 목표, 사용자가 향후 입력할 자유서술, 답변 원문은 보내지 않는다.

## Remote error tracking trigger

Apps in Toss public acquisition 또는 standalone 외부 테스트 전에 remote adapter를 재검토한다. 후보가 Sentry라면 다음을 release gate로 둔다.

- DSN은 environment secret/config로 주입하고 저장소에 넣지 않는다.
- `release`, runtime profile, app version을 event에 기록한다.
- source map은 공개 bundle에 노출하지 않고 provider upload 권한을 분리한다.
- user text, storage payload, request body를 before-send 단계에서 제거한다.
- session replay는 기본 off이며 별도 privacy decision 없이 켜지 않는다.
- sample rate, quota, alert owner, retention 기간과 삭제 절차를 정한다.
- provider 장애가 학습 흐름을 막지 않도록 fire-and-forget adapter로 둔다.

## Product analytics trigger

수익화나 onboarding 개선을 결정할 만큼 실제 트래픽이 생길 때 provider-neutral `Telemetry` adapter를 구현한다. 최소 funnel은 `onboarding complete → study started → answer revealed → review recorded → 7-day return`이다. 분석 도구를 고르기 전에 이벤트 사전, 동의·정책, 보존 기간, dev/prd 분리와 삭제 방법을 먼저 확정한다.

## Runtime AI traces

향후 AI 피드백을 추가하면 일반 product analytics와 AI trace를 분리한다. trace에는 prompt/model/tool/retrieval/grader revision, latency, cost, error class와 비식별 diagnostic ID를 남긴다. 원문 입력은 기본 저장하지 않고, 품질 audit sample은 명시적 동의와 redaction 정책이 있을 때만 보존한다.
