import { getAccess } from './access';
import { consumeFreeSolve } from './access-store';
import { hasFullAccess, type SolverKind } from './access-policy';

export async function authorizeSolve(userId:string,kind:SolverKind) {
  const access=await getAccess(userId);
  if(hasFullAccess(access.status))return {allowed:true,remaining:null};
  const remaining=await consumeFreeSolve(userId,kind);
  return {allowed:remaining!==null,remaining};
}
