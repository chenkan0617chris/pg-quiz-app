import Link from 'next/link';
import type { Funnel } from '@/lib/admin/store';

const stages=[
  ['signups','注册','Sign-ups'],['activated','已激活','Activated'],['paywalls','看到模拟考付费墙','Mock paywall viewed'],
  ['checkouts','开始结账','Checkout started'],['payments','支付完成','Payment completed'],
] as const;
type Stage=typeof stages[number][0];
const rate=(value:number,total:number)=>total?`${Math.round(value/total*100)}%`:'—';

export default function FunnelDashboard({funnel}:{funnel:Funnel}) {
  return <section className="space-y-4" aria-labelledby="funnel-title">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 id="funnel-title" className="text-xl font-semibold">付费转化漏斗</h2><p className="mt-1 text-sm text-slate-500">按注册日期分组的用户 cohort；后续动作会实时更新到相同注册批次。时间按悉尼日期。</p></div><nav aria-label="漏斗时间范围" className="flex rounded-lg border border-slate-200 p-1 text-sm">{([1,7,30] as const).map(days=><Link key={days} href={`/admin?range=${days}`} className={`rounded-md px-3 py-1.5 ${days===funnel.days?'bg-indigo-600 text-white':'text-slate-600 hover:bg-slate-50'}`}>{days===1?'今天':`${days} 天`}</Link>)}</nav></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{stages.map(([key,zh,en],index)=>{const value=funnel.totals[key as Stage];const prior=index?funnel.totals[stages[index-1][0] as Stage]:funnel.totals.signups;return <div key={key} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{zh}<span className="sr-only"> / {en}</span></p><p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-slate-500">{index?`上一步 ${rate(value,prior)}`:'注册 cohort'}</p></div>;})}</div>
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full min-w-[760px] text-left text-sm"><caption className="sr-only">按注册日期的转化漏斗</caption><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['注册日期','注册','激活','模拟考付费墙','结账','支付完成'].map(label=><th key={label} scope="col" className="px-4 py-3 font-medium">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{funnel.rows.map(row=><tr key={row.day}><td className="px-4 py-3 tabular-nums text-slate-600">{row.day}</td><td className="px-4 py-3 tabular-nums">{row.signups}</td><td className="px-4 py-3 tabular-nums">{row.activated}</td><td className="px-4 py-3 tabular-nums">{row.paywalls}</td><td className="px-4 py-3 tabular-nums">{row.checkouts}</td><td className="px-4 py-3 tabular-nums font-semibold text-emerald-700">{row.payments}</td></tr>)}</tbody></table>{!funnel.rows.length&&<p className="p-8 text-center text-sm text-slate-500">所选时间范围内没有新注册用户。</p>}</div>
  </section>;
}
