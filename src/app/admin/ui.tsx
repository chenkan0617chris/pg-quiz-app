import Link from 'next/link';
import type { UserUsage } from '@/lib/admin/store';

export const inputClass='mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-offset-2 focus:outline-indigo-600';
export const buttonClass='inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700';
export function dateTime(value:string|null) {
  return value?new Intl.DateTimeFormat('zh-CN',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(value)):'暂无记录';
}
export function Status({status}:{status:UserUsage['status']}) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${status==='paid'?'bg-emerald-50 text-emerald-700':status==='trial'?'bg-amber-50 text-amber-800':'bg-slate-100 text-slate-600'}`}>{status==='paid'?'付费会员':status==='trial'?'试用中':'免费用户'}</span>;
}
export function AdminDenied({signedIn}:{signedIn:boolean}) {
  return <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 p-8"><p className="text-xs font-semibold tracking-widest text-indigo-600">CK QUIZ · ADMIN</p><h1 className="mt-3 text-2xl font-semibold">{signedIn?'仅管理员可访问':'请先登录管理员账号'}</h1><p className="my-4 text-sm leading-6 text-slate-600">{signedIn?'当前账号没有后台访问权限。请使用已授权的管理员账号登录。':'用户记录和额度信息仅向已授权的管理员开放。'}</p><Link className={buttonClass} href={signedIn?'/account':'/sign-in?redirect_url=%2Fadmin'}>{signedIn?'查看当前账号':'登录'}</Link></section>;
}
export function Pager({page,hasNext,href}:{page:number;hasNext:boolean;href:(page:number)=>string}) {
  return <nav aria-label="分页" className="mt-5 flex items-center justify-between text-sm"><span className="text-slate-500">第 {page} 页</span><div className="flex gap-4">{page>1&&<Link className="text-indigo-700 underline underline-offset-4" href={href(page-1)}>上一页</Link>}{hasNext&&<Link className="text-indigo-700 underline underline-offset-4" href={href(page+1)}>下一页</Link>}</div></nav>;
}
