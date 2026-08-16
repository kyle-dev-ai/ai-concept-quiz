# MVP release hardening execution plan

- Work ID: `mvp-release-hardening`
- Spec: [../../specs/mvp-release-hardening.md](../../specs/mvp-release-hardening.md)
- Date: 2026-08-16

## Baseline evidence

- standalone main JavaScript: 274.02 KiB raw, 86.63 KiB gzip
- standalone CSS: 34.44 KiB raw, 7.40 KiB gzip
- standalone precache: 7 entries, 369.33 KiB raw
- standalone build가 사용하지 않는 Apps in Toss SDK chunk 68.71 KiB raw, 20.71 KiB gzip을 생성·precache함
- local Chromium production preview 3회 load: 37–59 ms
- 30회 tab cycle warm heap soak:
  - warm-up delta: +799,404 bytes
  - repeated deltas: +68,456 bytes, +51,756 bytes
  - DOM node count: 174로 유지

이 수치는 local desktop Chromium proxy다. 메모리가 무한히 증가한다는 증거는 없지만 iOS/Android WebView 결과로 간주하지 않는다.

## Increments and gates

1. Contract and boundaries
   - strict compiler options, infrastructure directory, build-time platform storage alias
   - Gate: typecheck, architecture import scan, adapter tests
2. Durable interactions
   - unavailable storage error, atomic goal/rating persistence, retry UI
   - Gate: component regression tests for failure and duplicate input
3. Error observability
   - opt-in deferred Sentry adapter, privacy scrubber, ErrorBoundary integration, incident runbook
   - Gate: scrubber/adapter tests and DSN-disabled network check
4. Mobile delivery
   - dual build command, bundle budget, standalone cache exclusions, hosting guidance
   - Gate: Apps SDK absent from standalone assets, `.ait` and standalone both build
5. Policy and UI shell
   - shared footer, support contact guidance, official Apps in Toss ad-only decision
   - Gate: accessibility/browser inspection and release checklist review
6. Device-aware appearance and browser security
   - light-default compact theme popover, local preference adapter, semantic light/dark tokens
   - aligned top controls, three-level dark surfaces, contrast-safe lime foreground
   - restrained onboarding, answer reveal, rating-state microinteraction with reduced-motion fallback
   - strict CSP, native progress UI, no runtime inline style
   - Gate: persistence/failure/listener tests, 320px overlap/overflow QA, CSP console check
7. Release verification
   - all quality gates, production browser flow, heap soak, secret/dependency/diff review
   - Gate: evidence-backed `GO`, `CONDITIONAL GO`, or `NO-GO`

## Bounded fix loop

각 gate는 실패 원인 분류 → 최소 수정 → 관련 검사 재실행을 최대 3회 반복한다. 환경 credential, Apps 콘솔, 실기기 또는 사람 콘텐츠 검수처럼 저장소 밖의 작업은 실패로 숨기지 않고 release condition으로 남긴다.

## Approval boundary

로컬 코드·문서·테스트·commit은 사용자 요청 범위다. Sentry 계정 생성, DSN 등록, Slack 연결, custom domain/DNS, Apps in Toss upload/deploy/review, Git push/tag는 수행하지 않는다.
