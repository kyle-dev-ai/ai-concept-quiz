# Release checklist

Target: `v1.0.0`

## Product

- [ ] 198개 Q&A 내용·수식·난이도 사람 검수
- [x] 첫 진입, 목표 변경, 카테고리 학습, 용어집, 기록 흐름 확인
- [x] 빈 상태·저장소 실패·오프라인 상태 확인
- [x] system/light/dark 전환, 저장 유지, 320px header 겹침과 가로 overflow 확인
- [x] dark panel 명도 단계, lime foreground 대비, 홈 상단 control 수직 정렬 확인
- [x] 첫 선택·답 공개·자기평가 feedback과 reduced-motion fallback 확인
- [x] 프로필을 네 번째 primary tab으로 이동하고 floating navigation 320px QA
- [x] 광고 기능 플래그가 꺼져 있고 광고 SDK/ID가 없는지 확인

## Apps in Toss

- [ ] 콘솔에서 최종 `appName` 사용 가능 여부 확인
- [ ] `displayName`, icon URL, primary color를 콘솔과 config에 동일하게 반영
- [ ] 서비스 전용 고객센터 email/contact를 콘솔 공통 navigation에 등록
- [ ] 비게임 출시·개인정보·접근성·공유 정책 확인
- [ ] Sandbox App에서 iOS/Android 주요 화면 확인
- [ ] Toss app에서 최소 1회 실행하고 live HTTPS/CORS 차이 확인
- [ ] 수익형 교육 category 자격 조건과 사업자·정산 가능 여부를 사전 확인
- [x] `.ait` 산출물 업로드 전 SHA와 version 기록

## Standalone/PWA

- [ ] HTTPS preview URL에서 설치 가능 여부 확인
- [ ] 첫 접속 후 비행기 모드 재실행 확인
- [ ] iOS 홈 화면 추가와 Android 설치 확인
- [ ] custom domain은 보류하고 provider subdomain 사용
- [ ] 실제 host 응답의 CSP, nosniff, frame, Referrer-Policy, Permissions-Policy 확인

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

- [x] ErrorBoundary와 오류 recovery 확인
- [ ] Sentry DSN/email alert/source-map upload와 scrubbed test error 확인
- [ ] Apps console FPS/crash/load/memory release baseline 확인
- [x] strict TypeScript와 bundle budget gate
- [x] secret/PII scan 및 final diff review
- [x] release HTML strict CSP와 CSP violation 없는 production browser flow
- [x] `docs/work/mvp-release-hardening/verification.md`를 최종 137문항 결과로 갱신
- [x] CHANGELOG의 `Unreleased` 항목 정리

## Approval-gated actions

- [ ] Git tag `v1.0.0`
- [ ] 원격 저장소 push/release 생성
- [ ] Apps in Toss 콘솔 upload/deploy
- [ ] static hosting deploy

## CI/CD

- [ ] remote repository 확정 후 GitHub Actions quality CI 추가
- [ ] standalone hosting provider를 고른 뒤 preview/production protected environment 설계
- [ ] Apps in Toss 자동 CD는 공식 credential·review flow와 rollback owner 확인 전 보류
