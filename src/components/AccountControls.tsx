'use client';
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { useI18n } from '@/lib/i18n';

/** Account identity and authentication actions live together in the sidebar. */
export default function AccountControls({onNavigate}:{onNavigate?:()=>void}){
  const {lang}=useI18n(),zh=lang==='zh';
  const {user,isLoaded}=useUser();
  return <div className="px-2">
    {!isLoaded&&<div className="flex h-12 items-center gap-3 px-1" aria-label={zh?'正在读取账号':'Loading account'}><span className="size-8 rounded-full bg-slate-200"/><span className="h-3 w-24 rounded bg-slate-200"/></div>}
    <Show when="signed-in"><div className="flex min-h-12 items-center gap-3 px-1"><UserButton/><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-700">{user?.fullName||user?.username||(zh?'我的学习空间':'My workspace')}</p><p className="mt-0.5 text-[10px] text-slate-400">{zh?'个人账号':'Personal account'}</p></div></div></Show>
    <Show when="signed-out"><div className="mb-3 px-1"><p className="text-xs font-semibold text-slate-700">{zh?'开启你的备考计划':'Make your practice count'}</p><p className="mt-1 text-[11px] leading-5 text-slate-400">{zh?'登录以保存练习与考试记录':'Sign in to keep your practice history'}</p></div><div className="grid grid-cols-2 gap-2"><SignInButton mode="modal"><button onClick={onNavigate} className="rounded-lg bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700">{zh?'登录':'Sign in'}</button></SignInButton><SignUpButton mode="modal"><button onClick={onNavigate} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900">{zh?'注册':'Sign up'}</button></SignUpButton></div></Show>
  </div>;
}
