# Release checklist

Target: `v1.0.0`

## Product

- [ ] 39개 Q&A 내용과 난이도 검수
- [x] 첫 진입, 목표 변경, 카테고리 학습, 용어집, 기록 흐름 확인
- [ ] 빈 상태·저장소 실패·오프라인 상태 확인
- [x] 광고 기능 플래그가 꺼져 있고 광고 SDK/ID가 없는지 확인

## Apps in Toss

- [ ] 콘솔에서 최종 `appName` 사용 가능 여부 확인
- [ ] `displayName`, icon URL, primary color를 콘솔과 config에 동일하게 반영
- [ ] 비게임 출시·개인정보·접근성·공유 정책 확인
- [ ] Sandbox App에서 iOS/Android 주요 화면 확인
- [x] `.ait` 산출물 업로드 전 SHA와 version 기록

## Standalone/PWA

- [ ] HTTPS preview URL에서 설치 가능 여부 확인
- [ ] 첫 접속 후 비행기 모드 재실행 확인
- [ ] iOS 홈 화면 추가와 Android 설치 확인
- [ ] custom domain은 보류하고 provider subdomain 사용

## Engineering

```bash
npm run check
npm run typecheck
npm run test
npm run eval
npm run build:standalone
npm run build
npm audit --omit=dev
```

- [ ] ErrorBoundary와 오류 recovery 확인
- [x] secret/PII scan 및 final diff review
- [x] `docs/work/ai-concept-quiz-mvp/verification.md`를 실제 결과로 갱신
- [x] CHANGELOG의 `Unreleased` 항목 정리

## Approval-gated actions

- [ ] Git tag `v1.0.0`
- [ ] 원격 저장소 push/release 생성
- [ ] Apps in Toss 콘솔 upload/deploy
- [ ] static hosting deploy
