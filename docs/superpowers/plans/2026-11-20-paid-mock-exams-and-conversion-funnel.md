# Paid Mock Exams and Conversion Funnel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove unlimited trials, reserve mock exams for paid members, and surface a live conversion funnel in Admin.

**Architecture:** A paid-only access predicate remains the server-side
authority for premium product routes. A small conversion-event table records
authenticated milestones that cannot be derived from current tables; Admin
aggregates it with existing account, activity, and payment tables by Sydney
calendar day.

**Tech Stack:** Next.js 16 App Router route handlers, TypeScript, Neon
Postgres, Clerk, Stripe webhooks, Node test runner, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-20-paid-mock-exams-and-conversion-funnel-design.md`

## Global Constraints

- Follow the checked-in Next.js 16 documentation for route handlers.
- Simulated exams allow only paid/lifetime access; previews stay public.
- No 24-hour unlimited trial; existing lifetime free quotas stay at ten.
- Funnel contains no email, answer, payment, IP, or device-fingerprint data.
- Admin funnel dates use Australia/Sydney and supports only 1, 7, or 30 days.

## Review Focus

- A legacy `trial` status must never pass a paid-only exam API action.
- A free user must still receive exactly the existing ten free quotas.
- Repeated client paywall events must not turn a funnel count into a pageview count.
- The webhook records a payment conversion only after a valid paid fulfillment.
- Admin date filters must reject unsupported windows rather than running an
  unbounded aggregation.

---

### Task 1: Paid-only entitlement and truthful pricing copy

**Files:** Modify `src/lib/access-policy.ts`, `src/lib/access-store.ts`,
`src/lib/growth.ts`, `src/components/GrowthPrompts.tsx`,
`src/app/billing/plan-comparison.tsx`, `tests/free-access.test.ts`,
`tests/growth.test.ts`; create `db/migrations/019_remove_full_feature_trials.sql`.

- [ ] Write failing unit tests proving trial has no full access and no
  trial-ending conversion prompt.
- [ ] Run focused tests and observe the old assertions fail.
- [ ] Make access paid-only, disable existing trial eligibility, remove
  trial-only UI, and correct pricing copy.
- [ ] Run focused tests and `npm test`.

### Task 2: Server-authoritative mock-exam paywall

**Files:** Modify `src/app/api/exams/route.ts`,
`src/components/exam/ExamCenter.tsx`, `tests/exam-api.test.ts`, and
`tests/e2e/mock-exams.spec.ts`.

- [ ] Write a failing test that asserts a trial account receives HTTP 403.
- [ ] Require paid access on create, sync, begin, and answer while preserving
  report/history access.
- [ ] Run focused API and mock-exam E2E tests.

### Task 3: Conversion event storage and reliable server milestones

**Files:** Create `db/migrations/020_conversion_funnel.sql`,
`src/lib/conversion-store.ts`, `src/app/api/conversion/route.ts`, and
`tests/conversion.test.ts`; modify `ExamCenter`, checkout, and Stripe webhook.

- [ ] Write failing tests for unauthenticated, invalid, duplicate, and valid
  paywall events.
- [ ] Add constrained event storage; emit one client paywall event per session,
  a server checkout-start event after validation, and a payment-complete event
  after verified fulfillment.
- [ ] Run focused tests and the full unit suite.

### Task 4: Admin live funnel dashboard

**Files:** Modify `src/lib/admin/policy.ts`, `src/lib/admin/store.ts`,
`src/lib/admin/data.ts`, `src/app/admin/page.tsx`, `tests/admin.test.ts`, and
`tests/admin-store.integration.test.ts`; create `src/app/admin/funnel.tsx`.

- [ ] Write failing tests accepting 1, 7, and 30 only and rejecting malformed
  or unbounded windows.
- [ ] Implement the constrained parser, aggregate query, and Admin dashboard
  with stage totals, conversion rates, and per-day table.
- [ ] Run focused tests, database integration tests when configured, then
  `npm test`, `npm run lint`, and `npm run build`.
