# Backlog

## v1.0.0 launch gate

- [ ] 185개 질문을 사람이 최종 사실·수식·난이도 검수
- [ ] Apps in Toss 콘솔에서 `appName`, display name, icon 확정 (v3는 콘솔 등록; config는 `primaryColor`만)
- [ ] 콘솔에서 비게임 webview type(partner)과 앱 내 기능 1개 이상 등록
- [x] 비게임 가이드에 따라 pinch zoom 비활성화 (`index.html` viewport)
- [x] 공유 버튼은 링크 목적지가 없어 standalone HTTPS 배포 전까지 화면에서 숨김
- [ ] Sandbox App iOS/Android 실기기 QA
- [ ] Sandbox에서 system/light/dark, VoiceOver/TalkBack, 200% text를 확인
- [ ] 최신 출시·개인정보·공유 정책 재확인
- [ ] 서비스 전용 고객센터 email/contact를 만들고 Apps 콘솔 공통 navigation에 등록
- [ ] Sentry project/DSN과 email alert를 설정하고 privacy-safe test error 1건 확인
- [ ] source map을 credential이 있는 환경에서 공식 upload flow로 전송
- [x] `.ait` checksum과 verification packet 기록
- [ ] 승인 후에만 upload/deploy와 `v1.0.0` tag 생성

## Early validation

- [ ] 본인 20세션 사용 기록과 불편 메모
- [ ] 지인 대상 onboarding 이탈·답 공개·자기평가 완료 관찰
- [ ] HTTPS provider subdomain으로 standalone PWA 선택 배포
- [ ] share card/OG image와 short-form 유입 가설 검증
- [ ] 이름 `어텐션!`과 appName 충돌·상표 리스크 확인

## Content operations

- [ ] Notion export field mapping과 CSV fixture 정의
- [ ] CSV → schema-validated JSON generator
- [ ] source, generatedBy, reviewedBy, reviewStatus metadata 결정
- [ ] 150개 core curriculum과 category balance
- [ ] 외부 candidate를 golden harness로 비교하는 eval report 저장
- [ ] semantic fact review와 sequestered holdout 운영 기준

## Reliability and data

- [x] opt-in Sentry error adapter와 privacy scrubber
- [x] mobile bundle budget과 client incident runbook
- [x] 전역 light/dark/system preference와 strict release CSP
- [ ] Apps console FPS/crash/load/memory dashboard release baseline
- [ ] Sentry quota/alert owner/source-map upload 외부 설정
- [ ] privacy-safe event dictionary와 retention funnel
- [ ] storage quota/corruption/migration browser test
- [ ] static content update 또는 cloud sync 요구가 생기면 API/DB spec
- [ ] account를 도입할 때 export/delete/conflict resolution 정책

## Monetization

- [ ] MAU·session·retention baseline과 광고 예상 수익 계산
- [ ] Apps in Toss 최신 광고 정책과 사업자·세무 조건 확인
- [ ] 수익화 가능한 사업자·정산 상태를 먼저 확인
- [ ] 수익형 교육 서비스 자격 조건이 이 앱에 적용되는지 console/review 사전 확인
- [ ] Apps in Toss 공식 Toss Ads/AdMob 통합 adapter와 운영 광고 그룹 ID 연결
- [x] 홈·용어집·기록·프로필·학습 하단 banner와 세션 완료 전면형 후보 6개 placement 확보
- [x] No Fill·실패·미지원 시 구좌 자동 collapse contract와 regression test
- [ ] console에서 앱 category 기반 광고 그룹 category 확인; 특정 입시·이직 소재는 보장하지 않음
- [ ] WebView 5.241 미만 fallback, 실제 QR test, frequency cap, no-ad control A/B test
- [ ] 질문 은행 gzip이 128 KiB에 닿으면 예산을 올리지 말고 카테고리별 분할 로딩 도입
- [ ] 유료 콘텐츠 또는 구독은 반복 사용자 문제 확인 후 별도 검토

## Growth and community

- [ ] 대학원 합격·AI 이직 후기의 카드 schema 정의: 목표, 준비 기간, 학습 경로, 도움 된 질문, 결과
- [ ] 운영자가 검수한 익명 후기부터 static content 또는 Notion export로 제공
- [ ] 목표·직업군별 후기 필터와 관련 질문 덱 연결
- [ ] 후기 공유용 deep link와 OG card로 검색·short-form 유입 검증
- [ ] 작성 수요가 확인되면 API/DB 기반 후기 게시판 spec 작성
- [ ] 게시판 공개 전 로그인 최소화, 익명화, 금칙어·spam 방지, 신고·숨김·삭제, 운영 정책 마련
- [ ] 학교·회사 사칭, 합격 인증, 저작권, 개인정보 노출에 대한 moderation 기준과 관리자 도구 마련
- [ ] 자유 게시판과 댓글은 관리 비용·악용 위험을 검증한 뒤 별도 결정

## Platform expansion

- [ ] custom domain은 retention/brand 병목 확인 뒤 신청
- [ ] standalone hosting provider를 고른 뒤 HTTPS, SPA fallback, cache header, rollback 설정
- [ ] remote repository를 만든 뒤 GitHub Actions CI 도입 여부 결정
- [ ] CI 도입 시 quality gate만 먼저 실행하고 공개 CD는 protected approval 뒤 분리
- [ ] push/deep link/widget 요구가 생기면 Capacitor vs React Native ADR
- [ ] 유지 가능한 MAU/수익 뒤 App Store·Play Store release train 검토
