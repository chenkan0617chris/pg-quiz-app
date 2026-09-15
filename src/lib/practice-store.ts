import { randomUUID } from 'node:crypto';
import { database } from './db';
import { generateQuestion,gradeAnswer,publicQuestion,explainQuestion,type Difficulty,type PracticeQuestion } from './practice';

type Row = {id:string;question:PracticeQuestion;answer:number[]|null;correct:boolean|null;created_at:string;submitted_at:string|null};
function result(row:Row) {
  return {id:row.id,question:publicQuestion(row.question),answer:row.answer,correct:row.correct,
    referenceAnswer:row.question.answer,explanation:explainQuestion(row.question,row.answer??[]),submittedAt:row.submitted_at};
}

export async function createPractice(userId:string,kind:PracticeQuestion['kind'],retryId?:string,difficulty:Difficulty='easy') {
  const sql=database();
  let question:PracticeQuestion;
  if(retryId) {
    const [old]=await sql`SELECT question FROM practice_attempts WHERE id=${retryId} AND user_id=${userId} AND submitted_at IS NOT NULL`;
    if(!old) return null;
    question=old.question as PracticeQuestion;
  } else question=generateQuestion(kind,difficulty);
  const id=randomUUID();
  await sql`INSERT INTO practice_attempts(id,user_id,question) VALUES (${id},${userId},${JSON.stringify(question)}::jsonb)`;
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

export async function practiceHistory(userId:string) {
  const sql=database();
  const rows=await sql`SELECT * FROM practice_attempts WHERE user_id=${userId} AND submitted_at IS NOT NULL ORDER BY submitted_at DESC LIMIT 50`;
  return rows.map(row=>result(row as Row));
}
