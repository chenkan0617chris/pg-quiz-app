'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useTrainingActivity } from '@/lib/use-training-activity';
import { useSolveRequest } from '@/lib/solve-request';
import { useAccount } from '@/lib/use-account';
import { FREE_PRACTICE_PER_KIND, hasFullAccess } from '@/lib/access-policy';
import { allowanceState } from '@/lib/allowance';
import { UpgradeCard } from '@/components/AllowanceNotice';
import type { GridQuestion } from '@/lib/exam-types';
import type { Difficulty } from '@/lib/practice';
import GridBoard from './GridBoard';
import InfoTip from '@/components/InfoTip';

/** Shown before the first round so visitors can see the task without signing in. */
const preview:GridQuestion={kind:'grid',sequence:[7,19,11],spatial:[
  {cells:[1,0,0,1,0,1,1,0,1,1,1,1,0,0,0,0],symmetric:true},
  {cells:[1,0,0,1,0,1,0,0,1,0,0,1,0,1,1,0],symmetric:false},
  {cells:[0,1,1,0,1,0,0,1,0,0,0,0,1,1,1,1],symmetric:true},
]};
const LEVELS:[Difficulty,number][]=[['easy',3],['medium',4],['hard',5]];

export default function GridTraining(){
  const {lang}=useI18n(),zh=lang==='zh';
  const activity=useTrainingActivity('training:grid');
  const {userId,account}=useAccount();
  const member=!!account&&hasFullAccess(account.status);
  const remaining=account?.practiceRemaining?.grid;
  const exhausted=!!account&&!member&&(remaining??0)<=0;
  const {run,busy,ready,error,limited}=useSolveRequest<GridQuestion>('/api/grid');
  const locked=allowanceState({account,remaining,limited})==='locked';
  const [difficulty,setDifficulty]=useState<Difficulty>('easy');
  const [question,setQuestion]=useState<GridQuestion|null>(null);
  const [round,setRound]=useState(0);
  // Answers carry their round so a late report from the previous board cannot mark a new round as done.
  const [saved,setSaved]=useState<{round:number;value:number[]}|null>(null);
  const answer=saved?.round===round?saved.value:null;
  const shown=question??preview;
  const reference=[...shown.sequence,...shown.spatial.map(s=>s.symmetric?1:0)];
  const length=shown.sequence.length;
  const yes=(v:boolean)=>v?(zh?'对称':'yes'):(zh?'不对称':'no');

  async function start(){
    const next=await run({action:'start',difficulty});
    if(next){activity.reset();setQuestion(next);setRound(v=>v+1);}
  }

  return <div className="space-y-6">
    <div>
      <div className="flex items-center gap-2.5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{zh?'空间记忆训练':'Grid Challenge practice'}</h1>
        <InfoTip label={zh?'玩法说明':'How it works'}>{zh?'同时考查工作记忆和空间判断：记住圆点位置与顺序，中间穿插判断图案是否对称，最后按顺序回忆。每个顺序位置与每次判断各 1 分。圆点位置从上到下、从左到右编号 1–25。':'Tests working memory and spatial judgement together: remember dot positions in order while judging whether patterns are symmetric, then recall the sequence. Each ordered position and judgement scores one point. Dots are numbered 1–25, left to right, top to bottom.'}</InfoTip>
      </div>
      <p className="mt-2 text-[15px] text-slate-500">{zh?'边判断对称，边记住圆点的位置和顺序。':'Remember the dots in order while answering symmetry questions.'}</p>
    </div>
    <section onClickCapture={question?activity.start:undefined} className="rounded-2xl border border-slate-200 p-5 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <fieldset className="flex flex-wrap gap-2"><legend className="sr-only">{zh?'下一轮难度':'Next round difficulty'}</legend>{LEVELS.map(([level,count])=><button type="button" key={level} aria-pressed={difficulty===level} disabled={busy} onClick={()=>setDifficulty(level)} className={`rounded-lg border px-4 py-2 text-sm ${difficulty===level?'border-indigo-300 bg-indigo-50 font-medium text-indigo-700':'border-slate-200 text-slate-500'}`}>{count} {zh?'个位置':'positions'}</button>)}</fieldset>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500">{member?(zh?'不限轮数':'Unlimited'):account?(zh?`免费剩 ${remaining} 轮`:`${remaining} free rounds left`):(zh?`免费 ${FREE_PRACTICE_PER_KIND} 轮`:`${FREE_PRACTICE_PER_KIND} free rounds`)}</span>
      </div>
      {!question&&<p className="mb-3 text-xs text-slate-400">{zh?'示例题 · 可直接试做':'Sample round · try it now'}</p>}
      <GridBoard key={round} question={shown} zh={zh} disabled={!!answer||busy} onAnswer={value=>{if(saved?.round===round)return;setSaved({round,value});if(question)activity.complete();}}/>
      {answer&&<div role="status" className="mt-6 rounded-xl bg-indigo-50 p-5">
        <h2 className="font-semibold">{zh?'本轮得分':'Round score'} · {answer.filter((v,i)=>v===reference[i]).length}/{length*2}</h2>
        <p className="mt-3 text-sm">{zh?'正确位置：':'Positions: '}{shown.sequence.join(' → ')}{zh?'。对称判断：':'. Symmetry: '}{shown.spatial.map(s=>yes(s.symmetric)).join(zh?'、':', ')}{zh?'。':'.'}</p>
        <p className="mt-2 text-sm">{zh?'你的回忆：':'Your recall: '}{answer.slice(0,length).join(' → ')}</p>
      </div>}
      {error&&<p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5">
        {locked||(exhausted&&(!question||answer))?<div className="w-full"><UpgradeCard locked={locked} unit="round" limit={FREE_PRACTICE_PER_KIND}/></div>
          :<button disabled={busy||!ready||(!!userId&&!account)||(!!question&&!answer)} onClick={()=>void start()} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{busy?(zh?'出题中…':'Preparing…'):question?(zh?'下一轮（新题）':'Next round (new)'):(zh?'开始随机训练':'Start random training')}</button>}
      </div>
    </section>
    <Link href={`/${lang}/exams`} className="inline-block text-sm font-medium text-indigo-600 hover:underline">{zh?'限时模拟考 →':'Timed mock exam →'}</Link>
  </div>;
}
