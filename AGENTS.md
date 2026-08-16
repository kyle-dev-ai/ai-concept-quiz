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
