# AI Concept Quiz repository guidance

## Product boundary

- Keep the MVP local-first: no backend, login, analytics, live AI, ad SDK, or personal data without an explicit product decision.
- Treat question content as reviewed product data. Preserve stable IDs and add tests when changing its schema.
- Treat specs, ADRs, schemas, prompts, and golden cases as the AI-native source of truth. AI output is a candidate until deterministic evaluation and human review pass.
- Keep Apps in Toss app registration, deployment, ad activation, payment, and external publication approval-gated.

## Architecture

- `src/domain` stays independent of React and browser APIs.
- `src/content` owns static, reviewed learning content only.
- `src/features` owns user-facing flows; cross-feature UI belongs in `src/shared`.
- Browser persistence and SDK providers live under `src/infrastructure` behind small ports.
- Prefer explicit functions and discriminated unions over general-purpose abstractions.

## Conventions

- Use TypeScript strict mode and named exports except for the root `App` component.
- Use accessible native controls, visible focus, semantic headings, and reduced-motion support.
- Keep Korean UI copy concise; keep code identifiers and established AI terms in English.
- Use CSS design tokens from `src/index.css`; do not scatter raw brand colors through components.
- Do not add dependencies without a concrete behavior or verification need.

## Content review

- `npm run eval`은 형식과 회귀만 본다. 사실 정확성은 잡지 못한다.
- 콘텐츠를 추가한 뒤와 출시 전에는 `audit-content` 스킬로 사실·말투·범용성을 검수한다.
- `npm run check:content`가 진입로 부재, 덱 도달성, 난이도 역전, 골든 미커버를 검사하며
  `npm run verify`에 포함돼 있다. baseline(`assets/evals/content-baseline.json`) 대비
  **새로 늘어난 결함만** 실패로 본다. 부채를 해결하면 baseline에서 지운다.
- 새 문항은 골든 케이스와 함께 추가한다. 그러지 않으면 `check:content`가 실패한다.
- `npm run audit:style`은 길이, 반복 표현, 문항 간 복제처럼 셀 수 있는 것을 보고만 한다.
- 검수 결과는 `docs/content/audit-*.md`에 남기고 `docs/content/sources.md`의 배치 상태를 갱신한다.

## Verification

Run before handoff:

```bash
npm run check
npm run typecheck
npm run test
npm run eval
npm run build
```

Never run `npm run deploy` without explicit approval.
