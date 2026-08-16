# AI Concept Quiz v1.0.0 verification

- Verified on: `2026-08-16` (`Asia/Seoul`)
- Target: local MVP, standalone PWA build, Apps in Toss `.ait` release candidate
- Runtime: Node.js `24.18.1`, npm lockfile version 11
- Decision: **CONDITIONAL GO**

로컬 브라우저 MVP와 build artifact는 사용할 수 있다. 공개 Apps in Toss 출시는 콘텐츠 사람 검수, Sandbox 실기기 확인, 실제 배포 응답의 보안 헤더 확인 및 콘솔 정책 승인이 남아 있으므로 조건부다. 배포·업로드·원격 push·tag는 수행하지 않았다.

## Risk classification

| Area | Risk | Assessment |
|---|---:|---|
| Behavior | Medium | onboarding, 목표별 추천, 학습·평가·진도·공유 흐름이 추가됐다. component/domain tests와 실제 browser QA로 확인했다. |
| API | Low | 외부 API가 없고 future provider는 application port 뒤에 있다. |
| Data | Medium | localStorage/native Storage에 profile과 progress를 저장한다. v1 runtime validation과 bounds를 추가했지만 cloud backup은 없다. |
| Auth / privacy | Low | 로그인, 이메일, 성별, 나이, 광고 ID, 권한 요청이 없다. |
| Infrastructure | Low | 외부 배포와 production mutation을 하지 않았다. 실제 hosting headers는 미확인이다. |
| Dependencies | Medium | React 19, TypeScript 6, Vite 8, Apps SDK 3, PWA plugin을 고정했다. 전체 audit는 0 vulnerabilities다. |
| UI / accessibility | Medium | 새 모바일 UI 전체가 범위다. 320/414/768px와 keyboard dialog를 확인했지만 VoiceOver/TalkBack 실기기 검증은 남았다. |
| AI content | Medium | 39문항·8개 category다. deterministic eval은 100%지만 AI 분야 사람 사실 검수는 출시 gate다. |

## Evidence

| Area | Command or method | Result | Notes |
|---|---|---|---|
| Runtime | cached Node binary `node --version` | PASS | `v24.18.1`; 시스템 기본 Node 25와 분리해 검증 |
| Format / lint | `biome check .` | PASS | 64 files, no fixes |
| Types | Node 24 + `typescript/bin/tsc -b` | PASS | strict project references |
| Unit / component / adapter | Node 24 + `vitest.mjs run` | PASS | 11 files, 31 tests |
| AI evaluation | Node 24 + `scripts/eval-content.mjs` | GO | 39 questions, 17 cases, contract/golden/category 100% |
| Content fingerprint | deterministic SHA-256 | PASS | `150eb920a15a7364984ea42dea6b01f730d031b47b32744fed7f6e2ee228762d` |
| Production web build | Node 24 + Vite production build | PASS | 95 modules; main 274.01 kB / 86.64 kB gzip; CSS 34.44 kB / 7.40 kB gzip |
| Apps in Toss package | Node 24 + Apps CLI build | PASS | `ai-concept-quiz.ait`, deployment ID `01a0091b-d2d5-7e6e-acd6-4c7d824ef788` |
| Artifact integrity | `shasum -a 256 ai-concept-quiz.ait` | PASS | `e66b522efb211e81b9926ee6594191b557366a0d3cd4bbfbeeaad6ca5b2b2933`, 122,746 bytes |
| Standalone PWA | Node 24 + Vite standalone build | PASS | manifest, service worker, 7 precache entries / 369.33 KiB |
| Production dependencies | `npm audit --omit=dev` | PASS | 0 vulnerabilities |
| All dependencies | `npm audit` | PASS | 0 vulnerabilities |
| Dangerous frontend patterns | targeted `rg` scans | PASS | no unsafe HTML/DOM sink, eval, dynamic/remote script, credentialed fetch, embedded secret pattern |
| Permissions | config inspection | PASS | Apps in Toss `permissions: []` |
| Responsive UI | Playwright browser inspection | PASS | 320×568, 414px, 768px; no horizontal overflow; short-screen answer CTA visible |
| Onboarding persistence | browser + component test | PASS | 저장 완료 뒤 home 전환; 실패 시 화면 유지와 alert |
| Level dialog accessibility | browser keyboard flow | PASS | initial focus, Tab/Shift+Tab loop, Escape, trigger focus restore, scroll restore |
| Browser console | fresh QA session | PASS | 0 errors, 0 warnings |
| Disabled monetization | DOM inspection + component test | PASS | `VITE_ADS_ENABLED=false`; ad element 0; ad SDK/ID 없음 |
| Error observability | architecture inspection | CONDITIONAL | local console adapter와 ErrorBoundary는 있으나 standalone/prd remote telemetry는 의도적으로 Noop |
| Public platform validation | Apps Sandbox / console | PENDING | iOS/Android, app name/icon, 정책과 runtime response headers를 사람이 확인해야 함 |

## Fixed defects during review

1. `/specs/`만 무시하도록 `.gitignore` pattern을 좁혀 `docs/specs/` 원천 문서가 누락되지 않게 했다.
2. onboarding 저장을 await한 뒤에만 화면을 전환하고 실패를 사용자에게 표시한다.
3. 화면·질문 전환 시 이전 scroll 위치가 이어지지 않게 했다.
4. 320×568 화면에서 답 공개 CTA가 첫 viewport 아래로 밀리던 layout을 압축했다.
5. level dialog에 focus trap, Escape close, scroll lock, focus restore를 추가했다.
6. viewport의 확대 차단을 제거했다.
7. profile/progress 저장 데이터에 크기·형식·개수 bounds를 추가했다.
8. 공유 URL의 query/hash를 제거하고 clipboard permission 실패를 안전하게 처리했다.
9. 실제 dependency와 script가 없는 Oxlint 잔여 설정을 제거해 Biome을 단일 lint/format 기준으로 정리했다.

## Residual risks

| Risk | Owner | Mitigation before release | Rollback signal | Rollback action |
|---|---|---|---|---|
| 질문 내용의 사실 오류 또는 중복 | Product/content owner | 39개 문항을 content checklist로 전수 검수 | 사용자가 오답·중복을 신고하거나 reviewer가 불일치 발견 | 해당 stable ID 문항을 corpus에서 제외하고 dataset patch version 재검증 |
| Apps WebView에서 storage/share/UI 차이 | Release owner | Sandbox iOS/Android에서 critical flow 실행 | 저장 실패, blank screen, 공유 crash, 주요 CTA 가림 | upload 중단, 이전 `.ait` 유지, adapter/UI 수정 후 재빌드 |
| 배포 응답 보안 헤더 미확인 | Release/security owner | 실제 host 응답에서 CSP/frame/MIME/permissions 정책 확인 | header 부재 또는 Apps bridge 차단 | 공개 중단, platform-compatible header policy 수정 후 재검증 |
| production 오류가 보이지 않음 | Product owner | public acquisition 전 privacy-safe error tracking ADR 승인 | 지원 문의만으로 장애를 발견하거나 재현 불가 오류 증가 | 유입 확대 중단, 최소 error adapter를 별도 patch로 배포 |
| 기기 데이터 삭제·손상 | Product owner | local-only 한계를 문서화하고 corrupt payload fallback 유지 | 진도 초기화 문의가 반복됨 | export/backup 또는 account/API 요구를 별도 spec으로 승격 |
| standalone precache의 불필요한 Apps chunk | Frontend owner | 외부 공개 전 profile별 bundle 측정 | 초기 로드/설치 크기가 성능 예산 초과 | Apps dependency import를 prd 전용 entry로 분리 |

## Manual release conditions

- [ ] 39개 Q&A의 사람 사실·중복·난이도 검수
- [ ] Apps in Toss 콘솔의 `appName`, display name, icon 및 정책 확인
- [ ] Sandbox App iOS/Android에서 onboarding → 학습 → 평가 → 재접속 확인
- [ ] 실제 production response security headers 확인
- [ ] VoiceOver/TalkBack 또는 동등한 screen reader smoke test
- [ ] 명시적 승인 후에만 upload/deploy 및 `v1.0.0` tag 생성

## Local review artifact

상세 14개 항목 평가표는 `specs/repository-evaluation-2026-08-16.html`에 있다. 이 파일은 로컬 검토 산출물이므로 `.gitignore`의 `/specs/` 규칙으로 커밋에서 제외한다.
