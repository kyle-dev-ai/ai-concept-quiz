# Product and engineering roadmap

날짜보다 검증 신호를 기준으로 다음 단계에 투자한다. 각 단계는 이전 단계의 지표를 충족할 때만 연다.

## Phase 0 — v1.0.0 local-first MVP

목표는 “답을 보기 전 설명하고 자기평가하는 흐름을 반복해서 쓰는가”를 확인하는 것이다.

- 197개 versioned 질문, 목표·학습자 추천, 성장 점수·레벨, 용어집
- localStorage / Apps in Toss Storage adapter
- standalone PWA와 Apps in Toss build
- AI-native schema, prompt, golden-set gate
- 광고·로그인·backend는 비활성, Sentry error adapter는 DSN이 있을 때만 opt-in

다음 단계 조건:

- 본인·지인 합계 20세션 이상
- answer reveal 이후 자기평가 완료율 60% 이상
- 본인 주 4회 사용 또는 7일 재방문 사용자 5명 이상
- 콘텐츠 오류와 주요 이탈 지점이 수기 테스트에서 정리됨

## Phase 1 — content operations and measured usage

- Notion CSV export → schema validation → candidate JSON → eval → human approval → generated corpus
- 150개 핵심 개념과 source/review metadata
- HTTPS static hosting은 외부 재방문 테스트가 필요할 때 provider subdomain으로 시작
- Sentry error inbox와 Apps performance dashboard 운영, privacy-safe product event는 별도 결정
- weak concepts 우선 복습과 간단한 spaced repetition 실험

Backend/API 전환 조건 중 하나:

- 150개 이상 콘텐츠를 주 1회 이상 앱 릴리스 없이 바꿔야 함
- 기기 간 진도 동기화를 원하는 반복 사용자가 확인됨
- cohort, entitlement 또는 유료 콘텐츠처럼 서버 권한이 필요함

Custom domain 조건:

- standalone 재방문이 확인되고 공유 링크의 신뢰·브랜드가 실제 병목임
- hosting provider 이동 또는 SEO/marketing landing page를 독립 운영해야 함

## Phase 2 — retention and monetization

- daily review queue, streak recovery, share card와 onboarding copy를 event funnel로 검증
- Apps in Toss 공식 통합 광고만 사용하고 banner는 빈 UI 영역, 전면형은 완료 경계에서 placement A/B test
- frequency cap, provider failure fallback, consent/privacy, 사업자·세무·스토어 정책 검토
- 광고가 session completion과 7-day retention을 해치면 즉시 중단

광고 활성화 조건:

- 최소 4주 retention과 session completion baseline 존재
- 의미 있는 MAU와 session 수로 예상 수익을 계산할 수 있음
- 광고 없는 control 대비 학습 지표 하락 허용 범위 합의
- Apps in Toss 최신 광고·개인정보·수익화 정책 재확인
- 사업자·정산 등록과 수익형 교육 category 자격 적용 여부 확인

## Phase 3 — measured runtime AI

- 사용자의 자유 설명을 서버에서 루브릭 기반으로 피드백
- weak concept에 맞춘 꼬리 질문 후보 생성
- RAG로 curated corpus를 grounding하고 출처를 표시
- versioned model/prompt/retrieval/tool/grader fingerprint와 반복 trial 도입
- quota, timeout, fallback, cost ceiling, abuse controls를 먼저 정의

Runtime AI 활성화 조건:

- 정적 답변만으로 해결되지 않는 반복 사용자 문제가 확인됨
- 유료 전환 또는 retention 개선 가설이 API 비용보다 큼
- offline eval, challenge suite, privacy review, 비용/latency budget이 통과함

## Phase 4 — backend sync and other stores

- 사용자 요청이 확인되면 account/cloud progress sync와 DB migration 설계
- MAU, push notification, widget, deep link, subscription 등 native 요구를 기준으로 Capacitor와 React Native를 비교
- App Store/Play Store는 리뷰·정책·결제·QA 유지비를 감당할 신호가 있을 때만 확장

Store 확장 조건:

- Apps in Toss/standalone 밖에서도 쓰겠다는 실제 사용자 수요
- 플랫폼 의존 유입 위험 또는 native retention 기능의 명확한 가치
- 별도 release train과 iOS/Android QA를 유지할 수 있는 시간·수익
