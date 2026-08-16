# Backlog

## v1.0.0 launch gate

- [ ] 39개 질문을 사람이 최종 사실 검수
- [ ] Apps in Toss 콘솔에서 `appName`, display name, icon 확정
- [ ] Sandbox App iOS/Android 실기기 QA
- [ ] 최신 출시·개인정보·공유 정책 재확인
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

- [ ] public acquisition 전 remote error tracking ADR
- [ ] privacy-safe event dictionary와 retention funnel
- [ ] storage quota/corruption/migration browser test
- [ ] static content update 또는 cloud sync 요구가 생기면 API/DB spec
- [ ] account를 도입할 때 export/delete/conflict resolution 정책

## Monetization

- [ ] MAU·session·retention baseline과 광고 예상 수익 계산
- [ ] Apps in Toss 최신 광고 정책과 사업자·세무 조건 확인
- [ ] session-complete placement provider adapter
- [ ] `study-bottom-banner`에 320×50/adaptive banner provider adapter 연결
- [ ] AdMob 등 후보 provider의 Apps in Toss 지원·심사·동의 요건을 활성화 직전에 확인
- [ ] frequency cap, failure fallback, no-ad control A/B test
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
- [ ] push/deep link/widget 요구가 생기면 Capacitor vs React Native ADR
- [ ] 유지 가능한 MAU/수익 뒤 App Store·Play Store release train 검토
