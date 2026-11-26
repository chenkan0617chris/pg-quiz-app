# Checkout click tracking — design

## Why
The owner wants to know how many people click "Buy 7-day access" and get sent to Stripe Checkout. The current `checkout_started` event cannot answer that:
- it is deduped to one per person per Sydney day, so repeated clicks are lost;
- the admin funnel groups by sign-up date, so clicks from people who signed up earlier never show;
- it does not record which button, which language/price, or what happened;
- the owner's own test account is counted.

## Goals
- One row per checkout request from a signed-in user, never deduped.
- Record: time, Sydney day, user, button (`billing` / `upgrade_card` / `other`), page language, amount and currency, outcome (`redirected` / `already_paid` / `processing` / `rate_limited` / `error`), and the order when there is one.
- Admin panel "Stripe 结账点击", grouped by click date (today / 7 / 30 days):
  - per language/price: clicks, people, sent to Stripe, paid (the click's order is `paid`);
  - a breakdown by button;
  - the 20 most recent clicks, with a short user id linked to the user detail page and no email.
- Internal accounts (`ADMIN_USER_IDS` + new `INTERNAL_USER_IDS`) are excluded by default; a "包含测试账号" toggle includes them.

## Non-goals
- No change to the existing `checkout_started` funnel.
- No backfill: data starts at deploy.
- Clicks by signed-out visitors are not logged (they get the sign-in dialog first).
- Unauthorized, wrong-origin and "payments disabled" requests are not logged.

## Approaches
1. **New `checkout_clicks` table written by `/api/checkout` (chosen).** It is server-side, so the outcome and order are exact and it cannot be faked by the client except for the `source` label.
2. Drop the per-day dedup on `conversion_events`. Rejected: it would change the meaning of the existing funnel.
3. Client-side analytics event (Vercel Analytics). Rejected: there is no outcome/order, ad blockers drop it, and it doesn't show in the admin page.

## Decisions
- Logging failures never block checkout.
- The client sends `source`; unknown values are stored as `other`.
- Migration `024_checkout_clicks.sql`. The owner applies it to production before merging.
