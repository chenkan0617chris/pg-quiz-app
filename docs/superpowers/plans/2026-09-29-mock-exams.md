# Mock Exam Implementation Plan

**Goal:** Complete member-only exam sessions with visible previews and saved detailed reports.
**Architecture:** Pure exam engine, owner-scoped CAS persistence, authenticated route, center/runner/report components, separate Grid and PEAK familiarization.
**Tech Stack:** Installed Next.js 16, React 19, Neon SQL, Clerk, Zod, node:test, Playwright.
**Spec:** docs/superpowers/specs/2026-09-29-mock-exams-design.md

## Global constraints
Use existing trial/paid policy. Do not alter existing uncommitted billing work. No official hiring-score claim. Instructions and section timers distinct. Use server time and owner checks. All active responses omit reference answers/grades.

## Review focus
- Duplicate submit, concurrent tabs: question identity and revision reject stale mutations.
- Background/refresh/deadline: server timestamps advance sections without adding time.
- Membership loss: forbid starting/answering; allow report reads and finalization for owned sessions.
- Fullscreen unsupported or exited: clear recovery, clock keeps running, no hidden answer interaction.
- Empty/partial/early submitted exam: no NaN, honest coverage and explicit unanswered entries.

## Tasks
- [x] Engine and meaningful tests: src/lib/exam.ts, exam-types.ts, tests/exam.test.ts. Generate original grid tasks, grade separately, derive reports, enforce deadlines and finite state transitions.
- [x] Storage/API: db/migrations/012_mock_exams.sql, src/lib/exam-store.ts, src/app/api/exams/route.ts. Owner predicates, active unique constraint, compare-and-swap, authenticated schemas and limits.
- [x] UI: src/components/exam/* and localized /exams, /grid, /peak routes. Public previews, ready/run/report, fullscreen and timing, persisted history.
- [x] Navigation, browser verification, production build, lint and regression tests. Apply additive migration to configured database when available; do not print credentials.

Execution: user authorized full responsibility; implement inline without additional approval gates. Use tests for lifecycle invariants and review the final diff.

## Verification record
- `npm run lint`, `npx tsc --noEmit`, `npm run build`: pass.
- `npm test`: 40 pass; 10 optional database tests skipped in default run.
- Dedicated `RUN_DB_TESTS=1 node --env-file=.env.local --import tsx --test tests/exam-store.integration.test.ts`: 1 pass against configured Neon database; generated test rows cleaned up.
- `PLAYWRIGHT_BASE_URL=http://localhost:3100 npx playwright test tests/e2e/mock-exams.spec.ts tests/e2e/billing-comparison.spec.ts --workers=2 --timeout=60000`: 17 pass.
- Actual local site inspected in browser: navigation, guest upsell, preview tabs. Unauthenticated API returns 401.
- Additive migration 012 applied to DATABASE_URL from .env.local.
- Independent review findings fixed: preserve mounted question behind focus/confirmation panels; fixed Grid observation deadline; persist Grid progress per question in sessionStorage. Regression tests cover all three.
- Local preview must bind `localhost` consistently; binding 127.0.0.1 while Clerk rewrites to localhost caused a local proxy loop. No production auth setting changed.
- No production deployment or git commit performed. Concurrent SEO edits were left intact. Existing billing changes were extended only for actual mock-exam entitlements.

## Practice fidelity
Timing presets are public preparation references, not guaranteed official timings. Grid uses original 5×5 dot locations and vertical-symmetry interference; scoring is transparent site practice scoring. Official algorithms, live questions and hiring thresholds are not reproduced. Browser fullscreen and sessionStorage are UX aids, not a proctoring/security boundary; authorization, answers and timing remain server-owned.
