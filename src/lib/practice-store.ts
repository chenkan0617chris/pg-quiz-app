import { randomUUID } from 'node:crypto';
import { database } from './db';
import { generateQuestion,gradeAnswer,publicQuestion,explainQuestion,type Difficulty,type PracticeQuestion } from './practice';
import { FREE_MEMORY_ROUNDS, FREE_PRACTICE_PER_KIND } from './access-policy';

export class PracticeAccessError extends Error {}

type Row = {id:string;question:PracticeQuestion;answer:number[]|null;correct:boolean|null;created_at:string;submitted_at:string|null};
function result(row:Row) {
  return {id:row.id,question:publicQuestion(row.question),answer:row.answer,correct:row.correct,
    referenceAnswer:row.question.answer,explanation:explainQuestion(row.question,row.answer??[]),submittedAt:row.submitted_at};
}

export async function createPractice(userId:string,kind:PracticeQuestion['kind'],retryId?:string,difficulty:Difficulty='easy',fullAccess=true) {
  const sql=database();
  let question:PracticeQuestion;
  let sampleKey:string|null=null;
  if(retryId) {
    const [old]=await sql`SELECT question,sample_key FROM practice_attempts WHERE id=${retryId} AND user_id=${userId} AND submitted_at IS NOT NULL`;
    if(!old) return null;
    // Free accounts may redo questions they were given for free; memory rounds always use a credit.
    if(!fullAccess&&!old.sample_key)throw new PracticeAccessError('Paid practice requires membership');
    sampleKey=old.sample_key;
    question=old.question as PracticeQuestion;
  } else {
    question=generateQuestion(kind,difficulty);
    // Marks free-generated rows so the owner can retry them without membership.
    if(!fullAccess)sampleKey=`free:${kind}`;
  }
  const id=randomUUID();
  const payload=JSON.stringify(question);
  if(!fullAccess && question.kind==='memory') {
    // One statement: reserve a lifetime credit and create the round, or do neither.
    const rows=await sql`WITH allowance AS (
      INSERT INTO memory_usage(user_id,used) VALUES (${userId},1)
      ON CONFLICT(user_id) DO UPDATE SET used=memory_usage.used+1
      WHERE memory_usage.used < ${FREE_MEMORY_ROUNDS} RETURNING used
    ) INSERT INTO practice_attempts(id,user_id,question,sample_key,free_credits)
      SELECT ${id},${userId},${payload}::jsonb,${sampleKey},1 FROM allowance RETURNING id`;
    if(!rows.length)throw new PracticeAccessError('Memory allowance exhausted');
  } else if(!fullAccess && !retryId) {
    const rows=await sql`WITH allowance AS (
      INSERT INTO practice_usage(user_id,kind,used) VALUES (${userId},${question.kind},1)
      ON CONFLICT(user_id,kind) DO UPDATE SET used=practice_usage.used+1
      WHERE practice_usage.used < ${FREE_PRACTICE_PER_KIND} RETURNING used
    ) INSERT INTO practice_attempts(id,user_id,question,sample_key,free_credits)
      SELECT ${id},${userId},${payload}::jsonb,${sampleKey},1 FROM allowance RETURNING id`;
    if(!rows.length)throw new PracticeAccessError('Practice allowance exhausted');
  } else {
    await sql`INSERT INTO practice_attempts(id,user_id,question,sample_key,free_credits) VALUES (${id},${userId},${payload}::jsonb,${sampleKey},0)`;
  }
  return {id,question:publicQuestion(question)};
}

export async function submitPractice(userId:string,id:string,answer:number[]) {
  const sql=database();
  const [stored]=await sql`SELECT * FROM practice_attempts WHERE id=${id} AND user_id=${userId}`;
  if(!stored) return null;
  const row=stored as Row;
  if(row.submitted_at) return result(row);
  const correct=gradeAnswer(row.question,answer);
  const [updated]=await sql`UPDATE practice_attempts SET answer=${JSON.stringify(answer)}::jsonb,correct=${correct},submitted_at=now()
    WHERE id=${id} AND user_id=${userId} AND submitted_at IS NULL RETURNING *`;
  if(updated) return result(updated as Row);
  // Another submission won the atomic update; return that same saved result.
  const [winner]=await sql`SELECT * FROM practice_attempts WHERE id=${id} AND user_id=${userId}`;
  return result(winner as Row);
}

export async function practiceHistory(userId:string,scope:'all'|'bank'|'memory'='all') {
  const sql=database();
  const rows=await sql`SELECT * FROM practice_attempts WHERE user_id=${userId} AND submitted_at IS NOT NULL
    AND (${scope}='all' OR (${scope}='memory' AND question->>'kind'='memory') OR (${scope}='bank' AND question->>'kind'<>'memory'))
    ORDER BY submitted_at DESC LIMIT 50`;
  return rows.map(row=>result(row as Row));
}

/** Account-owned lifetime practice counts, not a paid-period usage claim. */
export async function practiceUsage(userId:string) {
 const rows=await database()`SELECT question->>'kind' AS kind, count(*)::int AS started,
   count(submitted_at)::int AS completed FROM practice_attempts WHERE user_id=${userId}
   GROUP BY question->>'kind'`;
 return Object.fromEntries(rows.map(row=>[row.kind,{started:Number(row.started),completed:Number(row.completed)}]));
}
