'use client';

import { useEffect,useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useI18n } from '@/lib/i18n';
import { useSolveRequest } from '@/lib/solve-request';
import { useAccount } from '@/lib/use-account';
import { FREE_SAMPLES_PER_KIND,hasFullAccess } from '@/lib/access-policy';
import { PRICE_LABEL } from '@/lib/payment-product';
import Link from 'next/link';
import PipelineQuestionBoard from './PipelineQuestionBoard';

import type { PublicQuestion, Explanation, Difficulty } from '@/lib/practice';
import Lesson from '@/components/practice/Lesson';
import Figure from '@/components/practice/Figure';
import DataPrompt from '@/components/practice/DataPrompt';
import NumericalBoard from './NumericalBoard';
type Question = Exclude<PublicQuestion,{kind:'memory'}>;
type Exercise = {id:string;question:Question};
type Result = Exercise & {answer:number[];correct:boolean;referenceAnswer:number[];submittedAt:string;explanation:Explanation};

export default function PracticePage({initialKind = 'pipeline'}: {initialKind?: Question['kind']}) {
  const {userId}=useAuth();
  return <PracticeContent key={`${userId??'visitor'}:${initialKind}`} initialKind={initialKind} />;
}

function PracticeContent({initialKind}: {initialKind: Question['kind']}) {
  const {lang}=useI18n();
  const {isSignedIn,userId}=useAuth();
  const zh=lang==='zh';
  const [kind,setKind]=useState<Question['kind']>(initialKind);
  const [difficulty,setDifficulty]=useState<Difficulty>('medium');
  const [sampleIndex,setSampleIndex]=useState(0);
  const {account}=useAccount();
  const fullAccess=!!account&&hasFullAccess(account.status);
  const [exercise,setExercise]=useState<Exercise|null>(null);
  const [digits,setDigits]=useState<string[]>([]);
  const [result,setResult]=useState<Result|null>(null);
  const [history,setHistory]=useState<Result[]>([]);
  const [historyError,setHistoryError]=useState(false);
  const [wrongOnly,setWrongOnly]=useState(false);
  const [revision,setRevision]=useState(0);
  const {run,busy,ready,error}=useSolveRequest<Exercise|Result>('/api/practice');
  useEffect(()=>{
    if(!isSignedIn)return;
    const controller=new AbortController();
    fetch('/api/practice?scope=bank',{signal:controller.signal}).then(async r=>{
      if(!r.ok)throw new Error();
      const rows=await r.json() as Result[];
      setHistory(rows);setHistoryError(false);
    }).catch(()=>{if(!controller.signal.aborted)setHistoryError(true);});
    return ()=>controller.abort();
  },[isSignedIn,userId,revision]);

  async function start(retry?:Result) {
    const next=await run({action:'start',kind:retry?.question.kind??kind,difficulty,sampleIndex,...(retry?{retryId:retry.id}:{})});
    if(next){setKind(next.question.kind);if(next.question.kind==='pipeline')setDifficulty(next.question.difficulty);setExercise(next);setDigits(Array(next.question.kind==='pipeline'?4:(next.question.kind==='data'||next.question.kind==='figure')?1:3).fill(''));setResult(null);}
  }
  async function submit(e:React.FormEvent) {
    e.preventDefault();
    if(!exercise || digits.some(v=>v===''))return;
    const next=await run({action:'submit',id:exercise.id,answer:digits.map(Number)});
    if(next && 'correct' in next){setResult(next);setRevision(v=>v+1);}
  }
  const visibleHistory=isSignedIn?history.filter(r=>!wrongOnly || !r.correct):[];
  return <div>
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <section className="rounded-xl border border-gray-200 p-5 shadow-sm sm:p-7">
        {!fullAccess&&<div className="mb-5 rounded-lg bg-indigo-50 p-4 text-sm text-indigo-900">
          <p>{zh?'免费练习：四类题型各 5 道固定样题，可反复练习。会员可生成新题。':'Free practice: 5 repeatable samples for each of four question types. Members can generate new questions.'}</p>
          <Link href="/billing" className="mt-2 inline-block font-medium underline">{zh?'解锁会员':'Unlock full access'} · {PRICE_LABEL} / {zh?'30 天':'30 days'}</Link>
        </div>}
        <div className="mb-6 flex flex-wrap gap-3">
          <label className="sr-only" htmlFor="practice-kind">{zh?'题型':'Question type'}</label>
          <select id="practice-kind" value={kind} onChange={e=>setKind(e.target.value as typeof kind)} className="rounded-lg border border-gray-300 px-3 py-2">
            <option value="pipeline">{zh?'管道推理':'Pipeline logic'}</option>
            <option value="figure">{zh?'图形推理':'Figure reasoning'}</option>
            <option value="data">{zh?'图表与数据分析':'Data interpretation'}</option>
            <option value="numerical">{zh?'数字运算':'Numerical reasoning'}</option>
          </select>
          {fullAccess&&kind==='pipeline' && <label className="flex items-center gap-2 text-sm">{zh?'难度':'Difficulty'}<select value={difficulty} onChange={e=>setDifficulty(e.target.value as Difficulty)} className="rounded-lg border px-3 py-2"><option value="easy">{(zh?'基础 · 1 级':'Basic · 1 stage')}</option><option value="medium">{(zh?'进阶 · 2 级':'Intermediate · 2 stages')}</option><option value="hard">{(zh?'挑战 · 3 级':'Advanced · 3 stages')}</option></select></label>}
          {!fullAccess&&<label className="flex items-center gap-2 text-sm">{zh?'固定样题':'Sample'}<select value={sampleIndex} onChange={e=>setSampleIndex(Number(e.target.value))} className="rounded-lg border px-3 py-2">{Array.from({length:FREE_SAMPLES_PER_KIND},(_,i)=><option key={i} value={i}>{zh?'样题':'Sample'} {i+1}</option>)}</select></label>}
          <button disabled={busy||!ready||(!!isSignedIn&&!account)} onClick={()=>start()} className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white disabled:opacity-50">{busy?'…':fullAccess?(zh?'开始 / 换一题':'Start / New question'):(zh?'练习所选样题':'Start selected sample')}</button>
        </div>
        {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
        {!exercise || !isSignedIn ? <div className="rounded-lg bg-slate-50 p-6 text-sm leading-7 text-slate-600">
          <p>{zh?'管道推理：根据图形输入、输出顺序，推导变换方框。':'Pipeline: infer the transformation from the input and output shapes.'}</p>
          <p>{zh?'数字运算：为 a × b + c 填入 1–9 的不同数字。':'Numerical: fill a × b + c using distinct digits from 1–9.'}</p>
          <p>{zh?'图形推理：观察连续图形，找出规律并选择下一幅。':'Figure reasoning: infer the pattern and choose the next figure.'}</p>
          <p>{zh?'图表与数据分析：阅读销售图表，练习增长率、占比和比值。':'Data interpretation: read sales charts and practise growth rates, shares and ratios.'}</p>
          <p className="mt-4 font-medium">{zh?'点击开始练习；未登录时会提示登录。题目为规则生成的原创练习。':'Start to practice; sign in when prompted. Questions are original generated exercises.'}</p>
        </div> : <form onSubmit={submit}>
          {exercise.question.kind==='pipeline'?<PipelineQuestionBoard question={exercise.question} values={digits} onChange={setDigits} disabled={!!result||busy} zh={zh}/>:exercise.question.kind==='figure'?<div><p className="mb-4 text-sm text-slate-600">{zh?'观察前五幅图，选择下一幅。格子按旋转、镜像、移动或黑白翻转规律变化。':'Study the five figures and select the next. Look for rotation, reflection, movement or inversion.'}</p><div className="flex flex-wrap gap-3">{exercise.question.frames.map((mask,i)=><Figure key={i} mask={mask} label={`${i+1}`}/>)}<div className="flex w-24 items-center justify-center text-3xl">?</div></div></div>:exercise.question.kind==='data'?<DataPrompt question={exercise.question} zh={zh}/>:<NumericalBoard key={exercise.id} target={exercise.question.target} values={digits} onChange={setDigits} disabled={!!result||busy} zh={zh}/>}
          {exercise.question.kind==='figure'?<fieldset className="my-6 flex flex-wrap gap-3"><legend className="mb-2">{zh?'选择下一幅图形':'Choose the next figure'}</legend>{exercise.question.options.map((mask,i)=><label key={i} className={`cursor-pointer rounded-lg border p-3 ${digits[0]===String(i+1)?'border-indigo-500 bg-indigo-50':'border-slate-200'}`}><input type="radio" name="figure-answer" aria-label={`${zh?'选项':'Option'} ${String.fromCharCode(65+i)}`} disabled={!!result||busy} checked={digits[0]===String(i+1)} onChange={()=>setDigits([String(i+1)])}/><Figure mask={mask} label={String.fromCharCode(65+i)}/></label>)}</fieldset>:exercise.question.kind==='data'?<fieldset className="my-6 grid gap-3 sm:grid-cols-2"><legend className="mb-2 text-sm">{zh?'选择一个答案':'Choose one answer'}</legend>{exercise.question.options.map((option,i)=><label key={i} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${digits[0]===String(i+1)?'border-indigo-500 bg-indigo-50':'border-gray-200'}`}><input type="radio" name="data-answer" required disabled={!!result||busy} checked={digits[0]===String(i+1)} onChange={()=>setDigits([String(i+1)])}/>{String.fromCharCode(65+i)}. {option.toFixed(1)}{exercise.question.kind==='data'&&exercise.question.metric!=='ratio'?'%':''}</label>)}</fieldset>:null}
          {!result && <button disabled={busy||digits.some(v=>!v)} className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{zh?'提交答案':'Check answer'}</button>}
          {result && <div role="status" className={`rounded-lg p-5 ${result.correct?'bg-green-50 text-green-900':'bg-amber-50 text-amber-900'}`}>
            <p className="font-bold">{result.correct?(zh?'回答正确':'Correct'):(zh?'再接再厉':'Not quite')}</p>
            <p className="mt-2">{zh?'你的答案：':'Your answer: '}{(result.question.kind==='data'||result.question.kind==='figure')?String.fromCharCode(64+result.answer[0]):result.answer.join(', ')}</p>
            <Lesson key={result.id} explanation={result.explanation} question={result.question}/>
            <button type="button" onClick={()=>start()} disabled={busy} className="mt-4 font-semibold underline">{zh?'下一题':'Next question'} →</button>
          </div>}
        </form>}
      </section>
      <aside className="rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold">{zh?'最近练习':'Recent practice'}</h2>
        <p className="mt-2 text-xs text-gray-500">{zh?'保留最近 50 次已提交记录':'Shows your last 50 submissions'}</p>
        <label className="my-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={wrongOnly} onChange={e=>setWrongOnly(e.target.checked)}/>{zh?'只看错题':'Mistakes only'}</label>
        {historyError && isSignedIn && <button onClick={()=>setRevision(v=>v+1)} className="text-sm text-red-600">{zh?'记录加载失败，点击重试':'History unavailable. Retry'}</button>}
        {!visibleHistory.length && <p className="text-sm text-gray-400">{zh?'暂无记录':'No submissions yet'}</p>}
        <ul className="space-y-3">{visibleHistory.map(row=><li key={row.id} className="rounded-lg bg-gray-50 p-3 text-sm">
          <div className="flex justify-between"><span>{row.question.kind==='pipeline'?(zh?'管道推理':'Pipeline'):row.question.kind==='figure'?(zh?'图形推理':'Figure reasoning'):row.question.kind==='data'?(zh?'数据分析':'Data interpretation'):(zh?'数字运算':'Numerical')}</span><span>{row.correct?'✓':'✗'}</span></div>
          <p className="mt-1 text-xs text-gray-400">{new Date(row.submittedAt).toLocaleString(zh?'zh-CN':'en-US')}</p>
          <button disabled={busy} onClick={()=>{setExercise(row);setResult(row);setDigits(row.answer.map(String));setKind(row.question.kind);window.scrollTo({top:0,behavior:'smooth'});}} className="mr-4 mt-2 text-indigo-600">{zh?'查看题解':'View solution'}</button>
          <button disabled={busy} onClick={()=>start(row)} className="mt-2 text-indigo-600">{zh?'重新练习':'Practice again'}</button>
        </li>)}</ul>
      </aside>
    </div>
  </div>;
}
