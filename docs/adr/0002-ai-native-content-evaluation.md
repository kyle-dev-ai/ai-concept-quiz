# ADR 0002: AI-native content development and evaluation

- Status: Accepted
- Date: 2026-08-16

## Context

MVP는 비용과 latency를 피하기 위해 사용자 런타임에서 LLM을 호출하지 않는다. 그러나 콘텐츠가 AI 도움으로 빠르게 늘어날 예정이고, 잘못된 설명이 학습 앱의 핵심 신뢰를 훼손할 수 있다. 대화에서 만든 초안을 곧바로 정적 데이터에 붙이는 방식은 출처, 변경 이유, 회귀 기준과 승인 상태를 남기기 어렵다.

## Decision

프로젝트 운영의 원천 기준을 spec과 ADR로 두고, AI 생성물은 항상 candidate로 취급한다.

- 학습 질문 출력은 versioned JSON Schema와 TypeScript domain contract를 따른다.
- 작성 지시는 versioned prompt로 저장한다.
- 앱 corpus와 독립적인 versioned golden set을 둔다.
- 전체 corpus contract와 핵심 주장·오개념을 deterministic grader로 검사한다.
- `npm run eval`을 release verification gate에 포함한다.
- fingerprint는 manifest, golden cases, candidate corpus를 함께 hash한다.
- 의미적 사실성은 사람 domain review를 필수로 하며, 현재 LLM judge는 사용하지 않는다.
- 실제 사용자 데이터와 sequestered holdout은 동의·접근 제어 정책 전까지 저장소에 넣지 않는다.

## Consequences

- 런타임 API 비용 없이도 AI-assisted content 운영과 회귀 검증을 시작할 수 있다.
- schema, prompt, dataset, grader 변경이 코드 리뷰 가능한 이력으로 남는다.
- 문자열 기반 grader는 모든 의미 오류를 잡지 못하므로 사람 검수를 대체하지 않는다.
- 향후 자유서술 AI feedback에는 반복 trial, trace, semantic grader calibration, provider/error 분리가 추가로 필요하다.
