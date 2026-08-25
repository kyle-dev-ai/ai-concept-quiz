# v1.1.0 release verification

- Date: 2026-08-26 (Asia/Seoul)
- Target: `v1.1.0`
- Runtime: Node.js `25.6.1`, npm `11.9.0`
- Dataset: `1.9.0`
- Verdict: **CONDITIONAL GO**

저장소 기준 release candidate는 통과했고 번들은 2026-08-26에 Apps in Toss로 **업로드까지 완료**했다. 다만 업로드는 심사 요청이 아니다. 콘솔에서 이 deployment를 선택해 심사를 요청해야 하며, 아래 "남은 확인"이 끝나야 공개 배포 `GO`가 된다.

v1.0.0은 2026-08-26 기준 심사를 통과해 출시된 상태이며, 이 릴리스는 그 위에 올리는 첫 갱신이다.

## Automated evidence

| Gate | Result | Evidence |
|---|---|---|
| Format and lint | PASS | Biome `142` files |
| Architecture | PASS | domain/platform import, export, CSS token boundaries |
| Type safety | PASS | strict TypeScript project build |
| Regression tests | PASS | `36` files, `161` tests |
| AI content eval | PASS | `200` questions, `100` golden cases, contract/golden/category `100%` |
| Content fingerprint | PASS | `4270017d1847a0de942ebd5ffea204739c68ad9d04a065ec2204dab79f97e0b5` |
| Content structure | PASS | baseline 대비 신규 결함 없음 |
| Apps in Toss build | PASS | initial JS `88.73 KiB`, required JS `108.77 KiB`, CSS `12.35 KiB` gzip |
| Standalone build | PASS | initial/required JS `88.62 KiB`, CSS `12.35 KiB` gzip |
| Question asset | PASS | versioned JSON, `200` questions, `69.67 KiB` gzip; 지난 버전 은행 미포함 |
| Platform isolation | PASS | standalone 번들에 `apps-in-toss` 참조 `0`건; production에는 native Storage 어댑터 포함 |
| Optional monitoring | PASS | Sentry chunk는 initial load와 standalone precache에서 제외 |
| Dependency audit | PASS | production dependencies `0 vulnerabilities` |
| Secret and diff scan | PASS | credential pattern 미검출, `git diff --check` 통과 |

`npm run verify`가 format, architecture, type, test, eval, content structure, dual build, budget을 한 번에 통과했다.

## Artifact

### 게이트 통과 시점의 로컬 빌드

- deployment ID: `01a0398c-dbc7-7ccd-a321-be5c0285385a`
- Size: `369,535 bytes`
- SHA-256: `4a7e6f0669359695c0de7d0b90a5bce9967aa3f0634282d56883fcb873dc4a68`

### 실제로 업로드된 번들

`ait deploy`는 업로드 전에 아티팩트를 다시 만들기 때문에 위 값과 일치하지 않는다.

- File: `ai-concept-quiz.ait`
- deployment ID: `01a0398e-67e8-7147-b0f6-fc2249ff0b29`
- Size: `369,537 bytes`
- SHA-256: `0d79bb79bb8b7a4b0e8f144fd4b822624e376eb045f6cbf84ef33757160a61eb`
- 스킴: `intoss-private://ai-concept-quiz?_deploymentId=01a0398e-67e8-7147-b0f6-fc2249ff0b29`
- 업로드 시각: 2026-08-26 (Asia/Seoul)

두 아티팩트는 같은 commit에서 나왔고 크기 차이 2바이트는 빌드마다 새로 발급되는 deployment ID 문자열 때문이다. 재현이 필요하면 commit을 기준으로 삼는다.

## v1.0.0 대비 변경 요약

- 콘텐츠: `137` → `200` 문항 (dataset `1.2.0` → `1.9.0`). 답변 길이 초과 `56`건을 모두 범위 안으로 줄였고, 내용은 `deepAnswer`로 옮겼다.
- 학습 흐름: 답 공개를 15초 카운트다운 뒤로 제한하고, 그동안 브라우저 음성 인식으로 받아적어 모범 답과의 유사도와 핵심 포인트 적중을 보여준다(ADR 0010).
- 재방문 장치: 연속 학습 계산 수정, 하루 목표 링, 학습 달력, 레벨업 축하, 앱 배지, 약점 덱(ADR 0011).
- 홈 화면: 시간대 인사와 오늘 상태에 따라 바뀌는 브리핑, 오늘의 명언.
- 설정: 카운트다운 소리 음소거 토글.
- 공유: 열 수 있는 HTTPS 주소가 생겨 `친구에게 문제 내기` 복구.

## 남은 확인

이 항목들은 저장소 밖 작업이라 자동 게이트로 대체할 수 없다.

- [ ] `200`개 질문의 사람 최종 검수. AI가 작성하고 AI가 재검토한 상태이며, 명백한 오류는 발견되지 않았으나 독립 검증은 아니다.
- [ ] 마이크 권한 안내와 음성 인식 동작을 iOS/Android Sandbox 실기기에서 확인. 이번 릴리스에서 새로 들어간 기능이라 우선순위가 높다.
- [ ] 음성 인식이 브라우저·OS에 따라 외부 서버를 거친다는 안내가 심사 기준의 개인정보 고지와 충돌하지 않는지 확인.
- [ ] Sandbox에서 system/light/dark, VoiceOver/TalkBack, 200% text 확인.
- [ ] 서비스 전용 고객센터 email/contact 등록.
- [ ] Sentry project/DSN과 alert 설정.
- [ ] 콘솔에서 이 deployment로 **심사 요청**. `ait` CLI에는 심사 요청 명령이 없고 업로드까지만 가능하다(`token`, `build`, `deploy`, `migrate`, `init`).
- [ ] 승인 후 `v1.1.0` tag 생성과 원격 push.

## 심사 메모 초안

콘솔 업로드 시 참고할 요약이다.

> v1.0.0 대비 학습 문항을 137개에서 200개로 늘리고, 답을 보기 전 15초 동안 소리 내어 설명하도록 하는 구술 연습 흐름을 추가했습니다. 이 과정에서 브라우저 내장 음성 인식으로 사용자의 발화를 받아적어 모범 답안과 비교한 결과를 보여줍니다. 전사 결과는 기기 밖으로 전송하거나 저장하지 않으며, 마이크를 사용하는 화면에서 인식 처리가 브라우저에 따라 외부 서버를 거칠 수 있다는 점을 안내합니다. 소리 안내는 설정에서 끌 수 있습니다.
