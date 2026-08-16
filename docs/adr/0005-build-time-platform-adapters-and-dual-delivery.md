# ADR 0005: Build-time platform adapters and dual delivery

- Status: Accepted
- Date: 2026-08-16

## Context

같은 학습 앱을 Apps in Toss와 standalone domain에서 제공하고 싶다. 두 환경은 persistence API와 delivery artifact가 다르다. runtime dynamic import만 사용하면 standalone build에도 사용하지 않는 Apps SDK chunk가 생성되고 service worker가 이를 precache한다. 별도 app을 복제하면 domain logic, 콘텐츠, release version이 갈라진다.

## Decision

- Apps in Toss와 standalone은 한 source tree, package version, domain model을 공유한다.
- `#platform-key-value-store` alias를 Vite mode에 따라 build time에 해석한다.
- `production`은 Apps in Toss native `Storage`, `development`와 `standalone`은 browser `localStorage` implementation을 사용한다.
- TypeScript와 Vitest는 browser implementation을 기본 alias로 사용하고 두 implementation을 모두 typecheck한다.
- `dist/`는 `.ait` 입력, `dist-standalone/`은 HTTPS static hosting 입력이다.
- release verification은 두 artifact를 같은 commit에서 만든 뒤 bundle budget을 함께 검사한다.
- hashed assets는 immutable cache가 가능하고 `index.html`과 service worker는 revalidation이 필요하다는 hosting contract를 문서화한다.

## Consequences

- standalone 사용자에게 Apps SDK를 다운로드하거나 cache시키지 않는다.
- feature/domain 코드는 플랫폼 선택을 알지 못한다.
- 두 채널은 동일 기능을 제공하지만 기기 저장소가 서로 달라 진도가 동기화되지 않는다.
- platform implementation이 늘면 alias map과 contract test를 함께 갱신해야 한다.
- custom domain은 code change 없이 붙일 수 있지만 HTTPS, SPA fallback, cache header, release/rollback 운영은 hosting provider에서 설정해야 한다.

