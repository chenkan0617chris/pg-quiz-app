import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { allowRequest } from '@/lib/db';
import { CONVERSION_EVENTS, recordConversion } from '@/lib/conversion-store';
import { readJson } from '@/lib/request-body';

const schema=z.object({event:z.enum(CONVERSION_EVENTS)});
const reply=(status:number)=>new Response(null,{status,headers:{'Cache-Control':'no-store'}});

/** Client telemetry is deliberately limited to the first mock-exam paywall view. */
export async function POST(request:Request) {
  const {userId}=await auth();
  if(!userId)return reply(401);
  let input;
  try {input=schema.safeParse(await readJson(request));}catch{return reply(400);}
  if(!input.success || input.data.event!=='mock_paywall_viewed')return reply(400);
  try {
    if(!await allowRequest(userId,'conversion',30))return reply(429);
    await recordConversion(userId,input.data.event);
    return reply(204);
  }catch{return reply(503);}
}
