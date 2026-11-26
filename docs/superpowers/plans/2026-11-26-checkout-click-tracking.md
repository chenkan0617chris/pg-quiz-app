# Checkout Click Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Log every signed-in checkout request with button, language/price and outcome, and show it in /admin.

**Architecture:** A new `checkout_clicks` table is written by `/api/checkout`. A pure policy module validates sources and internal ids. An admin store query aggregates by click date. A server component renders the panel.

**Tech Stack:** Next.js 16 App Router, Neon Postgres, node:test via tsx, esbuild route fixtures.

**Spec:** docs/superpowers/specs/2026-11-26-checkout-click-tracking-design.md

## Global Constraints
- Sources: `billing`, `upgrade_card`, `other`. Outcomes: `redirected`, `already_paid`, `processing`, `rate_limited`, `error`.
- Logging must never change the checkout response.
- Internal ids = `ADMIN_USER_IDS` ∪ `INTERNAL_USER_IDS`, comma separated. They are excluded unless `?internal=1`.
- No emails in the panel.

## Review Focus
- A log insert that throws → the checkout still returns its URL (route test).
- An unknown or missing `source` → stored as `other` (policy test).
- An empty or whitespace env list → nothing excluded, no crash (policy test).
- Clicks windows only accept 1/7/30 (reuse `parseFunnelDays`).
- A paid-account click → logged `already_paid`, response 409 (route test).

---

### Task 1: Migration + policy + store
**Files:** Create `db/migrations/024_checkout_clicks.sql`, `src/lib/checkout-click-policy.ts`, `src/lib/checkout-clicks.ts`; Test `tests/checkout-clicks.test.ts`
**Produces:** `CHECKOUT_SOURCES`, `checkoutSource(v:unknown):CheckoutSource`, `internalUserIds(...lists:(string|undefined)[]):string[]`, `type CheckoutOutcome`; `recordCheckoutClick({userId,source,lang,amount,currency,outcome,orderId?}):Promise<void>`
- [ ] Test: `checkoutSource('billing')==='billing'`, `checkoutSource('x')==='other'`, `checkoutSource(undefined)==='other'`; `internalUserIds(' a, b','',undefined,'b')` deep-equals `['a','b']`.
- [ ] Implement. Table columns: id uuid, user_id, source, lang, amount, currency, outcome (CHECK constraints), order_id uuid null, event_day date default Sydney today, created_at. Index `(event_day)`.
- [ ] `npm test` passes; commit.

### Task 2: Route logging + client source
**Files:** Modify `src/app/api/checkout/route.ts`, `src/lib/use-checkout.ts`, `src/app/billing/purchase.tsx`, `src/components/AllowanceNotice.tsx`; Test `tests/checkout-route.test.ts` (esbuild fixture like `tests/conversion.test.ts`)
- [ ] Test: a paid user → 409, one click `already_paid` with source `billing`; rate limited → 429 + `rate_limited`; a recorder that throws → still 409/429 (not 500).
- [ ] Parse the body before the rate limit. Log on each outcome; the existing-open-session and new-session paths log `redirected` with order id.
- [ ] `useCheckout(source:CheckoutSource='other')` sends `{lang,source}`. Billing passes `'billing'`, UpgradeCard passes `'upgrade_card'`.
- [ ] Tests pass; commit.

### Task 3: Admin panel
**Files:** Modify `src/lib/admin/store.ts`, `src/lib/admin/data.ts`, `src/app/admin/page.tsx`; Create `src/app/admin/checkout-clicks.tsx`; Test: extend `tests/admin-store.integration.test.ts`
**Produces:** `checkoutClicks(days:1|7|30, excluded:string[]):Promise<CheckoutClicks>` with `{days,byPlan:{lang,amount,currency,clicks,people,redirected,paid}[],bySource:{source,clicks}[],recent:{at,userId,lang,source,outcome,paid}[]}`
- [ ] Integration test (RUN_DB_TESTS): insert 2 clicks for one test user → today's byPlan row has clicks 2, people 1; excluding that user removes them.
- [ ] Query params `clicks` (default 7) and `internal=1`. Links keep the other params.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` pass; commit.
