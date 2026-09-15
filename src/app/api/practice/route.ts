import { getAccess } from '@/lib/access';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { allowRequest } from '@/lib/db';
import { readJson } from '@/lib/request-body';
import { createPractice,practiceHistory,submitPractice } from '@/lib/practice-store';

const schema=z.discriminatedUnion('action',[
  z.object({action:z.literal('start'),kind:z.enum(['pipeline','numerical','data','figure']),difficulty:z.enum(['easy','medium','hard']).optional(),retryId:z.uuid().optional()}),
  z.object({action:z.literal('submit'),id:z.uuid(),answer:z.array(z.number().int().min(0).max(9)).min(1).max(4)}),
]);
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET() {
  const {userId}=await auth();
  if(!userId)return reply({error:'Unauthorized'},401);
  try {
    if(!await allowRequest(userId,'history',60))return reply({error:'Too many requests'},429);
    return reply(await practiceHistory(userId));
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
    if((await getAccess(userId)).status==='expired')return reply({error:'Trial expired'},403);
    const data=input.data;
    const result=data.action==='start'
      ? await createPractice(userId,data.kind,data.retryId,data.difficulty)
      : await submitPractice(userId,data.id,data.answer);
    return result?reply(result):reply({error:'Not found'},404);
  }catch{return reply({error:'Service temporarily unavailable'},503);}
}
