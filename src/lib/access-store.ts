import { database } from './db';
import { accessStatus } from './access-status';

export async function readAccess(userId:string) {
  const sql=database();
  const [row]=await sql`SELECT trial_ends_at, paid_until, now() AS checked_at FROM user_access WHERE user_id=${userId}`;
  if(!row)return null;
  return {
    status:accessStatus(new Date(row.trial_ends_at).getTime(),row.paid_until?new Date(row.paid_until).getTime():null,new Date(row.checked_at).getTime()),
    trialEndsAt:new Date(row.trial_ends_at).toISOString(),
    paidUntil:row.paid_until?new Date(row.paid_until).toISOString():null,
  };
}
/** Registration time comes from Clerk on the server, never from a browser. */
export async function initializeAccess(userId:string,registeredAt:number) {
  if(!Number.isFinite(registeredAt))throw new Error('Invalid registration time');
  const sql=database();
  const start=new Date(registeredAt).toISOString();
  await sql`INSERT INTO user_access(user_id,trial_started_at,trial_ends_at)
    VALUES (${userId},${start}::timestamptz,${start}::timestamptz+interval '7 days')
    ON CONFLICT (user_id) DO NOTHING`;
  const access=await readAccess(userId);
  if(!access)throw new Error('Access unavailable');
  return access;
}
