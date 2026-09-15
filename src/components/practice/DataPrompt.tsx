import type { PublicQuestion } from '@/lib/practice';
export default function DataPrompt({question:q,zh}:{question:Extract<PublicQuestion,{kind:'data'}>;zh:boolean}) {
  const name=q.rows[q.focus].label;
  const other=q.rows[(q.focus+1)%q.rows.length].label;
  const max=Math.max(...q.rows.flatMap(r=>[r.before,r.after]));
  return <div className="space-y-5">
    <div><h2 className="text-xl font-semibold">{zh?'部门销售数据':'Department sales'}</h2><p className="mt-1 text-sm text-slate-500">{zh?'单位：千元；所有答案保留一位小数。可使用计算器。':'Units: thousands. Round answers to one decimal place. A calculator is allowed.'}</p></div>
    <div className="space-y-3 rounded-xl bg-slate-50 p-4" aria-hidden="true">{q.rows.map(r=><div key={r.label} className="flex items-center gap-3"><span className="w-4 text-sm">{r.label}</span><div className="flex-1 space-y-1"><div className="h-3 rounded-r bg-slate-300" style={{width:`${r.before/max*100}%`}}/><div className="h-3 rounded-r bg-indigo-500" style={{width:`${r.after/max*100}%`}}/></div></div>)}<p className="text-xs text-slate-500">{zh?'灰色：第一年 · 紫色：第二年':'Grey: Year 1 · Indigo: Year 2'}</p></div>
    <table className="w-full text-left text-sm"><caption className="sr-only">{zh?'各部门两年销售额':'Sales by department and year'}</caption><thead><tr className="border-b"><th className="py-2">{zh?'部门':'Department'}</th><th>{zh?'第一年':'Year 1'}</th><th>{zh?'第二年':'Year 2'}</th></tr></thead><tbody>{q.rows.map(r=><tr key={r.label} className="border-b"><th className="py-2 font-medium">{r.label}</th><td>{r.before}</td><td>{r.after}</td></tr>)}</tbody></table>
    <p className="rounded-lg bg-indigo-50 p-4 font-medium text-indigo-950">{q.metric==='growth'?(zh?`部门 ${name} 从第一年到第二年的销售增长率是多少？负数表示下降。`:`What is department ${name}’s sales growth rate from Year 1 to Year 2? A negative value means a decline.`):q.metric==='share'?(zh?`部门 ${name} 占第二年总销售额的百分比是多少？`:`What percentage of total Year 2 sales came from department ${name}?`):(zh?`第二年，部门 ${name} 的销售额是部门 ${other} 的多少倍？`:`In Year 2, how many times department ${other}’s sales did department ${name} achieve?`)}</p>
  </div>;
}
