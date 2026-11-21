import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { allowRequest } from '@/lib/db';
import { CLIENT_CONVERSION_EVENTS, recordConversion } from '@/lib/conversion-store';
import { readJson } from '@/lib/request-body';

const schema=z.object({event:z.enum(CLIENT_CONVERSION_EVENTS)});
const reply=(status:number)=>new Response(null,{status,headers:{'Cache-Control':'no-store'}});

/** Client telemetry is limited to paywall, upgrade-prompt and price-page views; checkout/payment stay server-side. */
export async function POST(request:Request) {
  const {userId}=await auth();
  if(!userId)return reply(401);
  let input;
  try {input=schema.safeParse(await readJson(request));}catch{return reply(400);}
  if(!input.success)return reply(400);
  try {
    if(!await allowRequest(userId,'conversion',30))return reply(429);
    await recordConversion(userId,input.data.event);
    return reply(204);
  }catch{return reply(503);}
}
