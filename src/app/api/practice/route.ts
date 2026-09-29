import { getAccess } from '@/lib/access';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { practiceAnswerSchema } from '@/lib/practice-answer-schema';
import { allowRequest } from '@/lib/db';
import { readJson } from '@/lib/request-body';
import { createPractice,practiceHistory,submitPractice,PracticeAccessError } from '@/lib/practice-store';
import { FREE_SAMPLES_PER_KIND,hasFullAccess } from '@/lib/access-policy';

const schema=z.discriminatedUnion('action',[
  z.object({action:z.literal('start'),kind:z.enum(['pipeline','numerical','data','figure','memory']),difficulty:z.enum(['easy','medium','hard']).optional(),retryId:z.uuid().optional(),sampleIndex:z.number().int().min(0).max(FREE_SAMPLES_PER_KIND-1).optional()}),
  z.object({action:z.literal('submit'),id:z.uuid(),answer:practiceAnswerSchema}),
]);
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request) {
  const {userId}=await auth();
  if(!userId)return reply({error:'Unauthorized'},401);
  const scope=new URL(request.url).searchParams.get('scope')??'all';
  if(scope!=='all'&&scope!=='bank'&&scope!=='memory')return reply({error:'Invalid scope'},400);
  try {
    if(!await allowRequest(userId,'history',60))return reply({error:'Too many requests'},429);
    return reply(await practiceHistory(userId,scope));
  }catch{return reply({error:'Service temporarily unavailable'},503);}
}
export async function POST(request:Request) {
  const {userId}=await auth();
  if(!userId)return reply({error:'Unauthorized'},401);
  let input;
  try {input=schema.safeParse(await readJson(request));}catch{return reply({error:'Invalid input'},400);}
  if(!input.success)return reply({error:'Invalid input'},400);
  try {
    if(!await allowRequest(userId,'practice',30))return reply({error:'Too many requests'},429);
    const fullAccess=hasFullAccess((await getAccess(userId)).status);
    const data=input.data;
    const result=data.action==='start'
      ? await createPractice(userId,data.kind,data.retryId,data.difficulty,fullAccess,data.sampleIndex)
      : await submitPractice(userId,data.id,data.answer);
    return result?reply(result):reply({error:'Not found'},404);
  }catch(error){
    if(error instanceof PracticeAccessError)return reply({error:'Paid practice requires membership'},403);
    return reply({error:'Service temporarily unavailable'},503);
  }
}
