import { database } from './db';
import { accessStatus } from './access-status';
import { FREE_MEMORY_ROUNDS, FREE_SOLVES_PER_KIND, SOLVER_KINDS, type SolverKind, type SolverRemaining } from './access-policy';

export async function readAccess(userId:string) {
  const sql=database();
  const [row]=await sql`SELECT trial_ends_at, trial_eligible, paid_until, now() AS checked_at,
    (SELECT used FROM memory_usage WHERE user_id=${userId}) AS memory_used,
    (SELECT jsonb_object_agg(kind,used) FROM solver_usage WHERE user_id=${userId}) AS usage
    FROM user_access WHERE user_id=${userId}`;
  if(!row)return null;
  return {
    status:accessStatus(row.trial_eligible?new Date(row.trial_ends_at).getTime():0,row.paid_until?new Date(row.paid_until).getTime():null,new Date(row.checked_at).getTime()),
    memoryRemaining:FREE_MEMORY_ROUNDS-Number(row.memory_used??0),
    solverRemaining:Object.fromEntries(SOLVER_KINDS.map(kind=>[kind,FREE_SOLVES_PER_KIND-Number(row.usage?.[kind]??0)])) as SolverRemaining,
    trialEndsAt:new Date(row.trial_ends_at).toISOString(),
    paidUntil:row.paid_until?new Date(row.paid_until).toISOString():null,
  };
}
/** Registration time comes from Clerk on the server, never from a browser. */
export async function initializeAccess(userId:string,registeredAt:number) {
  if(!Number.isFinite(registeredAt))throw new Error('Invalid registration time');
  const sql=database();
  const start=new Date(registeredAt).toISOString();
  await sql`INSERT INTO user_access(user_id,trial_started_at,trial_ends_at,trial_eligible)
    SELECT ${userId},${start}::timestamptz,${start}::timestamptz+interval '7 days',
      ${start}::timestamptz < legacy_trial_cutoff FROM access_policy WHERE id=1
    ON CONFLICT (user_id) DO NOTHING`;
  const access=await readAccess(userId);
  if(!access)throw new Error('Access unavailable');
  return access;
}

/** Atomic cap shared by all server instances. Paid/legacy access never consumes it. */
export async function consumeFreeSolve(userId:string,kind:SolverKind) {
  const sql=database();
  const [row]=await sql`INSERT INTO solver_usage(user_id,kind,used) VALUES (${userId},${kind},1)
    ON CONFLICT (user_id,kind) DO UPDATE SET used=solver_usage.used+1
    WHERE solver_usage.used < ${FREE_SOLVES_PER_KIND} RETURNING used`;
  return row ? FREE_SOLVES_PER_KIND-Number(row.used) : null;
}
