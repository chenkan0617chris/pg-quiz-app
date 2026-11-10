import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { getAccess } from '@/lib/access';
import { consumeFreePractice } from '@/lib/access-store';
import { hasFullAccess } from '@/lib/access-policy';
import { allowRequest } from '@/lib/db';
import { generateGrid } from '@/lib/exam';
import { readJson } from '@/lib/request-body';

const schema=z.object({action:z.literal('start'),difficulty:z.enum(['easy','medium','hard']).optional()});
const LENGTH={easy:3,medium:4,hard:5} as const;
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});

/** Self-paced training: each round is newly generated and graded in the browser. Free accounts use a capped allowance. */
export async function POST(request:Request){
  const {userId}=await auth();
  if(!userId)return reply({error:'Unauthorized'},401);
  let input;
  try{input=schema.safeParse(await readJson(request));}catch{return reply({error:'Invalid input'},400);}
  if(!input.success)return reply({error:'Invalid input'},400);
  try{
    if(!await allowRequest(userId,'grid',30))return reply({error:'Too many requests'},429);
    const access=await getAccess(userId);
    if(!hasFullAccess(access.status)&&!await consumeFreePractice(userId,'grid'))return reply({error:'Free grid rounds exhausted'},403);
    return reply(generateGrid(LENGTH[input.data.difficulty??'easy']));
  }catch{return reply({error:'Service temporarily unavailable'},503);}
}
