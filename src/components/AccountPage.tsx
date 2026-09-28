'use client';
import { useUser, useClerk, SignInButton } from '@clerk/nextjs';
import { useI18n } from '@/lib/i18n';
import { useAccount } from '@/lib/use-account';
import AccountOverview from './AccountOverview';

export default function AccountPage(){
 const {lang}=useI18n();const zh=lang==='zh';
 const {user}=useUser();const clerk=useClerk();
 const {account,isLoaded,userId,failed}=useAccount();
 return <section className="mx-auto max-w-4xl">
  <div className="mb-8"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">CKAutoFlow · Account</p><h1 className="text-3xl font-semibold tracking-tight text-slate-950">{zh?'我的账号':'My account'}</h1><p className="mt-2 text-sm text-slate-500">{zh?'查看套餐、使用情况和你可以使用的功能。':'Your plan, usage and available features in one place.'}</p></div>
  {!isLoaded?<p role="status">{zh?'正在读取账号…':'Loading account…'}</p>:!userId?<div className="rounded-2xl border border-slate-200 p-8"><p className="mb-4">{zh?'登录后查看你的套餐和使用情况。':'Sign in to view your plan and usage.'}</p><SignInButton mode="modal"><button className="rounded-lg bg-indigo-600 px-5 py-3 text-white">{zh?'登录':'Sign in'}</button></SignInButton></div>:failed?<div role="alert" className="rounded-xl bg-amber-50 p-6"><p>{zh?'暂时无法读取用量，请重试。':'Usage is temporarily unavailable. Please retry.'}</p><button className="mt-3 underline" onClick={()=>window.dispatchEvent(new Event('account-updated'))}>{zh?'重新加载':'Retry'}</button></div>:!account?<p role="status">{zh?'正在读取用量…':'Loading usage…'}</p>:<>
   <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-5 py-4"><div className="min-w-0"><p className="font-medium text-slate-900">{user?.fullName||user?.username||(zh?'我的账户':'Your account')}</p><p className="break-all text-sm text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p></div><button onClick={()=>clerk.openUserProfile()} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:border-indigo-300">{zh?'管理个人资料':'Manage profile'}</button></div>
   <AccountOverview account={account} zh={zh}/>
  </>}
 </section>;
}

