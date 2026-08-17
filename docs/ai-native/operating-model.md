# AI-native operating model

## 원칙

이 프로젝트에서 AI-native는 “모든 화면에서 LLM을 호출한다”는 뜻이 아니다. 제품 기획, 콘텐츠 작성, 검증, 릴리스가 처음부터 AI와 사람이 협업할 수 있는 명시적 계약과 평가 루프를 가진다는 뜻이다. MVP의 사용자 런타임은 빠르고 무료인 정적 콘텐츠로 유지한다.

원천 기준의 우선순위는 다음과 같다.

1. `docs/specs/` — 사용자의 문제, 제품 범위, 성공 조건
2. `docs/adr/` — 되돌리기 어렵거나 경계를 바꾸는 결정
3. `schemas/`와 `prompts/` — AI가 만들 수 있는 출력의 기계 계약과 작성 정책
4. `src/content/` — 앱에 실제 포함되는 검수 완료 candidate corpus
5. `assets/evals/` — candidate와 독립적으로 관리하는 회귀·오개념 기준
6. 검증 결과와 사람 승인 — 릴리스 여부를 정하는 최종 gate

AI가 생성한 초안이나 대화 기록 자체는 원천 기준이 아니다. 합의가 spec/ADR/schema에 반영되고 평가와 사람 검수를 통과해야 제품 사실이 된다.

## 개발 루프

```text
사용자 인터뷰 / 학습 로드맵
            ↓
      spec + domain terms
            ↓
  versioned authoring prompt
            ↓
   AI-generated candidate JSON
            ↓
 schema + deterministic graders
            ↓
 golden regression / challenge set
            ↓
       human domain review
            ↓
  bundled content + SemVer release
```

`/grill-with-docs`를 사용하는 세션에서는 한 번에 한 결정씩 인터뷰하고, 확정된 공통 용어는 저장소의 `CONTEXT.md`, 되돌리기 어려운 결정만 ADR에 기록한다. 기능 구현은 승인된 spec을 기준으로 한다.

## 현재 하네스

- Manifest: `assets/evals/eval-manifest.v1.json`
- Golden set: `assets/evals/golden-set.v1.jsonl`
- Candidate contract: `schemas/study-question.v1.schema.json`
- Deterministic grader: `src/evaluation/content-evaluator.ts`
- CLI gate: `npm run eval`
- Experiment fingerprint: `npm run eval:fingerprint`

현재 하네스는 188개 전체 질문의 구조, ID, 카테고리 범위, prerequisite 참조와 위험한 markup을 검사한다. 별도의 golden cases는 핵심 주장과 대표 오개념을 development, regression, challenge suite로 나눠 검사한다. 모든 gate는 100% 통과해야 한다.

현재는 모델을 호출하지 않으므로 trial은 결정론적 1회이며 `pass@1`과 `pass^1`이 같다. LLM 기반 자유서술 피드백이 추가되면 candidate/baseline을 같은 fingerprint로 반복 실행하고, provider error와 system failure를 분리하며, semantic judge는 사람 라벨로 calibration한 뒤에만 추가한다.

## 콘텐츠 변경 규칙

1. 학습 목표나 사용자 문제 변화는 spec부터 바꾼다.
2. 새 필드는 schema와 TypeScript domain contract를 함께 바꾼다.
3. AI 초안은 앱 콘텐츠에 직접 merge하지 않고 candidate JSON으로 저장해 `npm run eval -- --candidate <path>`로 검사한다.
4. 중요한 사실이나 자주 틀리는 설명은 golden case로 고정한다.
5. 오개념 회귀를 grader 완화로 숨기지 않는다. 기대값을 바꾸면 이유와 dataset version을 함께 기록한다.
6. 기술적 문구의 사실성은 사람이 검수한다. 코드 grader는 의미적 진실을 완전히 대체하지 않는다.
7. 실제 사용자 데이터는 동의·비식별화 정책 전까지 golden set에 넣지 않는다.

## 향후 확장 경계

- Notion은 작성 UI일 뿐 원천 데이터베이스가 아니다. export → schema validation → eval → review → generated content 순서로 반영한다.
- 외부 콘텐츠 API는 `QuestionRepository` adapter로, AI 피드백은 별도 application port와 server-side provider adapter로 추가한다.
- prompt, model, sampling, tool schema, retrieval snapshot, grader, dataset, locale을 experiment fingerprint에 넣는다.
- holdout은 앱 저장소에 공개하지 않는다. 런타임 AI 품질을 평가할 단계에서 별도 접근 제어 저장소로 운영한다.
- trace에는 필요한 진단 ID만 남기고 원문 설명과 개인정보는 기본 수집하지 않는다.
