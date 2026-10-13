# Lifetime membership and 24-hour trial

New checkout charges CNY 19.90 once and grants every app feature permanently.
New registrations receive 24 hours of the same access, timed from the server-side
Clerk registration timestamp. Trial and paid use do not consume free allowances.
After the trial, the existing lifetime allowances remain: 10 uses per solver,
10 memory rounds and fixed practice samples. These allowances do not reset.

## Database and release order

Apply `db/migrations/014_lifetime_membership.sql` in one transaction before
deploying the new application. Apply only pending migrations; the repository's
bootstrap `scripts/migrate.mjs` replays historical migrations and is not suitable
for updating a populated database with new-price orders.

The migration preserves existing eligible trials and old paid orders. Previously
ineligible accounts receive an end time 24 hours after their original registration,
so returning users do not restart a trial. Old pending orders retain their original
30-day entitlement; the new checkout expires open old-price sessions before replacing
them. CNY 19.90 orders grant explicit lifetime access. Refunds recalculate entitlements
from remaining paid live orders, and sandbox orders never grant live access.

The changes are local until the migration and application release are deployed.
After deployment, verify a newly registered account, trial expiry, actual CNY 19.90
checkout, webhook fulfillment and refund. Do not claim live payment verification
from the automated fixtures alone.

## Verification

- `npm test`, `npm run lint`, `npm run build`
- Billing comparison and account overview Playwright component tests
- Access, payments, free allowances and memory database integration tests in a
  disposable database
- `tests/lifetime-payment.sql` against an isolated migrated PostgreSQL database
  checks duplicate fulfillment, sandbox separation, legacy orders and refunds
  with multiple entitlements
