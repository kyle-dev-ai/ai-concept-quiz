# ADR 0003: Runtime profiles, persistence, and adapter boundaries

- Status: Accepted
- Date: 2026-08-16

## Context

개발 중에는 일반 브라우저와 휴대폰 LAN 접속이 가장 빠르다. 출시 환경은 Apps in Toss WebView이며 공식 native Storage를 사용할 수 있다. standalone PWA도 같은 코드로 먼저 들고 다니며 써보고 싶지만, 초기 서버·DB·로그인은 유지보수와 개인정보 범위를 늘린다. 향후 Notion import, backend content API, cloud sync를 붙일 수 있는 경계는 필요하다.

## Decision

- `local`, `standalone`, `prd` 세 runtime profile을 환경 파일로 분리한다.
- `local`과 `standalone` 사용자 상태는 browser `localStorage`에 저장한다.
- `prd`는 Apps in Toss 공식 `Storage`를 동적 import하는 adapter를 사용한다.
- static 질문은 앱 bundle에 포함하고 standalone에서 service worker가 asset을 cache한다.
- profile과 progress repository는 `KeyValueStore` port만 의존한다.
- 질문 공급자는 `QuestionRepository`, 공유는 `ChallengeShare`, 관측성은 `Telemetry` port 뒤에 둔다.
- 저장 payload는 앱 SemVer와 별도의 schema version을 가진다.
- PWA service worker는 standalone build에서만 생성하고 Apps in Toss build에는 넣지 않는다.
- iOS/Android 별도 store packaging은 MAU와 native 요구가 확인될 때 Capacitor와 React Native를 다시 비교한다.

## Consequences

- MVP는 서버 비용, 계정, 개인정보 수집 없이 세 환경에서 같은 domain/UI를 사용한다.
- Apps SDK, browser API, 미래 backend가 domain logic에 퍼지지 않는다.
- browser site data, Toss 앱 또는 기기를 삭제하면 진도가 사라질 수 있고 기기 간 동기화되지 않는다.
- standalone을 외부에서 지속 사용하려면 HTTPS static hosting이 필요하지만 custom domain은 필수가 아니다.
- cloud sync가 필요해지면 인증, 개인정보 정책, migration, conflict resolution을 별도 결정해야 한다.
