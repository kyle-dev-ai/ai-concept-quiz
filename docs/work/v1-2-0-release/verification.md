# v1.2.0 release verification

- Date: 2026-08-30 (Asia/Seoul)
- Target: `v1.2.0`
- Runtime: Node.js `25.6.1`, npm `11.9.0`
- Dataset: `1.10.0`
- Verdict: **CONDITIONAL GO**

저장소 기준 release candidate는 통과했고 번들은 2026-08-30에 Apps in Toss로 업로드까지 완료했다. 심사 요청은 콘솔 작업으로 남아 있다.

## Automated evidence

| Gate | Result | Evidence |
|---|---|---|
| Format and lint | PASS | Biome `148` files |
| Architecture | PASS | domain/platform import, export, CSS token boundaries |
| Type safety | PASS | strict TypeScript project build |
| Regression tests | PASS | `38` files, `174` tests |
| AI content eval | PASS | `204` questions, `104` golden cases, contract/golden/category `100%` |
| Content fingerprint | PASS | `073842bb11bd3c39e22317bc5530e9ee72e754efee9fbb051be3fad249a4abb7` |
| Content structure | PASS | baseline 대비 신규 결함 없음 |
| Answer length | PASS | `135`자 초과 `0`건 |
| Apps in Toss build | PASS | initial JS `89.64 KiB`, required JS `109.68 KiB`, CSS `12.56 KiB` gzip |
| Standalone build | PASS | initial/required JS `89.54 KiB`, CSS `12.56 KiB` gzip |
| Question asset | PASS | versioned JSON, `204` questions, `71.11 KiB` gzip; 지난 버전 은행 미포함 |
| Dependency audit | PASS | production dependencies `0 vulnerabilities` |
| Secret and diff scan | PASS | credential pattern 미검출, `git diff --check` 통과 |

## Artifact

- File: `ai-concept-quiz.ait`
- deployment ID: `01a051d3-37db-767b-bca1-c45ac7879920`
- Size: `372,269 bytes` (`363.54 KiB`)
- SHA-256: `97afd7bd832ef6ea0be9046b3b55d18815a60b516eff981a1c25168649c94be1`
- 스킴: `intoss-private://ai-concept-quiz?_deploymentId=01a051d3-37db-767b-bca1-c45ac7879920`
- 업로드 시각: 2026-08-30 (Asia/Seoul)

v1.1.0에서는 `ait deploy`가 아티팩트를 다시 만들어 디스크의 파일과 업로드본이 달랐지만, 이번에는 배포 응답의 deployment ID가 디스크 번들의 `bundle.json`과 일치해 같은 파일임을 확인했다. 검증에 쓴 아티팩트가 곧 올라간 아티팩트다.

업로드는 심사 요청이 아니다. 콘솔에서 이 deployment를 선택해 심사를 요청해야 한다.

## v1.1.0 대비 변경

- 콘텐츠: `200` → `204` 문항 (dataset `1.9.0` → `1.10.0`). 이미 다루던 개념을 잇는 네 문항으로, fine-tuning 종류 구분, 학습 루프 한 바퀴, AI에서 RAG·Agent까지의 포함 관계, 그래프 기반 agent 구성이다.
- 무음 모드(ADR 0012): 소리를 낼 수 없는 자리를 위해 마이크 없이 핵심 키워드를 적는 답변 방식. 유사도(%)는 보여주지 않고 핵심 포인트 적중만 세며, 최고·최근 유사도를 갱신하지 않는다.
- 답변 방식 전환을 학습 화면 안에 두고, 마이크 권한 거부·미지원 안내에서도 무음으로 전환할 수 있게 했다.
- 오늘의 10초 구술 카드가 오늘 완료 여부를 표시한다.

## 카테고리 분포

`math 23 · ml 29 · dl 28 · transformer 33 · llm 26 · rag 21 · agent 24 · ai-system 20`

## 남은 확인

- [ ] `204`개 질문의 사람 최종 검수. AI가 작성하고 AI가 재검토한 상태다.
- [ ] 마이크 권한과 음성 인식을 iOS/Android Sandbox 실기기에서 확인. v1.1.0에서 들어간 뒤 아직 실기기 검증 기록이 없다.
- [ ] 무음 모드가 마이크 권한 거부 상황에서 실제로 대안 경로로 동작하는지 실기기 확인.
- [ ] Sandbox에서 system/light/dark, VoiceOver/TalkBack, 200% text 확인.
- [ ] 서비스 전용 고객센터 email/contact 등록.
- [ ] Sentry project/DSN과 alert 설정.
- [ ] 콘솔에서 심사 요청. `ait` CLI는 업로드까지만 가능하다.
- [ ] 승인 후 `v1.2.0` tag 생성과 원격 push.

## 심사 메모

```
1. 학습 문항 200개 → 204개
2. 소리를 낼 수 없는 곳을 위한 무음 답변 모드 추가 (마이크 없이 핵심 키워드 입력)
3. 마이크 권한이 거부되어도 무음 모드로 학습을 이어갈 수 있게 개선
```
