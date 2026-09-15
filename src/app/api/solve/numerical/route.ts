import { getAccess } from '@/lib/access';
import { allowRequest } from '@/lib/db';
import { readJson } from '@/lib/request-body';
import { auth } from '@clerk/nextjs/server';
import { numericalSchema } from '@/lib/solver-input';
import { solveNumeric } from '@/lib/numeric';

export async function POST(request:Request) {
  const {userId} = await auth();
  if (!userId) return Response.json({error:'Unauthorized'},{status:401});
  try {
    if (!await allowRequest(userId,'solve',20)) return Response.json({error:'Too many requests'},{status:429});
    if ((await getAccess(userId)).status==='expired') return Response.json({error:'Trial expired'},{status:403,headers:{'Cache-Control':'no-store'}});
  } catch {return Response.json({error:'Service unavailable'},{status:503});}
  let input;
  try { input = numericalSchema.safeParse(await readJson(request)); } catch { return Response.json({error:'Invalid JSON'},{status:400}); }
  if (!input.success) return Response.json({error:'Invalid puzzle'},{status:400});
  const {tokens,target,range,distinct} = input.data;
  return Response.json(solveNumeric(tokens,target,{min:range==='1-9'?1:0,max:9,distinct,maxCombos:100_000,maxSolutions:500}),{headers:{'Cache-Control':'no-store'}});
}
