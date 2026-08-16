# Changelog

이 프로젝트의 주목할 변경사항을 기록합니다. 형식은 Keep a Changelog를 따르고 버전은 Semantic Versioning을 사용합니다.

## [Unreleased]

- Apps in Toss 콘솔 등록과 샌드박스 기기 검증
- 최종 appName, icon URL, 공개 정책 확인

## [1.0.0] - 2026-08-16

### Added

- 목표·학습자 유형 기반 추천
- 8개 카테고리와 39개 AI 구술 Q&A
- 전체 랜덤 및 카테고리별 학습
- 답 공개와 3단계 자기평가, 기기 내 진도
- 마스코트, 0–100 설명력 점수, 5단계 level guide와 연속 학습 기록
- 용어집 검색·필터, 약한 질문 다시 보기, 친구에게 문제 내기
- local, standalone PWA, Apps in Toss production 프로파일
- 광고·콘텐츠·저장소·telemetry adapter 경계
- versioned prompt·schema·golden set과 deterministic AI 콘텐츠 평가 gate
- responsive browser QA와 로컬 release verification packet

### Fixed

- onboarding 저장 성공 전에 화면이 전환될 수 있던 문제
- 화면 전환 뒤 이전 scroll 위치가 남던 문제
- 짧은 모바일 화면에서 답 공개 CTA가 initial viewport 아래로 밀리던 문제
- level dialog의 keyboard focus trap, Escape close, focus restore 누락
- viewport 확대 차단과 공유 URL query/hash 노출 가능성
- 손상되거나 과도한 profile/progress payload의 runtime validation 누락
