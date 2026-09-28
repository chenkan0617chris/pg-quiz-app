#!/usr/bin/env node
/** Read-only aggregate report. No emails, IDs, answers, or payment secrets are printed. */
import { neon } from '@neondatabase/serverless';
const days=Number(process.argv[2]??30);
if(!Number.isInteger(days)||days<1||days>366)throw new Error('Choose 1–366 days');
if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required');
const sql=neon(process.env.DATABASE_URL);
const since=new Date(Date.now()-days*86400000).toISOString();
const [accounts,practice,orders,allowances]=await Promise.all([
 sql`SELECT count(*)::int AS accounts_registered, count(*) FILTER (WHERE paid_until>now())::int AS currently_paid
     FROM user_access WHERE left(user_id,5)='user_' AND user_id<>'user_test' AND trial_started_at>=${since}::timestamptz`,
 sql`SELECT question->>'kind' AS kind, (sample_key IS NOT NULL) AS fixed_sample,
     count(*)::int AS starts, count(submitted_at)::int AS completed, count(DISTINCT user_id)::int AS learners,
     count(*) FILTER (WHERE correct)::int AS correct
     FROM practice_attempts WHERE left(user_id,5)='user_' AND user_id<>'user_test' AND created_at>=${since}::timestamptz
     GROUP BY question->>'kind',(sample_key IS NOT NULL) ORDER BY kind,fixed_sample`,
 sql`SELECT currency,status,count(*)::int AS orders,count(DISTINCT user_id)::int AS buyers,sum(amount)::bigint AS amount_minor_units
     FROM payment_orders WHERE left(user_id,5)='user_' AND user_id<>'user_test' AND livemode=true
     AND status IN ('paid','refunded') AND granted_until-interval '30 days'>=${since}::timestamptz
     GROUP BY currency,status ORDER BY currency,status`,
 sql`SELECT kind,count(*)::int AS accounts_using_allowance,sum(used)::int AS free_uses,
     count(*) FILTER (WHERE used=10)::int AS accounts_at_limit
     FROM solver_usage WHERE left(user_id,5)='user_' AND user_id<>'user_test' GROUP BY kind ORDER BY kind`,
]);
console.log(JSON.stringify({generatedAt:new Date().toISOString(),window:{days,since},accounts:accounts[0],practice,confirmedPayments:orders,lifetimeFreeAllowances:allowances,
 caveats:[
 'Only initialized app accounts with Clerk-style user IDs are included; this is not the total Clerk signup count.',
 'Accounts and practice use registration/start time. Completed counts reflect current state of attempts started in this window.',
 'Payment time is inferred from granted_until minus the current 30-day grant duration. Paid/refunded states come from server fulfillment, not button clicks. Refund amounts and Stripe fees are not available here.',
 'Amounts are minor currency units, grouped by currency; do not combine them without conversion. Orders marked refunded are not counted as retained paid revenue.',
 'Free-use counters are lifetime totals, not usage during this report window.',
 'No visitor, campaign-to-order, geography or signup conversion rate can be calculated from these tables. Use existing web analytics and Search Console for traffic, and keep their denominators separate.',
 'Historical generated practice may have come from the old full-feature trial; generated does not itself mean paid.',
 'Production-owner test payments cannot be identified automatically. Exclude known test transactions before treating payments as customer demand.'
 ]},null,2));
