# English USD 14.99 / Chinese CNY 9.90 — 2026-11-11

Price is chosen by site language: English pages charge USD 14.99, Chinese pages
keep CNY 9.90 (Alipay / WeChat Pay). Both grant 168 hours, no auto-renewal.
The proxy now stores the language of the last locale-prefixed page in the `lang`
cookie, so `/billing` shows and charges the price of the page the visitor came from.

Release order: apply ONLY `db/migrations/017_usd_weekly_price.sql` to production
in a transaction, then push / deploy. Do not replay historical migrations.
Without 017, English checkout fails the price constraint (HTTP 503).

Validation: 50 unit tests, 14 isolated database integration tests (including the
new USD grant/refund test), lint, type-check and production build passed. Local
browser check: /en → /billing shows US$14.99, /zh → /billing shows ¥9.9.

The 18 live refunded CNY 29.90 orders and 18 sandbox paid orders in production
were left by an earlier run of `tests/payments.integration.test.ts` with
RUN_DB_TESTS against the production database (that test did not clean up; it
now does). Their user ids start with `payment_test_`. Always run DB tests via
`node scripts/test-admin-db.mjs`, which uses a disposable database.
