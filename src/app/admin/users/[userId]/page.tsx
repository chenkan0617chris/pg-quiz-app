import Link from 'next/link';
import { notFound } from 'next/navigation';
import { adminIdentity } from '@/lib/admin/auth';
import { adminUserDetail } from '@/lib/admin/data';
import { ACTIVITY_TOOLS, parseActivityFilters, queryValue, type QueryParams, type ActivityTool } from '@/lib/admin/policy';
import { AdminDenied, Status, Pager, dateTime, inputClass, buttonClass } from '../../ui';

const quotaNames:Record<string,string>={pipeline:'管道解题器',numerical:'数字解题器',figure:'图形解题器',memory:'记忆训练'};
export default async function UserDetail({params,searchParams}:{params:Promise<{userId:string}>;searchParams:Promise<QueryParams>}) {
  const identity=await adminIdentity();
  if(!identity.allowed)return <AdminDenied signedIn={!!identity.userId}/>;
  const {userId}=await params;
  const query=await searchParams;
  let filters;
  try {filters=parseActivityFilters(query);}catch(error){return <p role="alert">{error instanceof Error?error.message:'筛选条件无效'}。<Link className="text-indigo-700 underline" href={`/admin/users/${encodeURIComponent(userId)}`}>清除筛选</Link></p>;}
  const data=await adminUserDetail(userId,filters);
  if(!data)notFound();
  const {user,usage,history}=data;
  const path=`/admin/users/${encodeURIComponent(userId)}`;
  const href=(page:number)=>`${path}?${new URLSearchParams({tool:filters.tool,from:queryValue(query.from),to:queryValue(query.to),page:String(page)})}`;
  const metrics=[['练习开始',usage.practiceStarted],['练习完成',usage.practiceCompleted],['解题成功（日志上线后）',usage.solves],['模拟考试开始',usage.exams],['样题完成（客户端上报）',usage.training]];
  return <div className="space-y-7">
    <Link href="/admin" className="text-sm text-indigo-700">← 返回用户列表</Link>
    <header className="rounded-2xl border border-slate-200 p-6"><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold">{user.name}</h1><Status status={usage.status}/></div><p className="mt-2 break-all text-sm text-slate-600">{user.email}</p><p className="mt-2 break-all font-mono text-xs text-slate-400">{user.id}</p><div className="mt-5 grid gap-3 text-xs leading-6 text-slate-500 sm:grid-cols-2"><p>注册时间：{dateTime(user.createdAt)}<br/>最近使用：{dateTime(usage.lastActivity)}</p><p>会员到期：{usage.lifetime?'永久会员':usage.paidUntil?dateTime(usage.paidUntil):'无付费记录'}<br/>试用到期：{usage.trialEndsAt?dateTime(usage.trialEndsAt):'不适用'}</p></div></header>
    <section aria-label="累计使用" className="grid grid-cols-2 gap-3 lg:grid-cols-5">{metrics.map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 p-4"><p className="text-xs leading-5 text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p></div>)}</section>
    <section className="rounded-2xl border border-slate-200 p-6"><h2 className="text-lg font-semibold">免费额度</h2><p className="mt-2 text-xs leading-6 text-slate-500">终身累计额度；会员和试用期间使用不扣免费次数。以下额度互相独立，不受时间筛选影响。</p><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{usage.quotas.map(item=><div key={item.kind}><div className="flex justify-between text-sm"><span>{quotaNames[item.kind]}</span><span className="font-semibold tabular-nums">{item.used} / {item.limit}</span></div><div role="progressbar" aria-label={`${quotaNames[item.kind]}已使用额度`} aria-valuenow={item.used} aria-valuemin={0} aria-valuemax={item.limit} className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{width:`${item.used/item.limit*100}%`}}/></div><p className="mt-1 text-xs text-slate-500">已用 {item.used} 次 · 剩余 {item.limit-item.used} 次</p></div>)}</div></section>
    <section><h2 className="text-lg font-semibold">使用时间线</h2><p className="mb-4 mt-2 text-xs leading-6 text-slate-500">显示悉尼时间；日期筛选按 UTC 自然日。历史解题时间不可追溯；旧练习若无扣额记录，会标为“未知”。</p>
      <form action={path} className="mb-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4"><label className="text-xs font-medium text-slate-600">工具<select name="tool" defaultValue={filters.tool} className={inputClass}><option value="">全部工具</option>{Object.entries(ACTIVITY_TOOLS).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label className="text-xs font-medium text-slate-600">开始日期（UTC）<input type="date" name="from" defaultValue={queryValue(query.from)} className={inputClass}/></label><label className="text-xs font-medium text-slate-600">结束日期（UTC，含当天）<input type="date" name="to" defaultValue={queryValue(query.to)} className={inputClass}/></label><div className="flex items-end gap-3"><button className={buttonClass}>筛选</button><Link href={path} className="py-2 text-sm text-slate-600 underline">重置</Link></div></form>
      <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[580px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['时间（悉尼）','工具','操作 / 结果','扣免费额度','记录来源'].map(label=><th key={label} scope="col" className="px-4 py-3 font-medium">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{history.items.map(event=><tr key={event.eventId}><td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">{dateTime(event.occurredAt)}</td><td className="px-4 py-4 font-medium">{ACTIVITY_TOOLS[event.tool as ActivityTool]??event.tool}</td><td className="px-4 py-4">{event.action==='solved'?'解题成功':event.action==='started'?'开始':'完成'}{event.correct!==null&&<span className={`ml-2 text-xs ${event.correct?'text-emerald-700':'text-amber-700'}`}>{event.correct?'答对':'答错'}</span>}</td><td className="px-4 py-4 tabular-nums">{event.freeCredits===null?'未知':event.freeCredits===0?'不扣额':'−1 次'}</td><td className="px-4 py-4 text-xs text-slate-500">{event.source==='client'?'客户端上报':'服务端记录'}</td></tr>)}</tbody></table>{!history.items.length&&<p className="p-10 text-center text-sm text-slate-500">当前筛选下暂无使用记录。</p>}</div>
      <Pager page={filters.page} hasNext={history.hasNext} href={href}/><p className="mt-4 text-xs leading-6 text-slate-400">空间记忆样题与 PEAK 只记录登录用户的开始和完成，不保存个人回答；客户端记录可能因网络中断或拦截缺失。</p>
    </section>
  </div>;
}
