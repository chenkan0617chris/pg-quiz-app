import { authorizeSolve } from '@/lib/solver-access';
import { allowRequest } from '@/lib/db';
import { readJson } from '@/lib/request-body';
import { auth } from '@clerk/nextjs/server';
import { pipelineSchema } from '@/lib/solver-input';
import { solvePuzzle } from '@/lib/engine';

export async function POST(request:Request) {
  const {userId} = await auth();
  if (!userId) return Response.json({error:'Unauthorized'},{status:401});
  try {
    if (!await allowRequest(userId,'solve',20)) return Response.json({error:'Too many requests'},{status:429});
  } catch {return Response.json({error:'Service unavailable'},{status:503});}
  let input;
  try { input = pipelineSchema.safeParse(await readJson(request)); } catch { return Response.json({error:'Invalid JSON'},{status:400}); }
  if (!input.success) return Response.json({error:'Invalid puzzle'},{status:400});
  try {
    const result=solvePuzzle(input.data);
    const permission=await authorizeSolve(userId,'pipeline');
    if(!permission.allowed)return Response.json({error:'Free solver allowance exhausted',code:'SOLVER_LIMIT'},{status:403,headers:{'Cache-Control':'no-store'}});
    return Response.json(result,{headers:{'Cache-Control':'no-store',...(permission.remaining!==null?{'X-Free-Solves-Remaining':String(permission.remaining)}:{})}});
  } catch {return Response.json({error:'Service unavailable'},{status:503});}
}
