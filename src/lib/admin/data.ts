import 'server-only';
import { clerkClient } from '@clerk/nextjs/server';
import { adminIdentity } from './auth';
import { activityHistory, userUsage, USER_PAGE_SIZE } from './store';
import type { ActivityFilters } from './policy';

async function requireAdmin() {
  if(!(await adminIdentity()).allowed)throw new Error('Admin access required');
}
export async function adminUsers(query:string,page:number) {
  await requireAdmin();
  const client=await clerkClient();
  const users=await client.users.getUserList({query:query||undefined,limit:USER_PAGE_SIZE,offset:(page-1)*USER_PAGE_SIZE,orderBy:'-created_at'});
  const usage=new Map((await userUsage(users.data.map(user=>user.id))).map(row=>[row.userId,row]));
  return {total:users.totalCount,users:users.data.map(user=>({id:user.id,name:[user.firstName,user.lastName].filter(Boolean).join(' ')||user.username||'未填写姓名',
    email:user.emailAddresses.find(email=>email.id===user.primaryEmailAddressId)?.emailAddress??'未提供邮箱',createdAt:new Date(user.createdAt).toISOString(),usage:usage.get(user.id)!}))};
}
export async function adminUserDetail(userId:string,filters:ActivityFilters) {
  await requireAdmin();
  const client=await clerkClient();
  let user;
  try {user=await client.users.getUser(userId);}catch(error){
    if(typeof error==='object'&&error!==null&&'status' in error&&error.status===404)return null;
    throw error;
  }
  const [[usage],history]=await Promise.all([userUsage([userId]),activityHistory(userId,filters)]);
  return {user:{id:user.id,name:[user.firstName,user.lastName].filter(Boolean).join(' ')||user.username||'未填写姓名',email:user.emailAddresses.find(email=>email.id===user.primaryEmailAddressId)?.emailAddress??'未提供邮箱',createdAt:new Date(user.createdAt).toISOString()},usage,history};
}
