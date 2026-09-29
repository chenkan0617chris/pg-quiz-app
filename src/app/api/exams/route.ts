import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { getAccess } from '@/lib/access';
import { hasFullAccess } from '@/lib/access-policy';
import { readJson } from '@/lib/request-body';
import { allowRequest } from '@/lib/db';
import { createExam, updateExam, listExams, getExamReport } from '@/lib/exam-store';

const schema=z.discriminatedUnion('action',[
  z.object({action:z.literal('create')}),
  z.object({action:z.literal('begin'),id:z.uuid(),section:z.number().int().min(0).max(2)}),
  z.object({action:z.literal('answer'),id:z.uuid(),questionId:z.uuid(),answer:z.array(z.number().int().min(0).max(25)).max(16)}),
  z.object({action:z.enum(['sync','finish']),id:z.uuid()}),
]);
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){
  const {userId}=await auth();
  if(!userId)return reply({error:'Unauthorized'},401);
  const id=new URL(request.url).searchParams.get('report');
  if(id&&!z.uuid().safeParse(id).success)return reply({error:'Invalid input'},400);
  try{
    if(!await allowRequest(userId,'exam-read',90))return reply({error:'Too many requests'},429);
    const data=id?await getExamReport(userId,id):await listExams(userId);
    return data?reply(data):reply({error:'Not found'},404);
  }catch{return reply({error:'Service temporarily unavailable'},503);}
}
export async function POST(request:Request){
  const {userId}=await auth();
  if(!userId)return reply({error:'Unauthorized'},401);
  let input;
  try{input=schema.safeParse(await readJson(request));}catch{return reply({error:'Invalid input'},400);}
  if(!input.success)return reply({error:'Invalid input'},400);
  try{
    if(!await allowRequest(userId,'exam-write',120))return reply({error:'Too many requests'},429);
    const data=input.data;
    // Members can sit exams. Owners retain access to history and can close a session after expiry.
    if(data.action!=='finish'&&!hasFullAccess((await getAccess(userId)).status))return reply({error:'Membership required'},403);
    const result=data.action==='create'?await createExam(userId):await updateExam(userId,data.id,data);
    return result?reply(result):reply({error:'Not found'},404);
  }catch{return reply({error:'Service temporarily unavailable'},503);}
}
