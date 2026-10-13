import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { allowRequest } from '@/lib/db';
import { readJson } from '@/lib/request-body';
import { recordTrainingActivity } from '@/lib/activity-store';

const schema=z.object({tool:z.enum(['training:grid','training:peak']),action:z.enum(['started','completed']),sessionId:z.uuid()});
const reply=(status:number)=>new Response(null,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request) {
  const {userId}=await auth();
  if(!userId)return reply(401);
  let data;
  try {data=schema.safeParse(await readJson(request));}catch{return reply(400);}
  if(!data.success)return reply(400);
  try {
    if(!await allowRequest(userId,'training-activity',30))return reply(429);
    await recordTrainingActivity(userId,data.data.tool,data.data.action,data.data.sessionId);
    return reply(204);
  }catch{return reply(503);}
}
