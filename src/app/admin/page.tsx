import Link from 'next/link';
import { adminIdentity } from '@/lib/admin/auth';
import { adminUsers } from '@/lib/admin/data';
import { parsePage, queryValue, type QueryParams } from '@/lib/admin/policy';
import { USER_PAGE_SIZE } from '@/lib/admin/store';
import { AdminDenied, Status, Pager, dateTime, inputClass, buttonClass } from './ui';

export default async function AdminPage({searchParams}:{searchParams:Promise<QueryParams>}) {
  const identity=await adminIdentity();
  if(!identity.allowed)return <AdminDenied signedIn={!!identity.userId}/>;
  const params=await searchParams;
  const q=queryValue(params.q).trim().slice(0,200);
  let page;
  try {page=parsePage(queryValue(params.page));}catch{return <p role="alert">页码无效。<Link href="/admin" className="text-indigo-700 underline">返回用户列表</Link></p>;}
  const data=await adminUsers(q,page);
  const href=(next:number)=>`/admin?${new URLSearchParams({q,page:String(next)})}`;
  return <div className="space-y-7">
    <header><p className="text-xs font-semibold tracking-[0.18em] text-indigo-600">CK QUIZ · ADMIN</p><div className="mt-3 flex flex-wrap items-end justify-between gap-3"><h1 className="text-3xl font-semibold tracking-tight">用户使用后台</h1><span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">仅管理员可见</span></div><p className="mt-3 text-sm leading-6 text-slate-500">查看每位用户的练习、解题和额度消耗。时间以悉尼时区显示。</p></header>
    <form action="/admin" className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5"><label className="min-w-48 flex-1 text-sm font-medium">搜索用户<input name="q" defaultValue={q} placeholder="姓名、邮箱或用户 ID" maxLength={200} className={inputClass}/></label><button className={buttonClass}>搜索</button>{q&&<Link href="/admin" className="px-2 py-2 text-sm text-slate-600 underline">清除</Link>}</form>
    <section><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{q?'匹配用户':'全部用户'} <span className="ml-2 text-sm font-normal text-slate-500">{data.total} 人</span></h2><span className="text-xs text-slate-500">按注册时间倒序 · 每页 {USER_PAGE_SIZE} 人</span></div>
      <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['用户','套餐','使用记录','免费额度消耗','最近使用','详情'].map(label=><th key={label} scope="col" className="px-4 py-3 font-medium">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{data.users.map(user=><tr key={user.id} className="hover:bg-slate-50/70"><td className="px-4 py-4"><Link href={`/admin/users/${encodeURIComponent(user.id)}`} className="font-semibold text-slate-900 hover:text-indigo-700">{user.name}</Link><p className="mt-1 max-w-56 break-all text-xs text-slate-500">{user.email}</p></td><td className="px-4 py-4"><Status status={user.usage.status}/></td><td className="px-4 py-4 text-xs leading-6 text-slate-600"><p>练习 {user.usage.practiceCompleted} / {user.usage.practiceStarted} 完成</p><p>解题 {user.usage.solves} · 模考 {user.usage.exams}</p></td><td className="px-4 py-4 tabular-nums">{user.usage.quotas.reduce((n,item)=>n+item.used,0)} / {user.usage.quotas.reduce((n,item)=>n+item.limit,0)}<p className="mt-1 text-xs text-slate-400">各工具独立计额</p></td><td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">{dateTime(user.usage.lastActivity)}</td><td className="px-4 py-4"><Link aria-label={`查看 ${user.email} 的使用详情`} className="whitespace-nowrap font-medium text-indigo-700" href={`/admin/users/${encodeURIComponent(user.id)}`}>查看 →</Link></td></tr>)}</tbody></table>{!data.users.length&&<p className="p-10 text-center text-sm text-slate-500">{q?'没有找到匹配用户，请换个关键词。':'这一页暂无用户。'}</p>}</div>
      <Pager page={page} hasNext={page*USER_PAGE_SIZE<data.total} href={href}/>
    </section>
    <p className="rounded-xl bg-amber-50 px-5 py-4 text-xs leading-6 text-amber-900">解题次数从日志上线后开始统计；之前的解题时间和会员使用次数无法还原。免费额度消耗包含历史累计值，练习和模拟考试沿用已有记录。“暂无记录”不代表从未使用。</p>
  </div>;
}
