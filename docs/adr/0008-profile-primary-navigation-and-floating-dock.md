# ADR 0008: Profile as primary navigation and a floating dock

- Status: Accepted
- Date: 2026-08-16

## Context

홈 상단에 level, profile, appearance action이 함께 있어 작은 화면에서 책임이 섞였다. profile button은 저장 action처럼 보일 수 있었고, 기록 화면 하단의 설정 card와도 중복됐다. 사용자는 학습, 용어집, 기록과 같은 수준에서 내 설정을 찾고 싶어 한다.

## Decision

- primary navigation을 `학습`, `용어집`, `기록`, `프로필` 네 destination으로 둔다.
- 홈 상단에서는 profile action을 제거하고 level과 appearance만 같은 44px 기준선에 둔다.
- 프로필은 닉네임, 학습자 유형, 학습 목표와 추천 흐름을 먼저 읽는 화면이다. 수정은 명시적인 `학습 설정 변경` button을 눌러 기존 검증·저장 form으로 들어간다.
- 편집을 저장하면 프로필 tab으로 돌아오고, 취소하면 기존 profile을 보존한다.
- 하단 navigation은 한 장의 floating glass surface와 한 개의 이동 indicator를 사용한다. icon은 같은 20px SVG stroke 규칙을 사용한다.
- dock 안에서 pointer를 좌우로 drag하면 indicator가 가장 가까운 destination을 preview하고 release 시 이동한다. click과 keyboard activation은 기존 button semantics를 유지한다.
- indicator 이동과 blur는 기능 이해를 돕는 한 레이어로 제한하며 `prefers-reduced-motion`에서는 즉시 전환한다.

## Consequences

- profile 발견성과 정보 구조는 좋아지지만 bottom navigation 한 칸의 폭은 줄어든다.
- 320px에서 네 label과 44px 이상 touch target, horizontal overflow를 release regression으로 확인해야 한다.
- backdrop filter를 지원하지 않는 WebView에서도 semantic surface 색이 fallback으로 남는다.
