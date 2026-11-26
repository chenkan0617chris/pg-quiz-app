import Link from 'next/link';
import type { CheckoutClicks } from '@/lib/admin/store';
import { dateTime } from './ui';

const SOURCES:Record<string,string>={billing:'价格页',upgrade_card:'升级卡片',other:'其他'};
const OUTCOMES:Record<string,string>={redirected:'已跳到 Stripe',already_paid:'已是会员',processing:'付款确认中',rate_limited:'点太快被限流',error:'出错'};
const money=(amount:number,currency:string)=>`${currency==='aud'?'A$':currency==='usd'?'$':currency.toUpperCase()+' '}${(amount/100).toFixed(2)}`;
const plan=(lang:string,amount:number,currency:string)=>`${lang==='zh'?'中文页':'英文页'} ${money(amount,currency)}`;

export default function CheckoutClicksPanel({data,includeInternal}:{data:CheckoutClicks;includeInternal:boolean}) {
  const href=(days:number,internal:boolean)=>`/admin?${new URLSearchParams({clicks:String(days),...(internal?{internal:'1'}:{})})}`;
  const cells=[['点击次数',data.total.clicks],['点击人数',data.total.people],['跳到 Stripe',data.total.redirected],['已付款',data.total.paid]] as const;
  return <section className="space-y-4" aria-labelledby="clicks-title">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h2 id="clicks-title" className="text-xl font-semibold">Stripe 结账点击</h2><p className="mt-1 text-sm text-slate-500">每次点击“开通 7 天会员”都记一条，按点击日期统计（悉尼时间）。{includeInternal?'包含测试账号。':'不含管理员和测试账号。'}</p></div>
      <div className="flex flex-wrap items-center gap-3">
        <Link href={href(data.days,!includeInternal)} className="text-sm text-indigo-700 underline underline-offset-4">{includeInternal?'排除测试账号':'包含测试账号'}</Link>
        <nav aria-label="点击统计时间范围" className="flex rounded-lg border border-slate-200 p-1 text-sm">{([1,7,30] as const).map(days=><Link key={days} href={href(days,includeInternal)} className={`rounded-md px-3 py-1.5 ${days===data.days?'bg-indigo-600 text-white':'text-slate-600 hover:bg-slate-50'}`}>{days===1?'今天':`${days} 天`}</Link>)}</nav>
      </div>
    </div>
    <div className="grid gap-3 sm:grid-cols-4">{cells.map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p></div>)}</div>
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full min-w-[560px] text-left text-sm"><caption className="sr-only">按页面语言和价格的结账点击</caption><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['页面和价格','点击次数','点击人数','跳到 Stripe','已付款'].map(label=><th key={label} scope="col" className="px-4 py-3 font-medium">{label}</th>)}</tr></thead>
      <tbody className="divide-y divide-slate-100">{data.byPlan.map(row=><tr key={`${row.lang}-${row.amount}-${row.currency}`}><td className="px-4 py-3">{plan(row.lang,row.amount,row.currency)}</td><td className="px-4 py-3 tabular-nums">{row.clicks}</td><td className="px-4 py-3 tabular-nums">{row.people}</td><td className="px-4 py-3 tabular-nums">{row.redirected}</td><td className="px-4 py-3 tabular-nums font-semibold text-emerald-700">{row.paid}</td></tr>)}</tbody></table>
      {!data.byPlan.length&&<p className="p-8 text-center text-sm text-slate-500">所选时间范围内还没有结账点击。</p>}</div>
    {!!data.bySource.length&&<p className="text-sm text-slate-600">按按钮：{data.bySource.map(row=>`${SOURCES[row.source]??row.source} ${row.clicks}`).join(' · ')}</p>}
    {!!data.recent.length&&<details className="rounded-xl border border-slate-200 bg-white"><summary className="cursor-pointer px-4 py-3 text-sm font-medium">最近 {data.recent.length} 次点击</summary>
      <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['时间','用户','页面','按钮','结果'].map(label=><th key={label} scope="col" className="px-4 py-2 font-medium">{label}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{data.recent.map((row,index)=><tr key={`${row.at}-${index}`}><td className="whitespace-nowrap px-4 py-2 text-xs text-slate-500">{dateTime(row.at)}</td><td className="px-4 py-2"><Link href={`/admin/users/${encodeURIComponent(row.userId)}`} className="font-mono text-xs text-indigo-700">…{row.userId.slice(-6)}</Link></td><td className="px-4 py-2">{row.lang==='zh'?'中文':'英文'}</td><td className="px-4 py-2">{SOURCES[row.source]??row.source}</td><td className="px-4 py-2">{OUTCOMES[row.outcome]??row.outcome}{row.paid&&<span className="ml-2 font-semibold text-emerald-700">已付款</span>}</td></tr>)}</tbody></table></div></details>}
  </section>;
}
