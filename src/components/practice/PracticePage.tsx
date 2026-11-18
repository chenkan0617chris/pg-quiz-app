'use client';

import { useEffect,useRef,useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useI18n } from '@/lib/i18n';
import { useSolveRequest } from '@/lib/solve-request';
import { useAccount } from '@/lib/use-account';
import { FREE_PRACTICE_PER_KIND,hasFullAccess } from '@/lib/access-policy';
import { priceFor } from '@/lib/payment-product';
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
type PracticeChoice = { kind: Question['kind']; mark: string; zh: { title: string; detail: string }; en: { title: string; detail: string } };

const DIFFICULTIES: {value:Difficulty;zh:string;en:string}[] = [
  { value: 'easy', zh: '基础', en: 'Basic' },
  { value: 'medium', zh: '进阶', en: 'Intermediate' },
  { value: 'hard', zh: '挑战', en: 'Advanced' },
];
const HISTORY_PAGE_SIZE = 8;

const PRACTICE_CHOICES: PracticeChoice[] = [
  { kind: 'pipeline', mark: '↔', zh: { title: '管道题（Switch）', detail: '根据输入与输出，推导每个变换方框的规则。' }, en: { title: 'Switch Challenge', detail: 'Infer the rule inside each box from the input and output rows.' } },
  { kind: 'figure', mark: '◇', zh: { title: '图形推理', detail: '观察连续图形，找出旋转、镜像、移动或反转规律。' }, en: { title: 'Figure reasoning', detail: 'Find the rotation, reflection, movement or inversion pattern.' } },
  { kind: 'data', mark: '▥', zh: { title: '图表与数据分析', detail: '读表和图，练习增长率、占比、比值和单位转换。' }, en: { title: 'Data interpretation', detail: 'Read charts and tables to calculate growth, shares, ratios and units.' } },
  { kind: 'numerical', mark: '×', zh: { title: '数字题（Digit）', detail: '用不同数字完成等式，找出所有符合条件的组合。' }, en: { title: 'Digit Challenge', detail: 'Use distinct digits to complete an equation and find valid combinations.' } },
];

export default function PracticePage({initialKind = 'pipeline'}: {initialKind?: Question['kind']}) {
  const {userId}=useAuth();
  return <PracticeContent key={`${userId??'visitor'}:${initialKind}`} initialKind={initialKind} />;
}

function PracticeContent({initialKind}: {initialKind: Question['kind']}) {
  const {lang}=useI18n();
  const {isSignedIn,userId}=useAuth();
  const zh=lang==='zh';
  const [kind,setKind]=useState<Question['kind']>(initialKind);
  const [difficulty,setDifficulty]=useState<Difficulty>('easy');
  const {account}=useAccount();
  const fullAccess=!!account&&hasFullAccess(account.status);
  const remaining=account?.practiceRemaining?.[kind];
  const exhausted=!!account&&!fullAccess&&(remaining??0)<=0;
  const [exercise,setExercise]=useState<Exercise|null>(null);
  const [digits,setDigits]=useState<string[]>([]);
  const [result,setResult]=useState<Result|null>(null);
  const [history,setHistory]=useState<Result[]>([]);
  const [historyError,setHistoryError]=useState(false);
  const [wrongOnly,setWrongOnly]=useState(false);
  const [revision,setRevision]=useState(0);
  const [historyPage,setHistoryPage]=useState(0);
  const toolRef=useRef<HTMLElement>(null);
  const resultRef=useRef<HTMLDivElement>(null);
  // Bring the practice area to the top of the viewport so the question, answer controls and
  // submit button are visible without scrolling — the SEO intro above would otherwise push them down.
  function revealTool(){requestAnimationFrame(()=>{const el=toolRef.current;if(!el)return;const top=el.getBoundingClientRect().top;if(top<0||top>80)el.scrollIntoView({behavior:'smooth',block:'start'});});}
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
    const next=await run({action:'start',kind:retry?.question.kind??kind,difficulty,...(retry?{retryId:retry.id}:{})});
    if(next){setKind(next.question.kind);if(next.question.kind==='pipeline')setDifficulty(next.question.difficulty);setExercise(next);setDigits(Array(next.question.kind==='pipeline'?4:(next.question.kind==='data'||next.question.kind==='figure')?1:3).fill(''));setResult(null);revealTool();}
  }
  async function submit(e:React.FormEvent) {
    e.preventDefault();
    if(!exercise || digits.some(v=>v===''))return;
    const next=await run({action:'submit',id:exercise.id,answer:digits.map(Number)});
    if(next && 'correct' in next){setResult(next);setRevision(v=>v+1);requestAnimationFrame(()=>resultRef.current?.scrollIntoView({behavior:'smooth',block:'nearest'}));}
  }
  function selectKind(nextKind: Question['kind']) {
    setKind(nextKind);
    if(nextKind==='pipeline')setDifficulty('easy');
    setExercise(null);
    setDigits([]);
    setResult(null);
  }
  const visibleHistory=isSignedIn?history.filter(r=>!wrongOnly || !r.correct):[];
  const historyPages=Math.max(1,Math.ceil(visibleHistory.length/HISTORY_PAGE_SIZE));
  const page=Math.min(historyPage,historyPages-1);
  const pagedHistory=visibleHistory.slice(page*HISTORY_PAGE_SIZE,(page+1)*HISTORY_PAGE_SIZE);
  const selectedChoice=PRACTICE_CHOICES.find(choice=>choice.kind===kind)!;
  const selectedCopy=selectedChoice[zh?'zh':'en'];
  return <div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <section ref={toolRef} className="scroll-mt-4 rounded-xl border border-gray-200 p-5 shadow-sm sm:p-6">
        <section className="mb-4" aria-labelledby="practice-picker-title">
          <h2 id="practice-picker-title" className="sr-only">{zh?'选择题型':'Choose a question type'}</h2>
          <div role="radiogroup" aria-label={zh?'选择题型':'Choose a question type'} className="grid grid-cols-2 gap-3">
            {PRACTICE_CHOICES.map(choice=>{
              const copy=choice[zh?'zh':'en'];
              const selected=choice.kind===kind;
              const left=account&&!fullAccess?Math.max(0,account.practiceRemaining?.[choice.kind]??FREE_PRACTICE_PER_KIND):null;
              return <button key={choice.kind} type="button" role="radio" aria-checked={selected} onClick={()=>selectKind(choice.kind)} className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-left transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${selected?'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500':'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'}`}>
                <span aria-hidden className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-lg font-semibold ${selected?'bg-indigo-600 text-white':'bg-slate-100 text-slate-500 group-hover:text-indigo-700'}`}>{choice.mark}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-5 text-slate-900">{copy.title}</span>
                  {left!==null&&<span className={`mt-0.5 block text-xs ${left>0?'text-slate-500':'font-medium text-amber-700'}`}>{left>0?(zh?`免费剩 ${left} 题`:`${left} free left`):(zh?'免费已用完':'Free used up')}</span>}
                </span>
              </button>;
            })}
          </div>
        </section>
        <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-700">{selectedCopy.detail}</p>
          <p className="mt-1 text-xs text-slate-500">{fullAccess
              ? (zh?'会员 · 不限题量':'Member · unlimited questions')
              : exhausted
                ? (zh?'免费新题已用完 · 做过的题仍可在「最近练习」重练':`All ${FREE_PRACTICE_PER_KIND} free questions for this type are used. Past questions can still be retried from Recent practice.`)
                : account
                  ? (zh?`免费新题剩 ${remaining}/${FREE_PRACTICE_PER_KIND} 道 · 做过的题可免费重练`:`${remaining}/${FREE_PRACTICE_PER_KIND} free new questions left · retries are free`)
                  : (zh?`每类题型免费 ${FREE_PRACTICE_PER_KIND} 道，登录后开始`:`${FREE_PRACTICE_PER_KIND} free questions per type · sign in to start`)}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
            {kind==='pipeline'?<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span id="practice-difficulty-label" className="text-sm font-medium text-slate-700">{zh?'难度':'Difficulty'}</span>
              <div role="radiogroup" aria-labelledby="practice-difficulty-label" className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
                {DIFFICULTIES.map(d=><button key={d.value} type="button" role="radio" aria-checked={difficulty===d.value} onClick={()=>setDifficulty(d.value)} className={`cursor-pointer rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition ${difficulty===d.value?'bg-indigo-600 font-medium text-white shadow-sm':'text-slate-600 hover:bg-slate-100'}`}>{zh?d.zh:d.en}</button>)}
              </div>
            </div>:<span/>}
            {exhausted
              ? <Link href="/billing" className="rounded-lg bg-indigo-600 px-5 py-2 text-center font-medium whitespace-nowrap text-white hover:bg-indigo-700">{zh?'开通会员':'Unlock membership'} · {priceFor(lang).label} / {zh?'7 天':'7 days'}</Link>
              : <button disabled={busy||!ready||(!!isSignedIn&&!account)} onClick={()=>start()} className="min-w-28 cursor-pointer rounded-lg bg-indigo-600 px-6 py-2 font-medium whitespace-nowrap text-white hover:bg-indigo-700 disabled:cursor-default disabled:opacity-50">{busy?'…':(zh?'开始':'Start')}</button>}
          </div>
        </div>
        {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
        {!exercise || !isSignedIn ? <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
          {zh?'选好题型后点击上方按钮开始。题目为规则生成的原创练习。':'Pick a type and press the button above to start. Questions are original generated exercises.'}
        </div> : <form onSubmit={submit}>
          {exercise.question.kind==='pipeline'?<PipelineQuestionBoard question={exercise.question} values={digits} onChange={setDigits} disabled={!!result||busy} zh={zh}/>:exercise.question.kind==='figure'?<div><p className="mb-4 text-sm text-slate-600">{zh?'观察前五幅图，选择下一幅。格子按旋转、镜像、移动或黑白翻转规律变化。':'Study the five figures and select the next. Look for rotation, reflection, movement or inversion.'}</p><div className="flex flex-wrap gap-3">{exercise.question.frames.map((mask,i)=><Figure key={i} mask={mask} label={`${i+1}`}/>)}<div className="flex w-24 items-center justify-center text-3xl">?</div></div></div>:exercise.question.kind==='data'?<DataPrompt question={exercise.question} zh={zh}/>:<NumericalBoard key={exercise.id} target={exercise.question.target} values={digits} onChange={setDigits} disabled={!!result||busy} zh={zh}/>}
          {exercise.question.kind==='figure'?<fieldset className="my-6 flex flex-wrap gap-3"><legend className="mb-2">{zh?'选择下一幅图形':'Choose the next figure'}</legend>{exercise.question.options.map((mask,i)=><label key={i} className={`cursor-pointer rounded-lg border p-3 ${digits[0]===String(i+1)?'border-indigo-500 bg-indigo-50':'border-slate-200'}`}><input type="radio" name="figure-answer" aria-label={`${zh?'选项':'Option'} ${String.fromCharCode(65+i)}`} disabled={!!result||busy} checked={digits[0]===String(i+1)} onChange={()=>setDigits([String(i+1)])}/><Figure mask={mask} label={String.fromCharCode(65+i)}/></label>)}</fieldset>:exercise.question.kind==='data'?<fieldset className="my-6 grid gap-3 sm:grid-cols-2"><legend className="mb-2 text-sm">{zh?'选择一个答案':'Choose one answer'}</legend>{exercise.question.options.map((option,i)=><label key={i} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${digits[0]===String(i+1)?'border-indigo-500 bg-indigo-50':'border-gray-200'}`}><input type="radio" name="data-answer" required disabled={!!result||busy} checked={digits[0]===String(i+1)} onChange={()=>setDigits([String(i+1)])}/>{String.fromCharCode(65+i)}. {option.toFixed(1)}{exercise.question.kind==='data'&&exercise.question.metric!=='ratio'?'%':''}</label>)}</fieldset>:null}
          {!result && <button disabled={busy||digits.some(v=>!v)} className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{zh?'提交答案':'Check answer'}</button>}
          {result && <div ref={resultRef} role="status" className={`scroll-mt-4 rounded-lg p-5 ${result.correct?'bg-green-50 text-green-900':'bg-amber-50 text-amber-900'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">{result.correct?(zh?'回答正确':'Correct'):(zh?'再接再厉':'Not quite')}</p>
                <p className="mt-1 text-sm">{zh?'你的答案：':'Your answer: '}{(result.question.kind==='data'||result.question.kind==='figure')?String.fromCharCode(64+result.answer[0]):result.answer.join(', ')}</p>
              </div>
              {!exhausted&&<button type="button" autoFocus onClick={()=>start()} disabled={busy} className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">{zh?'下一题':'Next question'} → <span className="ml-1 hidden text-xs font-normal opacity-75 lg:inline">Enter</span></button>}
            </div>
            <Lesson key={result.id} explanation={result.explanation} question={result.question}/>
          </div>}
        </form>}
      </section>
      <aside className="self-start rounded-xl border border-gray-200 p-4 xl:sticky xl:top-4">
        <div className="flex items-baseline justify-between gap-2"><h2 className="font-semibold">{zh?'最近练习':'Recent practice'}</h2><span className="text-xs text-gray-500">{zh?'最近 50 次':'Last 50'}</span></div>
        <label className="my-3 flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={wrongOnly} onChange={e=>{setWrongOnly(e.target.checked);setHistoryPage(0);}}/>{zh?'只看错题':'Mistakes only'}</label>
        {historyError && isSignedIn && <button onClick={()=>setRevision(v=>v+1)} className="text-sm text-red-600">{zh?'记录加载失败，点击重试':'History unavailable. Retry'}</button>}
        {!visibleHistory.length && <p className="text-sm text-gray-400">{zh?'暂无记录':'No submissions yet'}</p>}
        <ul className="space-y-2">{pagedHistory.map(row=><li key={row.id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
          <div className="flex items-center justify-between gap-2"><span className="font-medium text-slate-800">{row.question.kind==='pipeline'?(zh?'管道题':'Switch Challenge'):row.question.kind==='figure'?(zh?'图形推理':'Figure reasoning'):row.question.kind==='data'?(zh?'数据分析':'Data interpretation'):(zh?'数字题':'Digit Challenge')}</span><span aria-label={row.correct?(zh?'正确':'Correct'):(zh?'错误':'Wrong')} className={row.correct?'text-green-600':'text-red-500'}>{row.correct?'✓':'✗'}</span></div>
          <div className="mt-1 flex items-center justify-between gap-2 text-xs">
            <span className="text-gray-400">{new Date(row.submittedAt).toLocaleString(zh?'zh-CN':'en-US',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
            <span className="flex shrink-0 gap-3">
              <button disabled={busy} onClick={()=>{setExercise(row);setResult(row);setDigits(row.answer.map(String));setKind(row.question.kind);revealTool();}} className="cursor-pointer text-indigo-600 hover:underline">{zh?'题解':'Solution'}</button>
              <button disabled={busy} onClick={()=>start(row)} className="cursor-pointer text-indigo-600 hover:underline">{zh?'重练':'Retry'}</button>
            </span>
          </div>
        </li>)}</ul>
        {historyPages>1&&<nav aria-label={zh?'最近练习分页':'Recent practice pages'} className="mt-4 flex items-center justify-between text-sm">
          <button type="button" disabled={page===0} onClick={()=>setHistoryPage(page-1)} aria-label={zh?'上一页':'Previous'} className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-40">← {zh?'上一页':'Previous'}</button>
          <span className="text-xs text-slate-500">{page+1} / {historyPages}</span>
          <button type="button" disabled={page>=historyPages-1} onClick={()=>setHistoryPage(page+1)} aria-label={zh?'下一页':'Next'} className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-40">{zh?'下一页':'Next'} →</button>
        </nav>}
      </aside>
    </div>
  </div>;
}
