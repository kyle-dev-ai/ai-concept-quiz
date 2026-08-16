# ADR 0007: Device-aware light and dark appearance

- Status: Accepted
- Date: 2026-08-16

## Context

앱은 짧은 세션뿐 아니라 이동 중 반복 학습에도 쓰인다. 밝은 화면만 제공하면 야간 사용 피로가 커지고, 기기 설정만 강제하면 앱 안에서 즉시 바꾸고 싶은 사용자 요구를 충족하지 못한다. 설정 화면을 별도로 만들면 작은 MVP에서 발견성과 이동 비용이 나빠진다. 화면 모드는 개인정보나 학습 profile이 아니며 계정 동기화도 필요하지 않다.

## Decision

- 신규 사용자의 기본값은 밝은 학습 화면을 보장하는 `light`다. 사용자는 `dark` 또는 OS의 `prefers-color-scheme`을 따르는 `system`을 고를 수 있다.
- 44px touch target의 작은 전환 버튼을 모든 화면 우측 상단에 고정한다. 누르면 세 옵션만 있는 popover가 열리며 바깥 탭과 `Escape`로 닫힌다.
- preference는 `ThemePreferenceRepository` port로 저장한다. local/standalone은 `localStorage`, Apps in Toss production은 공식 native `Storage` adapter를 사용한다.
- 학습자 profile schema와 분리된 `attention-ai-theme-v1` key를 사용한다. 손상되거나 알 수 없는 값은 `system`으로 복구한다.
- `BrowserThemeController`가 실제 theme와 browser `theme-color`를 적용하고 system 설정 변경을 구독한다. listener는 재적용 또는 unmount 때 해제한다.
- dark theme은 순검정 대신 deep navy를 사용하고 page, raised surface, inverse card의 세 명도 단계를 둔다. 브랜드의 blue, lime, technical notebook 표현은 유지하되 lime 위 foreground는 theme과 무관한 `on-lime` token으로 고정한다.
- 홈의 level, profile, appearance control은 같은 44px touch target과 상단 기준선에 맞춘다.
- 동적 진행률은 native `progress` 요소로 표현하고 runtime inline style을 제거해 strict Content Security Policy와 함께 동작하게 한다.

## Consequences

- 온보딩, 학습, 완료, 오류 화면을 포함해 별도 이동 없이 화면 모드를 바꿀 수 있다.
- 명시한 선택은 해당 channel의 기기에 유지되지만 Apps in Toss와 standalone 사이에는 동기화되지 않는다.
- system을 고른 사용자는 OS 변경을 즉시 따라가며, `prefers-reduced-motion` 사용자는 popover와 색 전환 animation을 거의 보지 않는다.
- iOS/Android WebView의 고대비·동적 글자 크기·실제 browser chrome 색은 Sandbox 실기기에서 최종 확인해야 한다.
