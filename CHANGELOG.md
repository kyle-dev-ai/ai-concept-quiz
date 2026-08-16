# Changelog

이 프로젝트의 주목할 변경사항을 기록합니다. 형식은 Keep a Changelog를 따르고 버전은 Semantic Versioning을 사용합니다.

## [Unreleased]

- Apps in Toss 콘솔 등록과 샌드박스 기기 검증
- 최종 appName, icon URL, 공개 정책 확인
- Dataset `1.2.0`: 대학원 구술 공백 보강 10문항(CNN·pooling, LSTM, MLE/MAP,
  logistic regression, SVM, tree ensemble, kNN, VAE, diffusion)과 질문별 golden case,
  기존 문항 정밀도 수정 6건
- 심사 대비: 비게임 가이드에 따라 pinch zoom 비활성화, 공유 버튼은 열 수 있는
  링크가 생길 때까지 숨김(코드 주석으로 보존)

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
