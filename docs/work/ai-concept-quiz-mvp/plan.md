# AI Concept Quiz MVP execution plan

- Work ID: `ai-concept-quiz-mvp`
- Spec: [../../specs/ai-concept-quiz-mvp.md](../../specs/ai-concept-quiz-mvp.md)
- ADR: [../../adr/0001-local-first-apps-in-toss-webview.md](../../adr/0001-local-first-apps-in-toss-webview.md)

## Evidence established

- Apps in Toss 공식 스캐폴더가 `react-ts`와 TDS 전용 템플릿을 구분한다.
- 생성된 최신 프로젝트는 React 19.2, TypeScript 6, Vite 8, Apps in Toss SDK 3을 사용한다.
- 공식 TDS WebView 설치 문서는 React 18 peer range를 안내한다.
- 로컬 머신은 Node 25이므로 저장소는 Node 24 LTS를 명시하고 검증 환경 차이를 기록한다.

## Increments and gates

1. Repository baseline
   - 버전 고정, Node LTS, Biome, test runner, local/standalone/prd scripts
   - Gate: install, format, typecheck
2. Domain and content
   - 목표 추천, 카테고리, 세션 셔플, 진도 모델, 39개 샘플
   - AI-native prompt/schema, versioned golden set, deterministic content grader
   - Gate: domain regression tests, content integrity tests, `npm run eval` 100%
3. User experience
   - 학습 홈, 질문 카드, 용어집, 기록, 비활성 광고 구좌, standalone PWA
   - Gate: component interaction tests and responsive browser inspection
4. Delivery
   - README, architecture/conventions, verification packet
   - Gate: Biome CI, typecheck, tests, AI eval, Vite + `.ait` build, final diff and secret scan

## Bounded fix loop

각 검증 실패는 원인 분류 → 최소 수정 → 관련 검증 재실행으로 처리하며 동일 단계에서 최대 3회 반복한다. 해결되지 않으면 verification 문서에 조건부 또는 no-go로 기록한다.

## Approval boundary

로컬 저장소 생성과 구현은 사용자 요청 범위다. 앱인토스 콘솔 등록, 실제 배포, 광고 SDK 활성화, 결제 및 외부 공개는 별도 승인을 받기 전 수행하지 않는다.
