# Admin usage dashboard

Open `/admin` after signing in with an authorized account. The sidebar exposes the entry only to administrators.

## Configuration

Set server-only `ADMIN_USER_IDS` to a comma-separated list of **Clerk user IDs** in the target Vercel environment, then deploy. Confirm the owner's login email and resolve its Clerk user ID before granting access. Never use a `NEXT_PUBLIC_` variable. Missing/empty configuration denies everyone. No browser metadata controls this permission.

Apply `db/migrations/013_admin_activity.sql` to the target database before releasing this code. It only creates the event table/view/index and adds a nullable practice credit field. It is idempotent. Do not replay older migrations against production to apply this update (old migrations may reset business rules).

## Coverage

- Clerk lists all registered users, including those with no database activity, 25 per page. Search matches the Clerk user directory.
- Quotas show lifetime consumption per solver and memory training; totals are not transferable between tools.
- Solver events record successful authorized responses, including membership/trial usage at zero free-credit cost. Free credit reservation and log insertion are atomic.
- Practice starts/submissions and mock-exam starts/completions use the existing stored timestamps. Old practice credit cost is unknown, not assumed to be zero.
- Grid and PEAK samples report signed-in users' first interaction and completion, with retry-safe session deduplication. These are labeled client-reported, best effort; no answers are saved.
- Events before solver logging was introduced cannot be reconstructed. Historical quota counters remain visible.
- Timeline filters use UTC date boundaries (end date inclusive), and displayed times use Australia/Sydney. The timeline is paginated, 40 per page.
- Permanent membership is recognized when the optional `paid_lifetime` column exists; the dashboard also works before that separate migration is applied.

Admin reads require a fresh server authorization check; responses are dynamic and noindex. This dashboard has no account, billing, or quota mutation features.

## Validation

`npm test`, `npm run lint`, `npm run build`.

`node scripts/test-admin-db.mjs` creates a temporary database, applies migrations there, runs all integration tests, and force-drops only that generated temporary database afterward. It requires a database role with CREATE DATABASE permission. Optional test filenames limit the run. Never set RUN_DB_TESTS directly against production.

`npx playwright test tests/e2e/admin.spec.ts` verifies the actual page components with mocked identity/data, plus a live anonymous route check. For live production checks set `PLAYWRIGHT_BASE_URL` to the deployed site and use `--grep 'live routes'`. Component fixtures contain only synthetic test identities.
