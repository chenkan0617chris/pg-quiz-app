# CNY 9.90 for seven days — 2026-11-04

New purchases cost CNY 9.90 and grant all features for 168 hours from payment
fulfillment. There is no automatic renewal and unused trial time is not added.
Registration continues to grant a 24-hour trial from the server-side Clerk
registration timestamp. Repeated sign-in cannot restart the trial. Existing free
allowances remain available after trial or timed paid access expires.

Migration `015_weekly_membership.sql` was applied to production in a transaction
before the application release. It admits CNY 990-cent orders and grants seven
days while preserving historical CNY 1990-cent lifetime purchases and other
historical 30-day orders. Existing access and trial dates were not rewritten.
Checkout retires open old-price sessions when a user next starts checkout;
completed old orders remain fulfillable on their original terms. Refund handling
continues to recalculate access from the remaining paid orders.

Production deployment `dpl_BHzZb4dsTDH6zNioaA7gGBHLJakW` reached READY and was
aliased to https://quiz.ckautoflow.com. Both language homepages, both pricing
pages and `/billing` returned HTTP 200 with the new price, seven-day duration and
24-hour trial. Browser inspection confirmed the new pricing and enabled purchase
button for guests. A forged webhook signature returned HTTP 400.

Validation: 48 unit tests, 13 isolated database integration tests and 15 browser
component tests passed. Lint, production build and the isolated historical
lifetime-payment SQL regression passed. Database tests cover seven-day grants,
expiry, duplicate fulfillment, refunds, sandbox isolation and 24-hour registration
trials. No real charge or successful live-payment webhook was executed in this
release verification; the browser session was signed out.

Do not replay all historical migrations against production. If rolling the app
back, retain migration 015 so already-created seven-day orders can still fulfill.
