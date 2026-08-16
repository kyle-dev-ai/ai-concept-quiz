# Apps in Toss and standalone dual delivery

같은 commit과 `package.json` version에서 두 artifact를 만든다.

```text
React/domain/content
        ├─ production mode → Toss Storage → dist/ → ai-concept-quiz.ait
        └─ standalone mode → localStorage → dist-standalone/ → HTTPS static host
```

## Build

```bash
npm ci
npm run build
```

`npm run build`는 strict typecheck, Apps web build, standalone PWA build, `.ait` package, bundle budget을 순서대로 실행한다. `dist/`, `dist-standalone/`, `.ait`는 generated artifact이며 commit하지 않는다.

## Apps in Toss channel

- upload input: `ai-concept-quiz.ait`
- persistence: official native `Storage`
- service worker: 생성하지 않음
- release: Sandbox → Toss app test → review request → approved release
- rollback: Apps console의 이전 deployment

실제 upload, review request, release는 approval-gated다.

## Standalone/custom-domain channel

- upload input: `dist-standalone/` 전체
- HTTPS 필수
- 모든 client route는 `/index.html`로 fallback
- `/assets/*`: `Cache-Control: public, max-age=31536000, immutable`
- `/index.html`, `/sw.js`, `/registerSW.js`, `/manifest.webmanifest`: revalidate 또는 `no-cache`
- MIME type과 service worker scope `/` 유지
- build HTML의 strict CSP meta를 유지하고 host가 이를 덮어쓰거나 약화하지 않게 확인
- response header에서 `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, 최소 권한 `Permissions-Policy`를 설정
- custom domain을 iframe에 넣지 않는다면 header CSP의 `frame-ancestors 'none'` 또는 동등한 `X-Frame-Options`를 적용
- rollback: 직전 immutable build를 active release로 전환

hosting provider의 무료 subdomain으로 먼저 검증할 수 있으며 custom domain은 필수가 아니다. domain을 나중에 연결해도 Apps in Toss package와 병행 배포할 수 있다.

HTML meta CSP는 script/style/object/frame/connect source를 release artifact 안에서 제한한다. `frame-ancestors`, `X-Content-Type-Options`, `Permissions-Policy`는 meta로 보장할 수 없으므로 provider 선택 후 response header로 설정하고 `curl -I`와 실제 browser console로 검증한다. Sentry를 켜면 build가 DSN의 HTTPS origin만 `connect-src`에 추가한다. 공식 광고나 외부 API를 나중에 붙일 때는 필요한 origin을 allowlist하는 별도 ADR과 회귀 테스트가 먼저다.

## Cache and runtime behavior

- standalone은 app shell, reviewed content, CSS, icon을 precache한다.
- optional Sentry SDK와 adapter는 precache하지 않으며 DSN이 설정될 때만 요청한다.
- Apps in Toss SDK는 standalone build에 포함되지 않는다.
- 질문은 bundle data라 v1.0.0에서 API cache invalidation이 없다.
- 두 채널의 저장소는 독립적이므로 진도는 동기화되지 않는다.

## Release identity

- SemVer: `package.json`
- Sentry release: `ai-concept-quiz@<SemVer>`
- Apps deployment ID와 `.ait` SHA-256: verification packet
- standalone artifact: 같은 Git commit SHA와 version metadata

두 channel이 서로 다른 기능 version을 오래 제공하지 않도록 같은 release candidate에서 생성한다. emergency rollback은 channel별로 독립 수행할 수 있다.
