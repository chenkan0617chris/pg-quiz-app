import { database } from '../db';
import { accessStatus } from '../access-status';
import { FREE_MEMORY_ROUNDS, FREE_SOLVES_PER_KIND, SOLVER_KINDS } from '../access-policy';
import type { ActivityFilters } from './policy';

export const USER_PAGE_SIZE=25;
export const ACTIVITY_PAGE_SIZE=40;
export type UserUsage={userId:string;status:'paid'|'trial'|'expired';lifetime:boolean;paidUntil:string|null;trialEndsAt:string|null;
  quotas:{kind:string;used:number;limit:number}[];lastActivity:string|null;solves:number;practiceStarted:number;practiceCompleted:number;exams:number;training:number};
export type Activity={eventId:string;tool:string;action:string;occurredAt:string;freeCredits:number|null;source:string;correct:boolean|null};
const iso=(value:unknown)=>value?new Date(String(value)).toISOString():null;

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
