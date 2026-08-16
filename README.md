# 어텐션! — AI Concept Quiz

AI 개념을 답부터 읽지 않고 10초 동안 내 말로 설명해보는 모바일 우선 학습 앱이다. Apps in Toss 출시를 1순위로 하되, 같은 React 앱을 로컬 브라우저와 standalone PWA에서도 사용할 수 있다.

현재 버전은 `1.0.0` MVP다. 서버, 로그인, 실시간 AI 호출, 광고 SDK 없이 39개의 검수 가능한 샘플 질문과 기기 내 진도만 사용한다.

## 핵심 경험

- 최초 한 화면에서 학습자 유형, 목표, 선택형 한 줄 목표를 설정한다.
- 대학원 진학, 이직, AI 기초, AI 실무 목표에 따라 추천 덱이 달라진다.
- 추천, 전체 랜덤 또는 Math/ML/DL/Transformer/LLM/RAG/Agent/AI System만 골라 학습한다.
- 답을 보기 전 소리 내어 설명하고 `알았다 / 애매했다 / 몰랐다`로 기록한다.
- 마스코트 `텐이`, 연속 학습, 5개 성장 레벨과 0–100 설명력 점수를 제공한다.
- 용어집 검색, 카테고리 필터, 약한 질문 다시 보기, 친구에게 문제 내기를 제공한다.

설명력 점수는 검토한 39개 질문 전체를 분모로 `알았다=1`, `애매했다=0.5`, `몰랐다=0`을 합산해 반올림한다. 시험·지능·절대 실력 점수가 아니라 이 기기에 기록된 학습 진도다.

## 기술 기준

- Node.js 24 LTS (`.nvmrc`, `.node-version`)
- React 19, TypeScript 6, Vite 8
- Apps in Toss Web Framework 3
- Biome 2 formatter/linter
- Vitest 4 + Testing Library
- standalone 전용 `vite-plugin-pwa`
- npm과 exact dependency versions

공식 TDS WebView template은 현재 React 18 범위를 사용하므로 MVP는 React 19와 자체 design tokens를 사용한다. TDS가 React 19를 공식 지원할 때 UI adapter 계층에서 다시 평가한다.

## 시작하기

```bash
nvm use
npm ci
npm run dev
```

개발 컴퓨터와 같은 Wi-Fi의 휴대폰에서 임시로 확인하려면 다음을 실행하고 터미널에 표시된 LAN 주소로 접속한다.

```bash
npm run dev:phone
```

LAN 개발 서버에는 도메인이 필요 없다. 집 밖에서도 계속 사용하거나 홈 화면 설치를 검증하려면 `npm run build:standalone`의 `dist-standalone/`을 HTTPS 정적 호스팅에 올려야 한다. 처음에는 hosting provider의 무료 subdomain이면 충분하고 custom domain은 필수가 아니다.

## 프로파일과 저장 위치

| 프로파일 | 용도 | 사용자 진도·설정 | 정적 콘텐츠 | 오프라인 |
|---|---|---|---|---|
| `local` | 개발·LAN 휴대폰 테스트 | browser `localStorage` | JS bundle | 개발 서버 의존 |
| `standalone` | 설치형 웹/PWA | browser `localStorage` | service worker cache | 첫 로드 뒤 지원 |
| `prd` | Apps in Toss | 공식 native `Storage` adapter | `.ait` bundle | 플랫폼 정책에 따름 |

현재 별도 DB는 없다. 질문은 앱 bundle에, 닉네임·목표·자기평가·학습일은 선택한 프로파일의 기기 저장소에만 남는다. 브라우저 site data, Toss 앱 또는 기기를 삭제하면 사라질 수 있고 기기 간 동기화되지 않는다.

환경값은 `.env.development`, `.env.standalone`, `.env.production`에 분리돼 있다. 광고 flag는 모든 MVP 프로파일에서 `false`다.

## 명령어

```bash
npm run check             # Biome format/lint gate
npm run typecheck         # TypeScript project check
npm run test              # domain, adapter, component regression tests
npm run eval              # content contract + golden-set release gate
npm run eval:fingerprint  # manifest/cases/corpus SHA-256
npm run build:standalone  # dist-standalone PWA
npm run build:web         # dist production web bundle
npm run build:ait         # Apps in Toss package
npm run verify            # check → types → tests → eval → web/.ait build
```

`npm run deploy`는 외부 배포이므로 명시적 승인 없이 실행하지 않는다.

## AI-native 개발 루프

AI는 런타임 비용 기능이 아니라 기획과 콘텐츠 운영의 기본 협업 방식부터 적용한다.

```text
interview/spec → versioned prompt → candidate → schema
       → deterministic eval → golden regression/challenge → human review → release
```

- 제품 원천 기준: `docs/specs/`, `CONTEXT.md`, `docs/adr/`
- AI 출력 계약: `schemas/study-question.v1.schema.json`
- versioned 작성 prompt: `prompts/question-authoring.v1.md`
- 앱에 들어가는 검수 corpus: `src/content/sample-questions.ts`
- 독립 평가 기준: `assets/evals/eval-manifest.v1.json`, `golden-set.v1.jsonl`
- deterministic grader: `src/evaluation/content-evaluator.ts`

AI가 만든 JSON array 후보를 앱에 넣기 전에 다음처럼 같은 하네스로 검증할 수 있다.

```bash
npm run eval -- --candidate path/to/candidate.json
```

AI 출력은 candidate일 뿐 사실의 원천이 아니다. 100% gate와 사람 domain review를 모두 통과해야 corpus에 반영한다. 세부 운영 규칙은 [AI-native operating model](docs/ai-native/operating-model.md)에 있다.

## 아키텍처

```text
src/app                  composition root, runtime config
src/domain/learning      순수 목표·세션·진도·점수 규칙
src/application/ports    content/storage/share/telemetry 계약
src/content              현재 static repository와 검수 질문
src/evaluation           provider-neutral deterministic graders
src/features             onboarding/study/library/progress/ad UI
src/shared               storage·telemetry adapters와 공용 UI
assets/evals             versioned golden suites
schemas / prompts        AI candidate contract와 작성 정책
docs                     spec, ADR, roadmap, release evidence
```

도메인은 React, browser API, Apps SDK를 import하지 않는다. 콘텐츠 API, native storage, remote telemetry, 광고 provider는 port/adapter 경계 뒤에서 교체한다. 지금 필요하지 않은 backend나 범용 framework는 넣지 않았다.

## 콘텐츠 추가

1. [작성 prompt](prompts/question-authoring.v1.md)와 사용자 source notes로 candidate JSON을 만든다.
2. `npm run eval -- --candidate ...`로 contract와 기존 golden claims를 검사한다.
3. [콘텐츠 검수표](docs/content/content-review-checklist.md)로 사실성·학습가치를 사람이 확인한다.
4. `src/content/sample-questions.ts`에 반영하고 필요한 regression/challenge case를 추가한다.
5. dataset version, changelog, tests를 갱신하고 `npm run verify`를 실행한다.

Notion은 Phase 1에서 작성 UI로 사용할 수 있지만 source of truth는 아니다. CSV export를 schema validation과 eval을 거쳐 generated corpus로 변환하는 방향이다.

## 문서

- [MVP specification](docs/specs/ai-concept-quiz-mvp.md)
- [Domain glossary](CONTEXT.md)
- [Architecture decisions](docs/adr/)
- [Product roadmap](docs/roadmap.md)
- [Observability plan](docs/observability.md)
- [Backlog](TODO.md)
- [Versioning](docs/release/versioning.md)
- [Release checklist](docs/release/release-checklist.md)
- [Current verification](docs/work/ai-concept-quiz-mvp/verification.md)

Apps in Toss 콘솔 등록, Sandbox 실기기 검증, static hosting, 광고 활성화, 원격 저장소 push는 아직 수행하지 않는다.
