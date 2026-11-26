import { database } from '../db';
import { accessStatus } from '../access-status';
import { FREE_MEMORY_ROUNDS, FREE_SOLVES_PER_KIND, SOLVER_KINDS } from '../access-policy';
import type { ActivityFilters } from './policy';

export const USER_PAGE_SIZE=25;
export const ACTIVITY_PAGE_SIZE=40;
export type UserUsage={userId:string;status:'paid'|'trial'|'expired';lifetime:boolean;paidUntil:string|null;trialEndsAt:string|null;
  quotas:{kind:string;used:number;limit:number}[];lastActivity:string|null;solves:number;practiceStarted:number;practiceCompleted:number;exams:number;training:number};
export type Activity={eventId:string;tool:string;action:string;occurredAt:string;freeCredits:number|null;source:string;correct:boolean|null};
export type FunnelRow={day:string;signups:number;activated:number;paywalls:number;checkouts:number;payments:number};
export type Funnel={days:1|7|30;totals:Omit<FunnelRow,'day'>;rows:FunnelRow[]};
const iso=(value:unknown)=>value?new Date(String(value)).toISOString():null;

const funnelRow=(row:Record<string,unknown>):FunnelRow=>({
  day:String(row.day),signups:Number(row.signups),activated:Number(row.activated),
  paywalls:Number(row.paywalls),checkouts:Number(row.checkouts),payments:Number(row.payments),
});

/** Registration-date cohorts; later milestones are counted only for that same cohort. */
export async function conversionFunnel(days:1|7|30):Promise<Funnel> {
  const rows=await database()`WITH cohort AS (
    SELECT user_id,trial_started_at,(trial_started_at AT TIME ZONE 'Australia/Sydney')::date AS day
    FROM user_access
    WHERE left(user_id,5)='user_' AND user_id<>'user_test'
      AND (trial_started_at AT TIME ZONE 'Australia/Sydney')::date >= ((now() AT TIME ZONE 'Australia/Sydney')::date-${days-1}::integer)
  ) SELECT to_char(day,'YYYY-MM-DD') AS day,count(*)::int AS signups,
    count(*) FILTER (WHERE EXISTS(SELECT 1 FROM admin_activity a WHERE a.user_id=cohort.user_id AND a.occurred_at>=cohort.trial_started_at))::int AS activated,
    count(*) FILTER (WHERE EXISTS(SELECT 1 FROM conversion_events e WHERE e.user_id=cohort.user_id AND e.event='mock_paywall_viewed' AND e.created_at>=cohort.trial_started_at))::int AS paywalls,
    count(*) FILTER (WHERE EXISTS(SELECT 1 FROM conversion_events e WHERE e.user_id=cohort.user_id AND e.event='checkout_started' AND e.created_at>=cohort.trial_started_at))::int AS checkouts,
    count(*) FILTER (WHERE EXISTS(SELECT 1 FROM conversion_events e WHERE e.user_id=cohort.user_id AND e.event='payment_completed' AND e.created_at>=cohort.trial_started_at))::int AS payments
    FROM cohort GROUP BY day ORDER BY day DESC`;
  const data=rows.map(row=>funnelRow(row as Record<string,unknown>));
  return {days,rows:data,totals:data.reduce((total,row)=>({
    signups:total.signups+row.signups,activated:total.activated+row.activated,paywalls:total.paywalls+row.paywalls,
    checkouts:total.checkouts+row.checkouts,payments:total.payments+row.payments,
  }),{signups:0,activated:0,paywalls:0,checkouts:0,payments:0})};
}

/** Batched for one Clerk page; no per-user requests or writes on admin reads. */
export async function userUsage(userIds:string[]):Promise<UserUsage[]> {
  if(!userIds.length)return [];
  const rows=await database()`WITH requested AS (SELECT jsonb_array_elements_text(${JSON.stringify(userIds)}::jsonb) AS user_id)
    SELECT r.user_id,a.trial_eligible,a.trial_ends_at,a.paid_until,coalesce((to_jsonb(a)->>'paid_lifetime')::boolean,false) AS paid_lifetime,now() AS checked_at,
      coalesce(m.used,0) AS memory_used,
      (SELECT jsonb_object_agg(kind,used) FROM solver_usage WHERE user_id=r.user_id) AS solver_used,
      (SELECT max(occurred_at) FROM admin_activity WHERE user_id=r.user_id) AS last_activity,
      (SELECT count(*) FROM usage_events WHERE user_id=r.user_id AND action='solved') AS solves,
      (SELECT count(*) FROM practice_attempts WHERE user_id=r.user_id) AS practice_started,
      (SELECT count(*) FROM practice_attempts WHERE user_id=r.user_id AND submitted_at IS NOT NULL) AS practice_completed,
      (SELECT count(*) FROM mock_exams WHERE user_id=r.user_id) AS exams,
      (SELECT count(*) FROM usage_events WHERE user_id=r.user_id AND source='client' AND action='completed') AS training
    FROM requested r LEFT JOIN user_access a ON a.user_id=r.user_id LEFT JOIN memory_usage m ON m.user_id=r.user_id`;
  return rows.map(row=>({userId:String(row.user_id),
    status:row.paid_lifetime?'paid':accessStatus(row.trial_eligible?new Date(row.trial_ends_at).getTime():0,row.paid_until?new Date(row.paid_until).getTime():null,new Date(row.checked_at).getTime()),
    lifetime:Boolean(row.paid_lifetime),paidUntil:iso(row.paid_until),trialEndsAt:row.trial_eligible?iso(row.trial_ends_at):null,
    quotas:[...SOLVER_KINDS.map(kind=>({kind,used:Number(row.solver_used?.[kind]??0),limit:FREE_SOLVES_PER_KIND})),{kind:'memory',used:Number(row.memory_used),limit:FREE_MEMORY_ROUNDS}],
    lastActivity:iso(row.last_activity),solves:Number(row.solves),practiceStarted:Number(row.practice_started),practiceCompleted:Number(row.practice_completed),exams:Number(row.exams),training:Number(row.training)}));
}

export async function activityHistory(userId:string,filters:ActivityFilters):Promise<{items:Activity[];hasNext:boolean}> {
  const rows=await database()`SELECT event_id,tool,action,occurred_at,free_credits,source,correct FROM admin_activity
    WHERE user_id=${userId} AND (${filters.tool}='' OR tool=${filters.tool})
      AND (${filters.from}::timestamptz IS NULL OR occurred_at>=${filters.from}::timestamptz)
      AND (${filters.to}::timestamptz IS NULL OR occurred_at<${filters.to}::timestamptz)
    ORDER BY occurred_at DESC,event_id DESC LIMIT ${ACTIVITY_PAGE_SIZE+1} OFFSET ${(filters.page-1)*ACTIVITY_PAGE_SIZE}`;
  return {items:rows.slice(0,ACTIVITY_PAGE_SIZE).map(row=>({eventId:row.event_id,tool:row.tool,action:row.action,occurredAt:iso(row.occurred_at)!,freeCredits:row.free_credits===null?null:Number(row.free_credits),source:row.source,correct:row.correct})),hasNext:rows.length>ACTIVITY_PAGE_SIZE};
}

export type ClickCounts={clicks:number;people:number;redirected:number;paid:number};
export type CheckoutClicks={days:1|7|30;total:ClickCounts;
  byPlan:(ClickCounts&{lang:string;amount:number;currency:string})[];bySource:{source:string;clicks:number}[];
  recent:{at:string;userId:string;lang:string;source:string;outcome:string;paid:boolean}[]};
const clickCounts=(row:Record<string,unknown>):ClickCounts=>({clicks:Number(row.clicks),people:Number(row.people),redirected:Number(row.redirected),paid:Number(row.paid)});

/** Every checkout request by click date (Sydney), not by sign-up cohort. `excluded` hides owner/test accounts. */
export async function checkoutClicks(days:1|7|30,excluded:string[]):Promise<CheckoutClicks> {
  const sql=database(),params=[days-1,JSON.stringify(excluded)];
  const scope=`FROM checkout_clicks c LEFT JOIN payment_orders o ON o.id=c.order_id
    WHERE c.event_day >= ((now() AT TIME ZONE 'Australia/Sydney')::date-$1::integer)
      AND NOT (c.user_id IN (SELECT jsonb_array_elements_text($2::jsonb)))`;
  const counts=`count(*)::int AS clicks,count(DISTINCT c.user_id)::int AS people,
    count(*) FILTER (WHERE c.outcome='redirected')::int AS redirected,count(DISTINCT c.order_id) FILTER (WHERE o.status='paid')::int AS paid`;
  const [total,plans,sources,recent]=await Promise.all([
    sql.query(`SELECT ${counts} ${scope}`,params),
    sql.query(`SELECT c.lang,c.amount,c.currency,${counts} ${scope} GROUP BY c.lang,c.amount,c.currency ORDER BY clicks DESC`,params),
    sql.query(`SELECT c.source,count(*)::int AS clicks ${scope} GROUP BY c.source ORDER BY clicks DESC`,params),
    sql.query(`SELECT c.created_at,c.user_id,c.lang,c.source,c.outcome,coalesce(o.status='paid',false) AS paid ${scope} ORDER BY c.created_at DESC LIMIT 20`,params),
  ]) as Record<string,unknown>[][];
  return {days,total:clickCounts(total[0]),
    byPlan:plans.map(row=>({...clickCounts(row),lang:String(row.lang),amount:Number(row.amount),currency:String(row.currency)})),
    bySource:sources.map(row=>({source:String(row.source),clicks:Number(row.clicks)})),
    recent:recent.map(row=>({at:iso(row.created_at)!,userId:String(row.user_id),lang:String(row.lang),source:String(row.source),outcome:String(row.outcome),paid:Boolean(row.paid)}))};
}
