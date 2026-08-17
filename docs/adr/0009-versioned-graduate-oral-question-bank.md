# ADR 0009: Versioned graduate oral question bank

- Status: Accepted
- Date: 2026-08-16

## Context

39개 질문은 UI와 local progress를 검증하기에는 충분했지만 8~11월 대학원 준비 로드맵을 반복 학습하기에는 범위가 좁았다. 사용자는 연세대학교 인공지능융합대학원 진학을 우선 목표로 하면서 고려대학교와 성균관대학교의 공개 면접 회고도 참고한 종합 구술 덱을 원한다. 학교는 실제 평가 문항을 공식 공개하지 않으며 개인 후기는 시기·지원자·전공에 따라 달라진다.

## Decision

- Dataset `1.5.0`은 8개 category의 185개 정적 Q&A로 구성한다.
- 사용자 Notion의 `2026.08`과 `2026 Plan`을 학습 범위의 원천으로 삼는다.
- 최근 학교 공식 페이지는 전형 방식과 curriculum 확인에만 사용한다.
- 공개된 1인칭 후기는 반복되는 topic과 질문 깊이의 참고 신호로만 사용한다.
- 문항을 특정 학교의 `기출`로 표시하지 않고 `대학원 구술 대비`로 제공한다.
- 대학원 목표 추천에는 Math, ML, DL, Transformer, LLM, RAG, Agent, AI System 전체를 포함한다.
- 모든 문항은 10초 답변, 심화 답변, 핵심 포인트, 꼬리질문, prerequisite를 갖는다.
- 핵심 수식·오개념·프로젝트 방어 문항은 golden set에 고정하고 dataset fingerprint를 release evidence에 남긴다.
- Typed TypeScript corpus에서 versioned JSON asset을 build-time에 생성하고 앱은 이를 lazy fetch한다. Asset은 브라우저 cache와 standalone service worker에서 재사용하되 filename에 dataset version을 넣어 stale cache를 막는다.

## Consequences

- 한 기기의 기존 진도는 stable question ID 기준으로 유지되지만 전체 분모가 39에서 185로 늘어 mastery score가 낮아질 수 있다.
- 공개 후기와 deterministic string grader는 사실 검수와 실제 출제 가능성을 보장하지 않는다.
- 출시 전 사람 검수자는 수학 기호, 조건, model별 예외와 한국어 표현을 185개 전체에서 확인해야 한다.
- 이후 콘텐츠 수정은 dataset version과 changelog를 올리고 동일 golden regression을 통과해야 한다.
- 질문 본문을 initial JavaScript와 분리해 WebView parse 비용을 낮추지만 첫 실행에는 local asset fetch가 추가되므로 bootstrap 오류와 runtime schema를 검증한다.
