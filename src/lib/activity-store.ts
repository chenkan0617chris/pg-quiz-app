import { database } from './db';
import type { SolverKind } from './access-policy';

export async function recordFullAccessSolve(userId:string,kind:SolverKind) {
  await database()`INSERT INTO usage_events(user_id,tool,action,free_credits,source)
    VALUES (${userId},${`solver:${kind}`},'solved',0,'server')`;
}

/** Only client-only familiarization exercises use this path. No answers are stored. */
export async function recordTrainingActivity(userId:string,tool:'training:grid'|'training:peak',action:'started'|'completed',sessionId:string) {
  await database()`INSERT INTO usage_events(user_id,tool,action,free_credits,source,session_id)
    VALUES (${userId},${tool},${action},0,'client',${sessionId}::uuid)
    ON CONFLICT(user_id,tool,action,session_id) DO NOTHING`;
}
