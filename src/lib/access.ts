import 'server-only';
import { clerkClient } from '@clerk/nextjs/server';
import { initializeAccess, readAccess } from './access-store';

export async function getAccess(userId:string) {
  const existing=await readAccess(userId);
  if(existing)return existing;
  const client=await clerkClient();
  const user=await client.users.getUser(userId);
  return initializeAccess(userId,user.createdAt);
}
