# MVP release hardening verification

- Date: 2026-08-16 (Asia/Seoul)
- Target: `v1.0.0`
- Runtime: Node.js `24.18.1`, npm `11.9.0`
- Dataset: `1.1.0`
- Verdict: **CONDITIONAL GO**

저장소 기준 release candidate는 통과했다. Apps in Toss upload·심사 요청은 아직 하지 않았으며 아래의 사람 콘텐츠 검수, 콘솔 metadata, 정책 확인과 iOS/Android Sandbox 검증이 끝나야 공개 출시 `GO`로 바뀐다.

## Automated evidence

| Gate | Result | Evidence |
|---|---|---|
| Format and lint | PASS | Biome `104` files |
| Architecture | PASS | domain/platform import, export, CSS token boundaries |
| Type safety | PASS | strict TypeScript project build |
| Regression tests | PASS | `23` files, `65` tests |
| AI content eval | PASS | `127` questions, `27` golden cases, contract/golden/category `100%` |
| Content fingerprint | PASS | `47bc25c0d7a370050140518b0d5f0a0e29cde1559efa6697d5047938562c480e` |
| Apps in Toss build | PASS | initial JS `74.44 KiB`, required JS `94.55 KiB`, CSS `9.53 KiB` gzip |
| Standalone build | PASS | initial/required JS `74.32 KiB`, CSS `9.53 KiB` gzip |
| Question asset | PASS | versioned JSON, `127` questions, `41.22 KiB` gzip; standalone precache 포함 |
| Platform isolation | PASS | standalone에 Apps SDK 없음; production에는 native Storage SDK 있음 |
| Optional monitoring | PASS | Sentry chunk는 initial load와 standalone precache에서 제외 |
| Dependency audit | PASS | production dependencies `0 vulnerabilities` |
| Secret and diff scan | PASS | credential pattern 미검출, `git diff --check` 통과 |

`npm run verify`가 위 format, architecture, type, test, eval, dual build와 budget을 한 번에 통과했다.

## Artifact

- File: `ai-concept-quiz.ait`
- deployment ID: `01a00a2d-7575-7c1c-bf24-13e1ae468e69`
- Size: `321,456 bytes` (`313.92 KiB`)
- SHA-256: `962ca951433ed6a82bdb1aa913dbfa7a713fa69c4c06c83e591a4c39bdda360b`

이 ID는 local build artifact 식별자다. console upload나 deploy가 수행됐다는 뜻이 아니다.

## Browser and mobile-layout evidence

Local Chromium production preview에서 다음을 확인했다.

- Fresh storage에서 light가 기본이고 appearance 메뉴 순서는 light, dark, system이다.
- 첫 진입 후 `0/127 설명 가능`, Math `20`, ML `21`, DL `16`, Transformer `19`, LLM `17`, RAG `13`, Agent `12`, AI System `9`가 표시된다.
- versioned question asset 요청은 `200 OK`이고 console error와 warning은 `0`이다.
- 네 navigation tap은 각각 `learn`, `library`, `progress`, `profile`로 이동한다.
- 390×844 drag 중 liquid indicator가 연속 위치를 반영하고 release한 tab으로 이동한다. 이후 일반 tap도 정상이다.
- 320×568에서 네 화면 모두 horizontal overflow가 `0`이고 floating dock은 viewport 안에 유지된다.
- dark mode의 hero, question card, route panel, dock 경계와 lime foreground를 시각 확인했다.
- service worker가 page를 제어한 뒤 offline reload에서도 `0/127` 화면과 question asset을 제공했다.

QA 중 navigation container가 pointer down 즉시 capture해 일반 tap을 삼키는 regression을 발견했다. Capture 시점을 실제 8px drag가 시작된 뒤로 옮기고 component test와 browser tap/drag 회귀를 다시 통과했다.

## Performance and memory proxy

- 127개 질문은 initial JavaScript에서 분리한 versioned JSON asset이며 browser cache를 우선 사용한다.
- initial Apps JavaScript는 콘텐츠 분리 전 `115.44 KiB`에서 `74.44 KiB` gzip으로 감소했다.
- Local Chromium에서 warm-up 뒤 30회 네-tab cycle과 forced GC의 heap delta는 `+290,469 bytes`, 이어진 30회 cycle은 `+98,908 bytes`였다.
- DOM node count는 두 측정 모두 `70`으로 유지됐고 horizontal overflow는 `0`이었다.

이는 desktop Chromium proxy라 메모리 leak 정황이 없다는 증거일 뿐, Apps in Toss iOS/Android WebView의 FPS·memory 보장은 아니다. 실제 console metric은 첫 Sandbox build의 release baseline으로 남긴다.

## Conditions before public release

1. 127개 문항을 사람이 사실, 수식, 난이도, 한국어 표현 기준으로 전수 검수한다.
2. Apps console에서 `appName`, display name, icon, primary color와 고객센터 contact를 확정한다.
3. 최신 비게임·개인정보·공유·수익형 교육 서비스 정책과 사업자·정산 조건을 확인한다.
4. Sandbox App의 iOS와 Android에서 핵심 flow, native Storage, light/dark/system, VoiceOver/TalkBack와 200% text를 확인한다.
5. Sentry를 켤 경우 DSN, email alert, privacy-safe test error와 source map upload를 credential 보유 환경에서 확인한다.
6. Standalone을 공개할 경우 HTTPS host의 cache와 security response headers, SPA fallback, offline install을 확인한다.

## Approval boundary and rollback

- Git tag, push, hosting deploy, Apps upload·review·release는 수행하지 않았다.
- Apps release 문제 시 직전 승인 artifact로 rollback하고 새 dataset 문제는 stable question ID를 제거 또는 수정한 patch version으로 재평가한다.
- Standalone 문제 시 이전 immutable build로 되돌리고 versioned question asset은 해당 build와 함께 승격하거나 rollback한다.
