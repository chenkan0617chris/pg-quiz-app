import { auth } from '@clerk/nextjs/server';
import { practiceUsage } from '@/lib/practice-store';
import { getAccess } from '@/lib/access';
import { allowRequest, database } from '@/lib/db';
import { solveCount } from '@/lib/activity-store';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});

async function review(userId:string) {
  const [row]=await database()`WITH answered AS (
    SELECT correct,
      row_number() OVER (ORDER BY submitted_at,id) AS first_rank,
      row_number() OVER (ORDER BY submitted_at DESC,id DESC) AS recent_rank
    FROM practice_attempts WHERE user_id=${userId} AND submitted_at IS NOT NULL
  ) SELECT count(*)::int AS completed,
    count(*) FILTER (WHERE correct)::int AS correct,
    count(*) FILTER (WHERE first_rank<=10)::int AS first_completed,
    count(*) FILTER (WHERE first_rank<=10 AND correct)::int AS first_correct,
    count(*) FILTER (WHERE recent_rank<=10)::int AS recent_completed,
    count(*) FILTER (WHERE recent_rank<=10 AND correct)::int AS recent_correct,
    (SELECT count(*)::int FROM mock_exams WHERE user_id=${userId} AND finished_at IS NOT NULL) AS mock_exams
    FROM answered`;
  return {
    completed:Number(row?.completed??0),correct:Number(row?.correct??0),
    firstCompleted:Number(row?.first_completed??0),firstCorrect:Number(row?.first_correct??0),
    recentCompleted:Number(row?.recent_completed??0),recentCorrect:Number(row?.recent_correct??0),
    mockExams:Number(row?.mock_exams??0),
  };
}

export async function GET() {
  const {userId}=await auth();
  if(!userId)return reply({error:'Unauthorized'},401);
  try {
    if(!await allowRequest(userId,'account',60))return reply({error:'Too many requests'},429);
    const [access,usage,solves,progress]=await Promise.all([getAccess(userId),practiceUsage(userId),solveCount(userId),review(userId)]);
    return reply({...access,practiceUsage:usage,solves,progress});
  }catch{return reply({error:'Service unavailable'},503);}
}
