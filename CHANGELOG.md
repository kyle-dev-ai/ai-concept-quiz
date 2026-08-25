# Changelog

이 프로젝트의 주목할 변경사항을 기록합니다. 형식은 Keep a Changelog를 따르고 버전은 Semantic Versioning을 사용합니다.

## [Unreleased]

## [1.1.0] - 2026-08-26

- Dataset `1.9.0`: 8/22~23 학습 계획에서 비어 있던 두 문항을 추가해 200문항.
  `transformer-token-id-one-hot`은 Token ID와 one-hot의 관계, 그리고 실제 구현이 왜
  행 조회인지를 다룬다. `transformer-why-decoder-only`는 GPT가 왜 encoder 없이
  decoder-only를 택했는지를 정면으로 묻는다. 둘 다 골든 케이스를 함께 추가했다.

- 답변 길이 정리: 198문항 중 135자를 넘던 56개를 모두 범위 안으로 줄였다(평균 116자).
  "10초 핵심 답변"이라는 라벨과 15초 카운트다운에 맞지 않던 최장 195자 문항이 있었다.
  내용은 버리지 않고 deepAnswer로 옮겼고, 골든 케이스가 잡아낸 누락 6건은 원래 표현을
  되살려 기대값을 그대로 유지했다. PCA 문항에는 빠져 있던 중심화 단계를 넣었다.

- standalone HTTPS 배포: GitHub Pages project site(`kyle-dev-ai.github.io/ai-concept-quiz/`).
  하위 경로 배포라 `APP_BASE_PATH`로 base를 넘겨 빌드하며, PWA manifest icon과 workbox
  navigateFallback이 이 값을 따라간다. 서비스워커에 `clientsClaim`을 켜 새 배포가
  즉시 적용되게 했다. 자세한 절차는 `docs/deployment/dual-delivery.md`.

- 구술 강제와 발화 채점(ADR 0010): 답 공개를 15초 카운트다운 뒤로 막고, 그동안 브라우저
  음성 인식으로 받아적어 모범 답과의 유사도(글자 2-gram Dice)와 핵심 포인트 적중을 보여준다.
  마지막 5초는 색이 짙어지고 소리로 초를 센다. 소리는 설정에서 끌 수 있다.
  발화 기록(최고·최근 유사도, 놓친 핵심 포인트)을 저장해 기록 경신, 약점 덱,
  도서관 추이에 쓴다.

- 재방문 장치(ADR 0011): 아침마다 0으로 보이던 연속 학습 계산을 고치고, 하루 목표 5문항
  진행 링, 불꽃 연속 기록, 최근 70일 학습 달력, 레벨업 전체화면 축하를 추가했다.
  세션 완료 화면이 연속 일수·다음 복습량·평균 유사도·기록 경신 수를 알린다.
  밀린 복습 수를 설치된 앱 아이콘 배지에 올린다. 레벨 경계를 0/4/12/30/60으로 바꿔
  첫 레벨업이 한 세션 안에 나오게 했다.

- 공유 버튼 복구: 열 수 있는 HTTPS 주소가 생겨 `친구에게 문제 내기`를 다시 켰다.

- 간격 반복: 자기평가와 누적 복습 횟수로 다음 복습 시점을 정하고, 때가 된 문항을
  세션 앞에 배치한다. 몰랐다 1일 · 애매했다 3~5일 · 알았다 7·21·60일로 늘어나며
  복습이 세션의 60%를 넘지 않게 해 새 문항도 계속 만난다. 홈 버튼에 복습 개수를 표시한다.

- Apps in Toss 콘솔 등록과 샌드박스 기기 검증
- 최종 appName, icon URL, 공개 정책 확인
- Dataset `1.2.0`: 대학원 구술 공백 보강 10문항(CNN·pooling, LSTM, MLE/MAP,
  logistic regression, SVM, tree ensemble, kNN, VAE, diffusion)과 질문별 golden case,
  기존 문항 정밀도 수정 6건
- 심사 대비: 비게임 가이드에 따라 pinch zoom 비활성화, 공유 버튼은 열 수 있는
  링크가 생길 때까지 숨김(코드 주석으로 보존)
- Dataset `1.3.0`: AI 실무 공통 개념 25문항 추가(임베딩·검색 5, 에이전트 메모리·도구 7,
  LLM 추론·설계 5, 평가·관측성 8)과 질문별 golden case 25개. 총 162문항.
  회사·프로젝트 종속 정보와 인프라 실무 문항은 앱에 반영하지 않았다.
- Dataset `1.4.0`: 학습 노트 대조 후 공백 12문항 추가 — 최적화·학습 운영(early stopping,
  AdamW, 학습률 스케줄, momentum, gradient clipping), 표현 학습과 전이학습,
  최적화 이론(convexity·안장점)과 중심극한정리, 전처리(feature scaling, augmentation,
  차원 축소 비교). 질문별 golden case 12개. 총 174문항.
- Dataset `1.5.0`: Transformer 원서 구간 선행 보강 11문항 — 원 논문(층당 복잡도 비교,
  padding mask, weight tying, label smoothing, dropout 위치)과 현대 구조(GQA·MQA,
  FlashAttention, MoE, RMSNorm, sliding window attention, scaling law).
  질문별 golden case 11개. 총 185문항.
- Dataset `1.6.0`: AI System 기초 3문항 추가 — 일반 API와의 구조적 차이, 토큰이 비용·지연의
  공통 단위, 비결정적 출력의 테스트 전략. 이 카테고리에 기초 문항이 없어 진입로가 없던 문제를
  해소했다. 질문별 golden case 3개. 총 188문항.
- 검수 반영: 사실 오류 8건 수정(요약 재귀 인과 역전, convex 최소점, CFG 역할, 임베딩
  정규화 동치 조건, label smoothing calibration 방향, MoE 파라미터 범위, weight tying
  절감량, 초선형 비용 메커니즘)
- 학습 경로 수정: `ai-basics` 추천 카테고리를 agent에서 ai-system으로 교체해 입문자 덱의
  도달 불가 선수 참조를 제거, `career-switch`에 transformer 추가, 직장인 추천 난이도에서
  advanced 제거, 세션 상한 25문항 도입
- Dataset `1.7.0`: 기초 진입로 9문항 추가 — 도구 호출, agent loop, 도구가 필요한 이유,
  벡터 검색, chunk, 출처 표시, attention 직관, 문맥에 따른 표현, 환각이 생기는 이유.
  선수 그래프 4건을 함께 정리해 입문자 덱의 도달 불가 선수를 0건으로 만들고 `ai-basics`에
  agent를 복원했다. 총 197문항.
- Dataset `1.8.0`: 기초 9문항 자체 검수 반영 — attention 비중이 학습 파라미터로 읽히던 서술과
  도구 실행 주체 정정, Agent 정의 문항 신설(기존 198문항 어디에도 없었다), 진입 사슬 순서 교정.
  총 198문항.
- 검수 자동화: `npm run check:content`를 신설해 `verify`에 편입했다. 카테고리 진입로 부재,
  추천 덱의 도달 불가 선수, 난이도 역전, 골든 케이스 없는 문항이 baseline보다 늘면 빌드가
  실패한다. 오늘 검수에서 나온 구조 결함이 다시 들어오지 못하게 하는 장치다.

## [1.0.0] - 2026-08-16

### Added

- 목표·학습자 유형 기반 추천
- 8개 카테고리와 137개 AI 구술 Q&A, 대학원 구술 전체 추천 덱
- 전체 랜덤 및 카테고리별 학습
- 답 공개와 3단계 자기평가, 기기 내 진도
- 마스코트, 0–100 설명력 점수, 5단계 level guide와 연속 학습 기록
- 용어집 검색·필터, 약한 질문 다시 보기, 친구에게 문제 내기
- local, standalone PWA, Apps in Toss production 프로파일
- 광고·콘텐츠·저장소·telemetry adapter 경계
- opt-in Sentry error adapter, privacy scrubber와 client incident runbook
- build-time browser/Toss storage adapter와 dual-delivery bundle budget
- copyright/version footer와 Apps in Toss support/ads policy checklist
- versioned prompt·schema·golden set과 deterministic AI 콘텐츠 평가 gate
- responsive browser QA와 로컬 release verification packet
- 모든 화면의 system/light/dark 전환, 기기별 preference 저장과 deep navy dark palette
- 첫 선택 신호, 답 공개, 자기평가 저장 상태를 보여주는 짧은 microinteraction
- production/standalone strict Content Security Policy와 native progress semantics
- 학습·용어집·기록·프로필 4개 탭과 이동하는 floating glass navigation
- dock 내부 손가락 drag preview와 release navigation
- 6개 광고 placement, provider port와 실패·No Fill 자동 collapse contract
- Notion 학습 로드맵과 공개 입시 자료 provenance, 27개 golden regression case

### Fixed

- onboarding 저장 성공 전에 화면이 전환될 수 있던 문제
- 자기평가·목표 저장 실패가 성공처럼 보이던 문제
- browser storage가 없을 때 write를 조용히 무시하던 문제
- standalone이 사용하지 않는 Apps in Toss SDK를 생성·precache하던 문제
- TypeScript strict/noUncheckedIndexedAccess가 repository 규칙과 달리 꺼져 있던 문제
- 화면 전환 뒤 이전 scroll 위치가 남던 문제
- 짧은 모바일 화면에서 답 공개 CTA가 initial viewport 아래로 밀리던 문제
- level dialog의 keyboard focus trap, Escape close, focus restore 누락
- viewport 확대 차단과 공유 URL query/hash 노출 가능성
- 손상되거나 과도한 profile/progress payload의 runtime validation 누락
- dark theme에서 패널 경계와 lime surface 위 글자가 흐리던 문제
- 홈의 level, profile, appearance control 상단 기준선이 어긋나던 문제
- 학습·용어집·기록의 영문 display headline 크기와 농도가 서로 달랐던 문제
- 신규 사용자의 화면 모드 기본값과 메뉴 순서가 의도와 달랐던 문제
