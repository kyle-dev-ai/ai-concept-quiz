# Visual direction: 구술 카드 덱

## Subject and single job

- Subject: 대학원 구술과 AI 면접을 준비하는 개발자의 개념 카드 덱
- Audience: 구현 경험은 있지만 이론을 자기 말로 설명하는 연습이 필요한 개발자
- Single job: 한 질문을 먼저 말로 설명한 뒤 정답과 비교하고 이해도를 남기게 한다.

## Token sketch

- `Ink` `#172033`: 긴 설명을 안정적으로 읽는 짙은 남색
- `Study blue` `#2457F5`: 선택과 진행을 표시하는 주 색상
- `Recall lime` `#C8F36A`: 답을 공개한 순간에만 쓰는 기억 신호
- `Cool paper` `#F4F7FC`: 긴 학습에서도 눈이 덜 피로한 배경
- `White card` `#FFFFFF`: 질문과 답의 명확한 층
- `Rule` `#DCE3EF`: 개념 구조와 카드 경계를 나타내는 선

Typography roles:

- Korean/body: `Pretendard Variable`, `Pretendard`, Apple system sans — 모바일 한글 가독성 우선
- Terms/data: `ui-monospace`, `SFMono-Regular` — 수식·영문 용어·진도 수치를 학습 도구처럼 표시
- Display: `Bradley Hand`, `Segoe Print`, system cursive fallback — onboarding·home·library·progress의 짧은 영문 문장에만 사용하고 별도 웹폰트 요청은 하지 않음

## Layout concept

```text
┌──────────────────────────┐
│ 어텐션!       LV2 ⓘ  ◉  │
│                          │
│ Can you                  │
│ explain it?        ●─●   │
│                          │
│ [대학원] [이직] [실무]   │
│ ┌ 추천 학습 경로 ──────┐ │
│ │ Math → ML → DL → Tr │ │
│ └─────────────────────┘ │
│                          │
│ [추천] [전체] [ML] [DL]  │
│ ┌ 오늘의 구술 카드 ───┐ │
│ │ Q. 왜 √dₖ로 나누나? │ │
│ │      생각하고 답 보기│ │
│ └─────────────────────┘ │
│   학습    용어집    기록 │
└──────────────────────────┘
```

## Signature

질문 카드 오른쪽 위의 작은 `개념 경로(node line)`가 답 공개 전에는 비어 있고 공개 후 recall lime으로 연결된다. 장식이 아니라 “전제 → 핵심 개념 → 응용”이 연결됐다는 학습 상태를 표현한다.

홈 headline은 영문 필기체를 먹색 watermark처럼 사용해 한글 본문 계층과 분리한다. 프로필 왼쪽의 `LVn ⓘ`를 누르면 5단계 점수 구간을 bottom sheet에서 확인한다.

## Self-critique before build

- 흔한 보라색 AI 그라데이션과 유리 카드 스타일은 이 학습 목적과 관련이 없어 제외한다.
- lime은 전 화면 accent가 아니라 답 공개의 한 순간에만 써서 의미를 유지한다.
- 홈의 숫자는 장식용 성과 지표가 아니라 실제 저장된 이해 문항 수만 표시한다.
- 애니메이션은 답 공개 한 번과 화면 전환에만 쓰며 reduced motion에서는 제거한다.
