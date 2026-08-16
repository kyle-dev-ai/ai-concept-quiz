# Logging, error monitoring, and operations

## Runtime matrix

| Profile | Default adapter | Remote network | Purpose |
|---|---|---|---|
| `local` | `ConsoleTelemetry` | 없음 | 개발 중 event/error 확인 |
| `standalone` | `NoopTelemetry` | 없음 | DSN 없는 개인 preview |
| `standalone` + DSN | deferred `SentryTelemetry` | error 발생 시 Sentry | 외부 PWA test |
| `prd` | `NoopTelemetry` | 없음 | credential 준비 전 Apps build |
| `prd` + DSN | deferred `SentryTelemetry` | error 발생 시 Sentry | 공개 Apps JavaScript error 확인 |

`VITE_SENTRY_DSN`이 비어 있으면 Sentry SDK를 import하거나 요청하지 않는다. 설정된 경우에도 SDK는 optional chunk로 늦게 받고 PWA precache에서 제외한다. SDK 초기화 전에 발생한 exception은 최근 10건까지만 메모리에 보관한 뒤 adapter가 준비되면 전달한다.

## What is sent

- JavaScript exception type과 minified stack
- 고정된 `area` tag
- `ai-concept-quiz@<SemVer>` release
- `standalone` 또는 `prd` environment

다음은 전송하지 않는다.

- nickname, goal note, profile/progress payload
- email, age, gender, device identifier
- product events와 사용자의 학습 행동
- request, user, breadcrumbs, arbitrary context/extra
- URL query와 hash
- exception message의 원문
- Session Replay, tracing, profiling, logs

`beforeSend` scrubber와 regression test가 이 경계를 지킨다. `sendDefaultPii`와 breadcrumb 수집도 꺼져 있다. Sentry는 product analytics가 아니라 오류 inbox로만 사용한다.

## Configuration

개발자는 commit되지 않는 `.env.production.local` 또는 `.env.standalone.local`에 client DSN만 넣는다.

```dotenv
VITE_SENTRY_DSN=https://PUBLIC_KEY@SENTRY_HOST/PROJECT_ID
```

DSN은 browser에서 보이는 client config지만 환경별 교체를 위해 source에는 넣지 않는다. `SENTRY_AUTH_TOKEN`, organization token, Slack webhook 같은 credential은 `VITE_*`에 넣으면 bundle에 노출되므로 금지한다.

## Source maps

현재 public artifact에는 source map을 포함하지 않는다. Sentry project를 만든 뒤 release operator가 Apps in Toss 공식 절차의 `ait sentry upload-sourcemap`을 사용한다. organization, project, auth token은 local/CI secret로만 주입한다. source map upload 실패는 앱 기능을 막지는 않지만 stack 해석 품질이 낮아지므로 public release condition으로 남긴다.

## Alerting and free tier

2026-08-16 기준 Sentry Developer plan은 무료, 1 user, 5,000 errors, 30-day lookback과 email alert를 제공한다. 초기에는 email alert를 사용한다. Slack 주소는 나중에 받아도 되지만 browser code에 webhook을 넣지 않는다. Sentry third-party integration이 필요한 시점에 당시 plan과 workspace 권한을 다시 확인한다.

초기 alert rule:

- 새 issue가 `prd`에서 처음 발생하면 email
- 같은 release에서 5분 내 5회 이상이면 즉시 확인
- onboarding, bootstrap, progress save 오류는 사용량과 무관하게 release owner가 확인
- quota 80% 도달 시 noisy issue를 먼저 고치고 sampling으로 숨기지 않음

## Platform telemetry

JavaScript SDK만으로 native crash나 WebView resource 문제를 알 수 없다. Apps in Toss console의 FPS, crash ratio, load time, memory dashboard와 Sentry를 함께 본다. 고객 문의는 console에 등록한 고객센터 channel에서 확인한다. 운영 절차는 [client incident runbook](runbooks/client-incident.md)에 있다.

## Product analytics boundary

아래 event contract는 local console과 미래 adapter를 위한 이름일 뿐 v1.0.0에서 원격 전송하지 않는다.

- `goal_selected`
- `study_started`
- `answer_revealed`
- `review_recorded`
- `challenge_shared`

retention/monetization 의사결정에 실제 traffic이 필요해질 때 event dictionary, consent, retention, deletion, dev/prd 분리를 별도 ADR로 결정한다.

## Runtime AI traces

향후 AI feedback을 추가하면 product analytics와 AI trace를 분리한다. trace에는 prompt/model/tool/retrieval/grader revision, latency, cost, error class와 비식별 diagnostic ID를 남긴다. 사용자 원문은 기본 저장하지 않는다.

## Sources

- [Apps in Toss Sentry monitoring](https://developers-apps-in-toss.toss.im/learn-more/sentry-monitoring.html)
- [Apps in Toss FAQ](https://developers-apps-in-toss.toss.im/faq.html)
- [Apps in Toss release notes](https://developers-apps-in-toss.toss.im/release-note.html?tab=sdk)
- [Sentry pricing](https://sentry.io/pricing/)
