import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { isAdminId } from './policy';

export async function adminIdentity() {
  const {userId}=await auth();
  return {userId,allowed:isAdminId(userId,process.env.ADMIN_USER_IDS)};
}
