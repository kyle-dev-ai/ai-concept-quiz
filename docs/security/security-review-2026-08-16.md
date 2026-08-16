# Frontend security review

- Reviewed: 2026-08-16 Asia/Seoul
- Scope: React source, runtime config, local/native storage, sharing, optional Sentry, Vite/PWA build, dependency lockfile, deployment guidance
- Result: Critical 0, High 0, Medium 1 open, fixed during review 1

## Open finding

### REACT-HEADERS-001

- Severity: Medium
- Location: `docs/deployment/dual-delivery.md:30`, repository root hosting configuration
- Evidence: release HTML now contains a strict CSP meta policy, but no hosting provider has been selected and the repository cannot prove response-level `frame-ancestors` or `X-Frame-Options`, `X-Content-Type-Options`, and `Permissions-Policy`.
- Impact: a future standalone host with weak defaults could leave defense-in-depth against clickjacking and MIME confusion incomplete. Apps in Toss headers also cannot be verified from the local artifact alone.
- Fix: after choosing the HTTPS host, configure the documented headers and capture `curl -I` plus browser-console evidence. Verify Apps in Toss Sandbox separately because its WebView policy is platform-owned.
- Mitigation: `vite.config.ts:12-30` injects a release-only CSP before scripts, `index.html` uses `no-referrer`, and the app has no auth, cookie, credentialed fetch, user HTML, or external runtime script.
- False positive notes: close this finding if the chosen provider or platform demonstrably applies equivalent or stronger response headers without breaking the Apps bridge.

## Fixed during review

### REACT-CSP-001

- Severity: Medium
- Location: `src/app/config/content-security-policy.ts:1-30`, `vite.config.ts:12-30`
- Evidence before fix: production and standalone HTML had no repository-controlled CSP.
- Impact: an injection bug or compromised runtime dependency would have faced fewer browser-enforced restrictions.
- Fix: release builds now inject `default-src 'self'`, self-only scripts/styles/workers, no objects/frames/base URL, and a self-only connection policy. A configured Sentry DSN contributes only its validated HTTPS origin. `unsafe-inline` and `unsafe-eval` are absent.
- Mitigation: runtime inline style was removed by using native `progress`, CSS classes, and `data-theme`; production browser QA reported no CSP violations.
- False positive notes: response-header CSP remains preferable on the standalone host, but the meta policy is active defense-in-depth in both generated artifacts.

## Verified controls

- REACT-XSS-001 / REACT-DOM-001: no `dangerouslySetInnerHTML`, DOM HTML sink, eval-like execution, markdown raw HTML, or dynamic script injection found.
- REACT-CONFIG-001: committed `VITE_*` values contain no credential. Sentry DSN is public client config; auth tokens and Slack webhooks are explicitly excluded.
- REACT-AUTH-001 / REACT-CSRF-001: no login, auth token, cookie session, or state-changing network API exists. Local storage contains bounded non-sensitive learning state only.
- JS-STORAGE-001: profile and progress payloads are size/schema validated in `local-profile-repository.ts:21-43` and `local-progress-repository.ts:52-88`; theme accepts only three allowlisted values.
- REACT-3P-001: no remote tag or CDN script exists. Sentry is pinned, optional, dynamically loaded only with DSN, and scrubs user/request/free-text fields in `sentry-telemetry.ts:39-73`.
- REACT-SW-001: standalone service worker precaches static artifacts only, cleans old caches, requires HTTPS outside localhost, and excludes optional monitoring chunks.
- REACT-SUPPLY-001: exact versions and `package-lock.json` are present; `npm audit` and `npm audit --omit=dev` both reported zero vulnerabilities on 2026-08-16. CI enforcement remains a release-process backlog item.

## Scan evidence

Targeted repository scans covered unsafe HTML/DOM sinks, string code execution, unsafe URLs and redirects, cross-window messaging, credentialed requests, auth/token storage, third-party script injection, client secrets, and service-worker cache rules. Generated artifacts and dependencies were excluded from source-pattern conclusions and inspected separately where relevant.
