'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useAccount } from '@/lib/use-account';
import { useSolveRequest } from '@/lib/solve-request';
import { FREE_MEMORY_ROUNDS, FREE_SAMPLES_PER_KIND, hasFullAccess } from '@/lib/access-policy';
import type { Difficulty, PublicQuestion } from '@/lib/practice';
import MemoryBoard from './MemoryBoard';

type Round={id:string;question:Extract<PublicQuestion,{kind:'memory'}>};
type Result=Round&{answer:number[];correct:boolean;referenceAnswer:number[];submittedAt:string};
export default function MemoryTraining(){
  const access=useAccount();
  return <Training key={access.userId??'guest'} access={access}/>;
}
function Training({access}:{access:ReturnType<typeof useAccount>}){
  const {lang}=useI18n(),zh=lang==='zh';
  const {userId,account,failed}=access;
  const member=!!account&&hasFullAccess(account.status);
  const exhausted=!!account&&!member&&account.memoryRemaining<=0;
  const [difficulty,setDifficulty]=useState<Difficulty>('easy');
  const [round,setRound]=useState<Round|null>(null);
  const [answer,setAnswer]=useState<number[]|null>(null);
  const [result,setResult]=useState<Result|null>(null);
  const [history,setHistory]=useState<Result[]>([]);
  const [historyError,setHistoryError]=useState(false);
  const [revision,setRevision]=useState(0);
  const {run,busy,ready,error}=useSolveRequest<Round|Result>('/api/practice');
  const active=!!round&&!result;
  useEffect(()=>{
    if(!userId)return;
    const controller=new AbortController();
    fetch('/api/practice?scope=memory',{signal:controller.signal,cache:'no-store'}).then(async r=>{
      if(!r.ok)throw new Error();setHistory(await r.json());setHistoryError(false);
    }).catch(()=>{if(!controller.signal.aborted)setHistoryError(true);});
    return ()=>controller.abort();
  },[userId,revision]);
  async function start(){
    const sampleIndex=(FREE_MEMORY_ROUNDS-(account?.memoryRemaining??FREE_MEMORY_ROUNDS))%FREE_SAMPLES_PER_KIND;
    const next=await run({action:'start',kind:'memory',difficulty,sampleIndex});
    if(next){setRound(next);setResult(null);setAnswer(null);}
  }
  async function submit(values:number[]){
    if(!round)return;
    setAnswer(values);
    const next=await run({action:'submit',id:round.id,answer:values});
    if(next&&'correct' in next){setResult(next);setRevision(v=>v+1);}
  }
  return <div className="space-y-7">
    <section className="rounded-2xl border border-slate-200 p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5"><div><h2 className="font-semibold">{zh?'顺序记忆':'Sequence recall'}</h2><p className="mt-1 text-xs text-slate-500">{zh?'观察 → 记忆 → 按顺序点击':'Observe → remember → recall in order'}</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500">{member?(zh?'会员训练':'Member training'):account?(zh?`剩余 ${account.memoryRemaining} 轮免费训练`:`${account.memoryRemaining} free rounds left`):(zh?`${FREE_MEMORY_ROUNDS} 轮免费体验`:`${FREE_MEMORY_ROUNDS} free rounds`)}</span></div>
      {member&&!active&&<fieldset className="mb-5 flex flex-wrap gap-2"><legend className="mb-2 text-xs text-slate-500">{zh?'本轮难度':'Round difficulty'}</legend>{(['easy','medium','hard'] as const).map((level,i)=><button type="button" key={level} aria-pressed={difficulty===level} disabled={busy} onClick={()=>setDifficulty(level)} className={`rounded-lg border px-4 py-2 text-sm ${difficulty===level?'border-indigo-300 bg-indigo-50 font-medium text-indigo-700':'border-slate-200 text-slate-500'}`}>{[3,5,7][i]} {zh?'个位置':'positions'}</button>)}</fieldset>}
      {round?<MemoryBoard key={`${round.id}:${result?'review':'play'}`} sequence={round.question.sequence} zh={zh} review={!!result} autoPlay={!result} disabled={busy} onAnswer={values=>void submit(values)}/>:<MemoryBoard sequence={[2,7,4]} zh={zh} disabled preview/>}
      {error&&<p role="alert" className="my-4 text-sm text-rose-700">{error}</p>}
      {failed&&!account&&<p role="alert" className="my-4 text-sm text-amber-700">{zh?'暂时无法读取训练额度，请重试。':'Could not load training access. Please retry.'} <button onClick={()=>window.dispatchEvent(new Event('account-updated'))} className="underline">{zh?'重试':'Retry'}</button></p>}
      {result&&<div role="status" className={`my-5 rounded-xl p-5 ${result.correct?'bg-emerald-50 text-emerald-900':'bg-amber-50 text-amber-900'}`}><h3 className="font-semibold">{result.correct?(zh?'顺序全部正确':'Sequence complete — well done'):(zh?'这一轮还差一点':'Not quite this round')}</h3><p className="mt-2 text-sm">{zh?'你记住的顺序：':'Your sequence: '}{result.answer.join(' → ')}</p><p className="mt-2 text-sm">{zh?'正确顺序：':'Correct sequence: '}{result.referenceAnswer.join(' → ')}</p><p className="mt-2 text-xs">{zh?'可以回看正确顺序，或开始下一轮继续训练。':'Replay the correct sequence, or start another round.'}</p></div>}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
        <p className="max-w-md text-xs leading-6 text-slate-500">{member?(zh?'会员可持续生成新序列。完成点击后自动保存成绩。':'Members get newly generated sequences. Results save automatically after recall.'):(zh?'免费训练累计 10 轮，使用预设序列；每开始一轮扣 1 次，不每日重置。':'10 lifetime free rounds using preset sequences. Each start uses one round; no daily reset.')}</p>
        {active?(answer&&!busy?<button onClick={()=>void submit(answer)} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">{zh?'重新提交本轮':'Retry submission'}</button>:<span role="status" className="text-sm text-indigo-600">{busy?(zh?'正在保存…':'Saving…'):(zh?'请完成本轮回忆':'Complete this round')}</span>):exhausted?<Link href="/billing" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">{zh?'免费轮数已用完 · 开通会员':'Free rounds used · unlock membership'}</Link>:<button disabled={busy||!ready||(!!userId&&!account)} onClick={()=>void start()} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{busy?(zh?'准备中…':'Preparing…'):result?(zh?'开始下一轮':'Start next round'):(zh?'开始记忆训练':'Start memory training')}</button>}
      </div>
    </section>
    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link href={`/${lang}/grid`} className="font-medium text-indigo-600">{zh?'进阶：空间记忆双任务 →':'Next: Grid dual-task memory →'}</Link><Link href={`/${lang}/exams`} className="text-slate-500">{zh?'前往模拟考中心 →':'Explore mock exams →'}</Link></div>
    <section><h2 className="font-semibold">{zh?'我的记忆训练记录':'My memory training history'}</h2><p className="mb-4 mt-2 text-xs text-slate-500">{zh?'最近 50 轮已完成的记忆训练，与练习题库分别记录。':'Your latest 50 completed memory rounds, separate from the practice bank.'}</p>{historyError&&<button onClick={()=>setRevision(v=>v+1)} className="mb-4 text-sm text-rose-600">{zh?'记录加载失败，点击重试':'History unavailable. Retry'}</button>}{!history.length?<p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">{userId?(zh?'完成第一轮后，训练记录会显示在这里。':'Complete a round to see your history here.'):(zh?'登录后可保存并查看自己的训练记录。':'Sign in to save and review your training history.')}</p>:<ul className="divide-y rounded-xl border border-slate-200">{history.map(item=><li key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-4"><div><p className="text-sm font-medium">{item.question.sequence.length} {zh?'个位置':'positions'} · <span className={item.correct?'text-emerald-700':'text-amber-700'}>{item.correct?(zh?'正确':'Correct'):(zh?'待加强':'Keep practising')}</span></p><p className="mt-1 text-xs text-slate-400">{new Date(item.submittedAt).toLocaleString(zh?'zh-CN':'en-GB')}</p></div><button disabled={active||busy} onClick={()=>{setRound(item);setResult(item);setAnswer(item.answer);window.scrollTo({top:0,behavior:'smooth'});}} className="text-sm text-indigo-600 disabled:opacity-40">{zh?'回看本轮':'Review round'}</button></li>)}</ul>}</section>
  </div>;
}
