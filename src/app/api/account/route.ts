import { auth } from '@clerk/nextjs/server';
import { getAccess } from '@/lib/access';
import { allowRequest } from '@/lib/db';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET() {
  const {userId}=await auth();
  if(!userId)return reply({error:'Unauthorized'},401);
  try {
    if(!await allowRequest(userId,'account',60))return reply({error:'Too many requests'},429);
    return reply(await getAccess(userId));
  }catch{return reply({error:'Service unavailable'},503);}
}
