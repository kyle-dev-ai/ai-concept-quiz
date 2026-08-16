# Client incident runbook

- Owner: release owner
- Scope: Apps in Toss and standalone JavaScript/UI incidents
- Last reviewed: 2026-08-16

## Signals

1. Sentry `prd`/`standalone` new issue and frequency
2. Apps in Toss console FPS, crash ratio, load time, memory
3. Apps in Toss customer center reports
4. release version, deployment time, affected profile and reproduction path

## Severity

| Severity | Example | Initial response |
|---|---|---|
| SEV-1 | app boot 불가, 데이터 저장 전면 실패, 반복 crash | 신규 release 중단, 15분 내 rollback 판단 |
| SEV-2 | 핵심 학습/자기평가 일부 실패, 다수 사용자 영향 | 1시간 내 재현·완화 결정 |
| SEV-3 | 비핵심 UI, 단일 환경, 우회 가능 | backlog와 다음 patch release |

## First 15 minutes

1. Sentry event의 release/environment/area와 Apps dashboard 변화를 확인한다.
2. credential, nickname, goal note, storage payload가 event에 없는지 먼저 확인한다. 있으면 Sentry project access를 제한하고 DSN을 제거한 rebuild를 준비한다.
3. 직전 release와 변경 diff를 비교하고 동일 profile에서 재현한다.
4. 사용자 데이터 삭제, 강제 migration, remote config 변경은 별도 승인 없이 하지 않는다.
5. boot/save crash 또는 급격한 memory/crash 악화면 새 배포를 멈춘다.

## Containment and recovery

- Sentry 자체 문제: `VITE_SENTRY_DSN`을 비운 artifact로 전환한다. 학습 기능은 no-op telemetry로 계속 동작해야 한다.
- standalone: hosting provider에서 직전 immutable build를 active version으로 되돌린다.
- Apps in Toss: console에서 직전 deployment로 rollback한다.
- 저장 payload 손상: parser가 invalid data를 초기값으로 격리하는지 확인한다. 자동 삭제 코드는 patch에 넣지 않는다.
- 광고 관련: v1.0.0은 flag가 off다. 미래 광고 장애는 placement flag를 내려 학습 flow를 보존한다.

## Verification after recovery

- 첫 진입 또는 기존 profile load
- 목표 변경과 새로고침 후 유지
- 질문 공개, 자기평가 저장, 다음 문제
- 기록 점수와 약한 질문
- offline PWA 재실행 또는 Apps Sandbox 재실행
- Sentry test error 1건이 올바른 release/profile로 보이고 민감정보가 없는지 확인

## Monitoring window

- 0–30분: new issue와 boot/save error 확인
- 30–60분: Apps load time, crash ratio, memory 추세 확인
- 24시간: 고객 문의, quota, 동일 fingerprint 재발 확인

## Closeout

incident 문서에 impact, timeline, trigger, fix, verification, rollback 여부를 남긴다. regression test나 release gate로 재발 방지를 자동화하고 SemVer patch 여부를 결정한다.

