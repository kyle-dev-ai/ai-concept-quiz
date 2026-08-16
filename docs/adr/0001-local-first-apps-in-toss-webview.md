# ADR 0001: Apps in Toss WebView 기반 local-first 구조

- Status: accepted
- Date: 2026-08-16
- Work ID: `ai-concept-quiz-mvp`

## Context

빠른 출시, 낮은 유지보수, React 역량 증명, 실시간 AI 비용 없음이 핵심 제약이다. 앱인토스는 WebView와 React Native를 지원하지만 현재 공식 TDS 스캐폴드는 React 18 전용이고 일반 `react-ts` 스캐폴드는 React 19를 제공한다. 사용자는 최신 안정 React/Node와 표준 품질 도구를 요청했다.

## Decision

- 공식 `create-ait-app`의 `react-ts` 템플릿을 사용한다.
- React 19, TypeScript 6, Vite 8, Apps in Toss Web Framework 3을 고정 버전으로 관리한다.
- 런타임은 Current보다 운영 안정성이 높은 Node 24 LTS로 고정한다.
- TDS에 직접 결합하지 않고 CSS design token과 작고 의미 있는 UI 컴포넌트를 사용한다. TDS가 React 19를 공식 지원하면 UI 계층에서 재평가한다.
- 도메인 로직, 브라우저 저장소, 화면 컴포넌트를 분리한다.
- 서버 없이 정적 질문 데이터와 `localStorage`를 사용한다.
- 광고는 `AdSlot` 인터페이스와 feature flag 뒤에 둔다. MVP에서는 SDK를 설치하거나 호출하지 않는다.
- 실행 프로파일은 `local`, `standalone`, `prd`로 분리한다. standalone에만 PWA service worker를 만들고 Apps in Toss 빌드에는 포함하지 않는다.
- 단일 WebView 흐름에는 라우터를 추가하지 않고 명시적 화면 상태를 사용한다.
- Biome을 단일 formatter/linter로 사용하고 Vitest + Testing Library로 회귀 테스트한다.

## Architecture boundaries

```text
src/app                 composition and screen navigation
src/domain              goals, questions, sessions, progress rules
src/content             reviewed sample question bank
src/features            goal, study, library, progress, monetization UI
src/shared              small reusable UI and browser adapters
```

도메인 모듈은 React와 브라우저 API를 import하지 않는다. 저장소 구현만 `localStorage`를 알고, 광고 UI는 구체적인 광고 SDK를 알지 않는다.

## Consequences

### Positive

- 한 저장소로 웹 개발과 Apps in Toss 배포를 검증한다.
- 서버 비용과 개인정보 범위를 제거한다.
- 추천·셔플·진도 규칙을 UI 없이 단위 테스트할 수 있다.
- 이후 Notion import, 광고 provider, 서버 동기화를 경계 안쪽 구현 교체로 추가할 수 있다.
- 동일한 React 앱을 LAN 개발 서버, 설치형 standalone PWA, Apps in Toss 패키지에서 사용할 수 있다.

### Trade-offs

- TDS 컴포넌트를 즉시 쓰지 않아 토스 UI 업데이트를 자동 상속하지 않는다.
- 기기 교체·삭제 시 진도가 사라질 수 있다.
- URL 기반 deep link와 브라우저 history는 MVP에 없다.
- 콘텐츠 수정은 Phase 1 import 파이프라인 전까지 코드 변경이 필요하다.
- standalone PWA를 외부에서 쓰려면 HTTPS 정적 호스팅이 필요하지만 커스텀 도메인은 필요 없다.

## Alternatives considered

- React Native: 네이티브 학습에는 좋지만 초기 구현과 QA 비용이 더 크고 이 MVP의 핵심 기능에 네이티브 API가 필요 없다.
- TDS React 18 템플릿: 앱인토스 시각 일관성은 높지만 사용자의 최신 React 요구와 충돌한다.
- Next.js/SSR: 정적 local-first 미니앱에 서버 렌더링과 라우팅 복잡도가 불필요하다.
- 백엔드 + DB: 초기 콘텐츠와 진도 검증 전에 운영·비용·개인정보 부담을 만든다.
- 즉시 Capacitor/React Native 패키징: App Store/Play Store 운영 비용이 MVP 학습가치 검증보다 크다. 도메인 경계를 유지하고 실제 수요 뒤 재평가한다.
