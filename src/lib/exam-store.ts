import { randomUUID } from 'node:crypto';
import { database } from './db';
import { newExam, transitionExam, examView, examReport } from './exam';
import type { ExamState, ExamCommand, ExamListItem } from './exam-types';

export async function createExam(userId:string) {
  const sql=database();
  const id=randomUUID();
  const state=newExam(id,Date.now());
  const rows=await sql`INSERT INTO mock_exams(id,user_id,state) VALUES (${id},${userId},${JSON.stringify(state)}::jsonb)
    ON CONFLICT (user_id) WHERE finished_at IS NULL DO NOTHING RETURNING state`;
  if(rows[0])return examView(rows[0].state as ExamState,Date.now());
  const [active]=await sql`SELECT id FROM mock_exams WHERE user_id=${userId} AND finished_at IS NULL`;
  if(!active)throw new Error('Retry starting exam');
  return updateExam(userId,active.id,{action:'sync'});
}

/** CAS makes grading first-writer-wins across tabs and function instances. */
export async function updateExam(userId:string,id:string,command:ExamCommand) {
  const sql=database();
  for(let attempt=0;attempt<5;attempt++){
    const [row]=await sql`SELECT state,revision FROM mock_exams WHERE id=${id} AND user_id=${userId}`;
    if(!row)return null;
    const now=Date.now();
    const previous=row.state as ExamState;
    const state=transitionExam(previous,command,now);
    if(JSON.stringify(previous)===JSON.stringify(state))return examView(state,now);
    const finished=state.finishedAt===null?null:new Date(state.finishedAt).toISOString();
    const updated=await sql`UPDATE mock_exams SET state=${JSON.stringify(state)}::jsonb,revision=revision+1,finished_at=${finished}::timestamptz
      WHERE id=${id} AND user_id=${userId} AND revision=${row.revision} RETURNING id`;
    if(updated.length)return examView(state,now);
  }
  throw new Error('Concurrent exam update; retry');
}
export async function getExamReport(userId:string,id:string) {
  const [row]=await database()`SELECT state FROM mock_exams WHERE id=${id} AND user_id=${userId} AND finished_at IS NOT NULL`;
  return row?examReport(row.state as ExamState):null;
}
export async function listExams(userId:string):Promise<ExamListItem[]> {
  const rows=await database()`SELECT id,state->>'createdAt' AS created,state->>'finishedAt' AS finished,state->>'phase' AS phase,
    CASE WHEN finished_at IS NOT NULL THEN state ELSE NULL END AS completed_state
    FROM mock_exams WHERE user_id=${userId} ORDER BY created_at DESC LIMIT 50`;
  return rows.map(row=>({id:row.id,createdAt:Number(row.created),finishedAt:row.finished?Number(row.finished):null,
    phase:row.phase,score:row.completed_state?examReport(row.completed_state as ExamState).score:null}));
}
