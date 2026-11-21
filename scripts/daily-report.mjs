#!/usr/bin/env node
/**
 * Read-only user-behaviour report for one Sydney calendar day or week.
 * .env.report = `vercel env pull .env.report --environment=production` (production US Neon DB).
 * Prints aggregates only: no emails, user IDs, answers or payment secrets.
 *
 *   node --env-file=.env.report scripts/daily-report.mjs day  [YYYY-MM-DD]   # default: yesterday (Sydney)
 *   node --env-file=.env.report scripts/daily-report.mjs week [YYYY-MM-DD]   # 7 days ending that date (default: yesterday)
 */
import { neon } from '@neondatabase/serverless';

const TZ = 'Australia/Sydney';
const mode = process.argv[2] ?? 'day';
if (!['day', 'week'].includes(mode)) throw new Error('mode must be day or week');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const sql = neon(process.env.DATABASE_URL);

const ymd = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d);
const endDay = process.argv[3] ?? ymd(new Date(Date.now() - 86400000));
if (!/^\d{4}-\d{2}-\d{2}$/.test(endDay)) throw new Error('date must be YYYY-MM-DD');
const span = mode === 'day' ? 1 : 7;

// Window boundaries are computed in Postgres so Sydney DST is handled correctly.
const [{ since, until, prev_since }] = await sql`
  SELECT ((${endDay}::date - ${span - 1}::int)::timestamp AT TIME ZONE ${TZ}) AS since,
         ((${endDay}::date + 1)::timestamp AT TIME ZONE ${TZ}) AS until,
         ((${endDay}::date - ${2 * span - 1}::int)::timestamp AT TIME ZONE ${TZ}) AS prev_since`;

const real = sql`left(user_id,5)='user_' AND user_id<>'user_test'`;

async function windowStats(from, to) {
  const [signups, active, tools, practice, exams, payments, funnel, conversions] = await Promise.all([
    sql`SELECT count(*)::int AS n FROM user_access
        WHERE left(user_id,5)='user_' AND user_id<>'user_test' AND trial_started_at>=${from} AND trial_started_at<${to}`,
    sql`SELECT count(DISTINCT a.user_id)::int AS active_users,
               count(DISTINCT a.user_id) FILTER (WHERE u.trial_started_at>=${from})::int AS active_new,
               count(DISTINCT a.user_id) FILTER (WHERE u.trial_started_at<${from})::int AS active_returning
        FROM admin_activity a LEFT JOIN user_access u USING(user_id)
        WHERE left(a.user_id,5)='user_' AND a.user_id<>'user_test' AND a.occurred_at>=${from} AND a.occurred_at<${to}`,
    sql`SELECT tool, action, count(*)::int AS events, count(DISTINCT user_id)::int AS users,
               count(*) FILTER (WHERE correct)::int AS correct
        FROM admin_activity
        WHERE left(user_id,5)='user_' AND user_id<>'user_test' AND occurred_at>=${from} AND occurred_at<${to}
        GROUP BY tool, action ORDER BY events DESC`,
    sql`SELECT question->>'kind' AS kind, (sample_key IS NOT NULL) AS fixed_sample,
               count(*)::int AS started, count(submitted_at)::int AS submitted,
               count(*) FILTER (WHERE correct)::int AS correct, count(DISTINCT user_id)::int AS users
        FROM practice_attempts
        WHERE left(user_id,5)='user_' AND user_id<>'user_test' AND created_at>=${from} AND created_at<${to}
        GROUP BY 1,2 ORDER BY started DESC`,
    sql`SELECT count(*)::int AS started, count(finished_at)::int AS finished, count(DISTINCT user_id)::int AS users,
               round(avg(extract(epoch FROM finished_at-created_at)/60) FILTER (WHERE finished_at IS NOT NULL)::numeric,1) AS avg_minutes
        FROM mock_exams
        WHERE left(user_id,5)='user_' AND user_id<>'user_test' AND created_at>=${from} AND created_at<${to}`,
    sql`SELECT status, currency, count(*)::int AS orders, count(DISTINCT user_id)::int AS buyers, sum(amount)::bigint AS amount_minor
        FROM payment_orders
        WHERE left(user_id,5)='user_' AND user_id<>'user_test' AND livemode=true AND created_at>=${from} AND created_at<${to}
        GROUP BY 1,2 ORDER BY 1,2`,
    // Funnel for accounts created in this window. Every later step is bounded by the
    // window end so re-running the report on a later day gives the same numbers and
    // matches conversionEvents below.
    sql`WITH cohort AS (
          SELECT user_id FROM user_access
          WHERE left(user_id,5)='user_' AND user_id<>'user_test' AND trial_started_at>=${from} AND trial_started_at<${to}),
        ev AS (SELECT user_id, event FROM conversion_events WHERE created_at<${to})
        SELECT count(*)::int AS signed_up,
          count(*) FILTER (WHERE EXISTS (SELECT 1 FROM admin_activity a WHERE a.user_id=c.user_id AND a.occurred_at<${to}))::int AS used_any_feature,
          count(*) FILTER (WHERE EXISTS (SELECT 1 FROM admin_activity a WHERE a.user_id=c.user_id AND a.tool LIKE 'solver:%' AND a.occurred_at<${to}))::int AS used_solver,
          count(*) FILTER (WHERE EXISTS (SELECT 1 FROM practice_attempts p WHERE p.user_id=c.user_id AND p.created_at<${to}))::int AS started_practice,
          count(*) FILTER (WHERE EXISTS (SELECT 1 FROM mock_exams m WHERE m.user_id=c.user_id AND m.created_at<${to}))::int AS started_mock_exam,
          count(*) FILTER (WHERE EXISTS (SELECT 1 FROM ev e WHERE e.user_id=c.user_id AND e.event='mock_paywall_viewed'))::int AS saw_mock_paywall,
          count(*) FILTER (WHERE EXISTS (SELECT 1 FROM ev e WHERE e.user_id=c.user_id AND e.event='upgrade_prompt_viewed'))::int AS saw_upgrade_prompt,
          count(*) FILTER (WHERE EXISTS (SELECT 1 FROM ev e WHERE e.user_id=c.user_id AND e.event='pricing_viewed'))::int AS viewed_pricing,
          count(*) FILTER (WHERE EXISTS (SELECT 1 FROM ev e WHERE e.user_id=c.user_id AND e.event='checkout_started')
                              OR EXISTS (SELECT 1 FROM payment_orders o WHERE o.user_id=c.user_id AND o.livemode AND o.created_at<${to}))::int AS opened_checkout,
          count(*) FILTER (WHERE EXISTS (SELECT 1 FROM payment_orders o WHERE o.user_id=c.user_id AND o.livemode AND o.status='paid' AND o.created_at<${to}))::int AS paid
        FROM cohort c`,
    // All users (not just new ones) hitting each conversion milestone in the window.
    sql`SELECT event, count(DISTINCT user_id)::int AS users FROM conversion_events
        WHERE left(user_id,5)='user_' AND user_id<>'user_test' AND created_at>=${from} AND created_at<${to}
        GROUP BY event ORDER BY event`,
  ]);
  return { signups: signups[0].n, active: active[0], toolUsage: tools, practice, mockExams: exams[0], liveOrders: payments, signupFunnel: funnel[0], conversionEvents: conversions };
}

const [current, previous, totals, journeys] = await Promise.all([
  windowStats(since, until),
  windowStats(prev_since, since),
  sql`SELECT count(*)::int AS total_accounts,
             count(*) FILTER (WHERE paid_until>now() OR coalesce(paid_lifetime,false))::int AS currently_paid
      FROM user_access WHERE left(user_id,5)='user_' AND user_id<>'user_test'`,
  // Anonymised per-user journeys (first 30 active users), ordered tool sequence + minutes spent.
  sql`SELECT row_number() OVER (ORDER BY min(a.occurred_at))::int AS user_no,
             bool_or(u.trial_started_at>=${since}) AS new_account,
             count(*)::int AS events,
             round(extract(epoch FROM max(a.occurred_at)-min(a.occurred_at))/60)::int AS minutes_span,
             string_agg(a.tool||':'||a.action, ' > ' ORDER BY a.occurred_at) AS sequence
      FROM admin_activity a LEFT JOIN user_access u USING(user_id)
      WHERE left(a.user_id,5)='user_' AND a.user_id<>'user_test' AND a.occurred_at>=${since} AND a.occurred_at<${until}
      GROUP BY a.user_id ORDER BY min(a.occurred_at) LIMIT 30`,
]);

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  timezone: TZ,
  mode,
  window: { firstDay: ymd(new Date(since)), lastDay: endDay, since, until },
  previousWindow: { since: prev_since, until: since },
  current, previous, totals: totals[0], journeys,
  caveats: [
    'Only initialized app accounts (Clerk-style user_ IDs) are counted; not the full Clerk signup count.',
    'Order time uses payment_orders.created_at (checkout opened), not the exact Stripe payment time.',
    'Amounts are minor units per currency; do not add currencies together.',
    'Owner test payments cannot be excluded automatically.',
    'Mock exams are paid-only since 2026-11-20; mock_paywall_viewed counts free users blocked at the mock exam.',
    'conversion_events started recording on 2026-11-20 (upgrade_prompt_viewed / pricing_viewed after migration 021); earlier windows show 0 for them.',
    'signupFunnel follows the window cohort up to the window end only, so it matches conversionEvents and does not change on later re-runs.',
    'pricing_viewed = a signed-in free account opened /billing; anonymous price-page views are only in Vercel Analytics (/billing, /*/pricing).',
    'Journeys are anonymised and capped at 30 users.',
  ],
}, null, 2));
