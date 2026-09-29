'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from '@/lib/use-account';
import { useI18n } from '@/lib/i18n';
import { hasFullAccess } from '@/lib/access-policy';
import { EXAM_SECTIONS, type ExamView, type ExamReport as Report, type ExamListItem } from '@/lib/exam-types';
import { PRICE_LABEL } from '@/lib/payment-product';
import ExamRunner from './ExamRunner';
import ExamReport from './ExamReport';

export default function ExamCenter(){
  const access=useAccount();
  return <Center key={access.userId??'guest'} access={access}/>;
}
function Center({access}:{access:ReturnType<typeof useAccount>}){
  const {lang}=useI18n(),zh=lang==='zh';
  const {userId,account,isLoaded,failed}=access;
  const member=!!account&&hasFullAccess(account.status);
  const [exam,setExam]=useState<ExamView|null>(null);
  const [report,setReport]=useState<Report|null>(null);
  const [history,setHistory]=useState<ExamListItem[]>([]);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [revision,setRevision]=useState(0);
  const [tab,setTab]=useState<'exam'|'report'>('exam');
  useEffect(()=>{
    if(!userId)return;
    const controller=new AbortController();
    fetch('/api/exams',{signal:controller.signal,cache:'no-store'}).then(async r=>{
      if(!r.ok)throw new Error();setHistory(await r.json());
    }).catch(()=>{if(!controller.signal.aborted)setError(zh?'考试记录加载失败，请重试。':'Could not load exam history. Please retry.');});
    return ()=>controller.abort();
  },[userId,revision,zh]);
  const showReport=useCallback(async(id:string)=>{
    setExam(null);setBusy(true);setError('');setRevision(v=>v+1);
    try{const response=await fetch(`/api/exams?report=${id}`,{cache:'no-store'});if(!response.ok)throw new Error();setReport(await response.json());}
    catch{setError(zh?'报告加载失败。成绩已保存，可从历史记录重试。':'Report unavailable. Results are saved; retry from history.');}
    finally{setBusy(false);}
  },[zh]);
  async function start(id?:string){
    setBusy(true);setError('');
    try{
      const response=await fetch('/api/exams',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(id?{action:'sync',id}:{action:'create'})});
      if(!response.ok)throw new Error(response.status===403?(zh?'此功能需要有效会员，请开通后重试。':'An active membership is required.'):(zh?'暂时无法进入考试，请重试。':'Could not open the exam. Please retry.'));
      const next=await response.json() as ExamView;
      if(next.phase==='completed')await showReport(next.id);else setExam(next);
    }catch(e){setError(e instanceof Error?e.message:'Unavailable');}finally{setBusy(false);}
  }
  async function closeExpired(id:string){
    setBusy(true);setError('');
    try{const r=await fetch('/api/exams',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'finish',id})});if(!r.ok)throw new Error();await showReport(id);}
    catch{setError(zh?'交卷失败，请重试。':'Could not finish; retry.');}finally{setBusy(false);}
  }
  if(exam)return <ExamRunner initial={exam} zh={zh} onClose={()=>{setExam(null);setRevision(v=>v+1);}} onComplete={showReport}/>;
  if(report)return <div><button onClick={()=>setReport(null)} className="mb-6 text-sm font-medium text-indigo-700">← {zh?'返回模拟考中心':'Back to exam centre'}</button><ExamReport report={report} zh={zh}/></div>;
  const active=history.find(h=>h.phase!=='completed');
  const loading= !isLoaded || (!!userId&&!account&&!failed);
  return <div className="space-y-9">
    <header><div className="mb-3 flex items-center gap-3"><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{zh?'会员专属':'MEMBERS'}</span><span className="text-xs tracking-wider text-slate-400">ASSESSMENT STUDIO</span></div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{zh?'模拟考中心':'Mock exam centre'}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{zh?'把练习变成一次正式演练。在连续限时的考场里，检验你的推理、计算与工作记忆，再用逐题报告找到提升方向。':'Turn practice into a complete rehearsal. Test reasoning, calculation and working memory under timed conditions, then learn from a question-by-question report.'}</p></header>
    {error&&<div role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}<button onClick={()=>{setError('');setRevision(v=>v+1);}} className="ml-3 underline">{zh?'重新加载':'Reload'}</button></div>}
    {failed&&<p role="alert" className="text-sm text-amber-700">{zh?'会员状态暂时无法读取，请刷新后重试。':'Membership status unavailable. Refresh to retry.'}</p>}
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="grid lg:grid-cols-[1fr_1.1fr]"><div className="p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">FULL REHEARSAL</p><h2 className="mt-3 text-2xl font-semibold">{zh?'互动认知模拟卷':'Interactive assessment rehearsal'}</h2><p className="mt-3 text-sm leading-7 text-slate-500">{zh?'20 分钟作答 + 不计时的分项说明。随机新题、全屏考场、服务端计时，完成后生成个人报告。':'20 minutes of timed tasks plus untimed instructions. New questions, fullscreen focus and a personal report after submission.'}</p>
      <ol className="my-7 space-y-5">{EXAM_SECTIONS.map((s,i)=><li key={s.kind} className="flex items-center gap-4"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">{i+1}</span><div className="flex-1"><div className="flex justify-between text-sm font-medium"><span>{s.name[lang]}</span><span className="tabular-nums text-slate-500">{s.seconds/60} min</span></div><div className="mt-2 h-1.5 rounded bg-slate-100"><div className="h-full rounded bg-indigo-300" style={{width:`${s.seconds/540*100}%`}}/></div></div></li>)}</ol>
      {loading?<button disabled className="w-full rounded-xl bg-slate-100 py-3 text-slate-500">{zh?'正在读取会员状态…':'Checking membership…'}</button>:member?<button disabled={busy} onClick={()=>void start(active?.id)} className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white disabled:opacity-50">{busy?(zh?'加载中…':'Loading…'):active?(zh?'继续未完成的考试 →':'Resume your exam →'):(zh?'准备开始模拟考试 →':'Prepare for your mock exam →')}</button>:<Link href="/billing" className="block rounded-xl bg-indigo-600 px-5 py-3.5 text-center font-semibold text-white">{zh?'开通会员，解锁完整模拟考':'Unlock the full exam'} · {PRICE_LABEL}</Link>}
      <p className="mt-3 text-center text-xs text-slate-500">{zh?'下方可免费查看考场与成绩报告预览':'Explore exam and report previews for free below'}</p>
    </div><div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-7 lg:border-l lg:border-t-0"><div className="mb-4 flex gap-2" role="tablist" aria-label={zh?'功能预览':'Feature previews'}>{(['exam','report'] as const).map(t=><button key={t} role="tab" aria-selected={tab===t} aria-controls={`preview-${t}`} id={`tab-${t}`} onClick={()=>setTab(t)} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab===t?'bg-white text-indigo-700 shadow-sm':'text-slate-500'}`}>{t==='exam'?(zh?'考场预览':'Exam preview'):(zh?'报告预览':'Report preview')}</button>)}</div>
      <div role="tabpanel" id={`preview-${tab}`} aria-labelledby={`tab-${tab}`} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between bg-slate-900 p-4 text-xs text-white"><span>{tab==='exam'?'SWITCH CHALLENGE':(zh?'模拟考试报告':'MOCK EXAM REPORT')}</span><span className="rounded bg-white/15 px-2 py-1">{zh?'示例 · 非真实成绩':'DEMO · SAMPLE DATA'}</span></div>{tab==='exam'?<div className="p-6"><div className="flex justify-between text-xs text-slate-500"><span>{zh?'第 8 题 · 管道推理':'Question 8 · Switch'}</span><span className="font-mono">04:32</span></div><div className="my-8 text-center"><div className="text-3xl tracking-[.3em] text-indigo-600">● ▲ ■ ◆</div><div className="my-4 text-slate-300">↓</div><div className="mx-auto grid max-w-sm grid-cols-3 gap-2">{['1234','3124','4312'].map(value=><span key={value} className="rounded-lg border-2 border-indigo-200 bg-indigo-50 px-2 py-3 font-mono text-xl text-indigo-700">{value}</span>)}</div><div className="my-3 text-slate-300">↓</div><div className="mx-auto w-fit rounded-lg bg-slate-100 px-6 py-2 font-mono text-xl">1342</div><div className="my-4 text-slate-300">↓</div><div className="text-3xl tracking-[.3em] text-indigo-600">■ ▲ ◆ ●</div></div><div className="rounded-lg bg-indigo-50 p-3 text-center text-sm text-indigo-700">{zh?'全屏专注 · 连续限时作答':'Fullscreen focus · timed challenges'}</div></div>:<div className="p-6"><div className="flex items-end justify-between"><div><p className="text-xs text-slate-500">{zh?'训练总分':'Practice score'}</p><strong className="text-5xl font-semibold text-indigo-700">78<span className="text-lg text-slate-300"> /100</span></strong></div><span className="text-xs text-slate-400">{zh?'示例报告':'Sample report'}</span></div><div className="my-6 space-y-4">{[86,78,70].map((n,i)=><div key={i}><div className="mb-2 flex justify-between text-xs"><span>{EXAM_SECTIONS[i].name[lang]}</span><span>{n}%</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-400" style={{width:`${n}%`}}/></div></div>)}</div><div className="grid grid-cols-3 gap-2 border-t pt-4 text-center text-xs text-slate-500"><div><strong className="block text-xl text-slate-900">32</strong>{zh?'答对题数':'Correct'}</div><div><strong className="block text-xl text-slate-900">9</strong>{zh?'错题':'Wrong'}</div><div><strong className="block text-xl text-slate-900">18.6s</strong>{zh?'平均作答':'Avg. answer'}</div></div></div>}</div>
    </div></div></section>
    <section><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">{zh?'我的考试记录':'My exam history'}</h2><span className="text-xs text-slate-400">{zh?'最近 50 次':'Latest 50 exams'}</span></div>{!userId?<div className="rounded-xl border border-dashed border-slate-300 p-7 text-center text-sm text-slate-500">{zh?'登录后在这里查看自己的考试记录。':'Sign in to view your personal exam history.'} <Link href={`/sign-in?redirect_url=%2F${lang}%2Fexams`} className="text-indigo-600 underline">{zh?'登录':'Sign in'}</Link></div>:history.length===0?<p className="rounded-xl bg-slate-50 p-7 text-sm text-slate-500">{zh?'还没有模拟考记录。完成第一次考试后，成绩与逐题解析会保存在这里。':'No exams yet. Your scores and question reviews will appear here after your first exam.'}</p>:<div className="divide-y rounded-xl border border-slate-200">{history.map(h=><div key={h.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-medium">{zh?'互动认知模拟卷':'Interactive assessment'}</p><p className="mt-1 text-xs text-slate-500">{new Date(h.createdAt).toLocaleString(zh?'zh-CN':'en-GB')}</p></div><div className="flex items-center gap-5"><span className="text-sm font-medium text-indigo-700">{h.phase==='completed'?`${h.score} / 100`:(zh?'进行中':'In progress')}</span><button disabled={busy} onClick={()=>void(h.phase==='completed'?showReport(h.id):member?start(h.id):closeExpired(h.id))} className="rounded-lg border px-3 py-2 text-sm">{h.phase==='completed'?(zh?'查看报告':'View report'):member?(zh?'继续考试':'Resume'):(zh?'结束并保存报告':'Finish & save report')}</button></div></div>)}</div>}</section>
    <details className="rounded-xl border border-slate-200 p-5"><summary className="cursor-pointer font-semibold">{zh?'宝洁常见流程与本次模拟范围':'Typical P&G process and this rehearsal'}</summary><p className="mt-4 text-sm leading-7 text-slate-600">{zh?'在线申请 → 在线测评 → 面试 → 录用。测评通常包含 PEAK 工作风格，并按岗位要求加入互动认知测评。PEAK 通常约 20 分钟且不限时；互动认知测评官方建议预留约 30 分钟。实际组合、顺序和截止时间以你的邀请为准。':'Application → assessments → interviews → offer. Assessments commonly include PEAK work style and, depending on the role, interactive cognitive tasks. PEAK usually takes about 20 minutes without a fixed limit; the official IA takes approximately 30 minutes. Follow your invitation for the exact combination, order and deadline.'}</p><p className="mt-3 text-sm leading-7 text-slate-600">{zh?'本卷模拟互动认知中的三类核心能力。正式作答前先阅读分项说明；准备安静环境和稳定网络。全屏是本站的专注训练规则，不代表官方统一要求。PEAK 熟悉练习在独立入口提供，不计入认知得分。':'This paper rehearses three core cognitive tasks. Read each section’s instructions and prepare a quiet space with a stable connection. Fullscreen is our focus-training rule, not a claimed universal employer requirement. PEAK familiarization is separate and does not contribute to the cognitive score.'}</p></details>
    <section className="grid gap-4 sm:grid-cols-2">{[['grid',zh?'空间记忆 · 新题型':'Grid · new training',zh?'体验「记忆 → 空间判断 → 顺序回忆」的完整一轮。':'Try one complete memory → symmetry → recall round.'],['peak',zh?'PEAK 工作风格':'PEAK work style',zh?'熟悉工作情境题，不编造人格标准答案或录用分数。':'Explore workplace questions without invented personality scores.']].map(([href,title,desc])=><Link key={href} href={`/${lang}/${href}`} className="rounded-xl border border-slate-200 p-5 transition-colors hover:border-indigo-300"><h3 className="font-semibold">{title} →</h3><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p></Link>)}</section>
    <p className="text-xs leading-6 text-slate-500">{zh?'本站原创模拟，非宝洁官方测评。官方互动测评通常约 30 分钟，具体题型按岗位变化；本站采用公开备考资料中的 6/5/9 分钟练习配置，算法与官方评分不等同。':'Original practice, not an official P&G assessment. The official IA takes approximately 30 minutes and varies by role; our 6/5/9-minute practice presets follow public preparation descriptions and do not reproduce official scoring.'} <a href="https://www.pgcareers.com/global/en/assesment-overviews" target="_blank" rel="noreferrer" className="underline">{zh?'官方流程':'Official overview'}</a> · <a href="https://www.jobtestprep.co.uk/procter-and-gamble-assessment" target="_blank" rel="noreferrer" className="underline">{zh?'时长参考':'Timing reference'}</a></p>
  </div>;
}
