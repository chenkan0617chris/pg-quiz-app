'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useTrainingActivity } from '@/lib/use-training-activity';
import { useSolveRequest } from '@/lib/solve-request';
import { useAccount } from '@/lib/use-account';
import { FREE_PRACTICE_PER_KIND, hasFullAccess } from '@/lib/access-policy';
import type { GridQuestion } from '@/lib/exam-types';
import type { Difficulty } from '@/lib/practice';
import GridBoard from './GridBoard';

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
  const {run,busy,ready,error}=useSolveRequest<GridQuestion>('/api/grid');
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
    <h1 className="text-3xl font-bold">{zh?'空间记忆训练':'Grid Challenge practice: dot memory training (Aon, P&G)'}</h1>
    <p className="max-w-3xl text-sm leading-7 text-slate-600">{zh?'这类题同时考查工作记忆和空间判断。与普通圆点记忆不同，你需要在干扰任务之后仍然记住位置与顺序。每一轮都是新生成的随机题，可以一直练下去。':'Train working memory and spatial judgement together. Keep the dot sequence in mind while completing interference tasks. Every round is newly generated, so you can keep practising.'}</p>
    <section onClickCapture={question?activity.start:undefined} className="rounded-2xl border border-slate-200 p-5 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <fieldset className="flex flex-wrap gap-2"><legend className="mb-2 text-xs text-slate-500">{zh?'下一轮难度':'Next round difficulty'}</legend>{LEVELS.map(([level,count])=><button type="button" key={level} aria-pressed={difficulty===level} disabled={busy} onClick={()=>setDifficulty(level)} className={`rounded-lg border px-4 py-2 text-sm ${difficulty===level?'border-indigo-300 bg-indigo-50 font-medium text-indigo-700':'border-slate-200 text-slate-500'}`}>{count} {zh?'个位置':'positions'}</button>)}</fieldset>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500">{member?(zh?'会员不限轮数':'Unlimited rounds'):account?(zh?`剩余 ${remaining} 轮免费训练`:`${remaining} free rounds left`):(zh?`${FREE_PRACTICE_PER_KIND} 轮免费体验`:`${FREE_PRACTICE_PER_KIND} free rounds`)}</span>
      </div>
      {!question&&<p className="mb-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">{zh?'下面是示例题，可直接试做；点击「开始随机训练」后每轮都会出新题。':'This is a sample you can try. Start random training to get a new round every time.'}</p>}
      <GridBoard key={round} question={shown} zh={zh} disabled={!!answer||busy} onAnswer={value=>{if(saved?.round===round)return;setSaved({round,value});if(question)activity.complete();}}/>
      {answer&&<div role="status" className="mt-6 rounded-xl bg-indigo-50 p-5">
        <h2 className="font-semibold">{zh?'本轮得分':'Round score'} · {answer.filter((v,i)=>v===reference[i]).length}/{length*2}</h2>
        <p className="mt-3 text-sm">{zh?'正确位置：':'Positions: '}{shown.sequence.join(' → ')}{zh?'。对称判断：':'. Symmetry: '}{shown.spatial.map(s=>yes(s.symmetric)).join(zh?'、':', ')}{zh?'。每个顺序位置与每次判断各 1 分。':'. Each ordered position and judgement earns one point.'}</p>
        <p className="mt-2 text-sm">{zh?'你的回忆：':'Your recall: '}{answer.slice(0,length).join(' → ')}</p>
      </div>}
      {error&&<p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5">
        {exhausted?<Link href="/billing" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">{zh?'免费轮数已用完 · 开通会员':'Free rounds used · unlock membership'}</Link>
          :<button disabled={busy||!ready||(!!userId&&!account)||(!!question&&!answer)} onClick={()=>void start()} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{busy?(zh?'出题中…':'Preparing…'):question?(zh?'下一轮（新题）':'Next round (new)'):(zh?'开始随机训练':'Start random training')}</button>}
        <p className="text-xs text-slate-500">{member?(zh?'每轮都是新题，不限轮数。':'Every round is new, with no limit.'):(zh?`免费账号累计 ${FREE_PRACTICE_PER_KIND} 轮随机训练，不每日重置；会员不限轮数。`:`Free accounts get ${FREE_PRACTICE_PER_KIND} random rounds (no daily reset); members are unlimited.`)}</p>
      </div>
    </section>
    <Link href={`/${lang}/exams`} className="inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">{zh?'前往模拟考中心 →':'Go to mock exam centre →'}</Link>
    <p className="text-xs text-slate-500">{zh?'原创熟悉练习，非官方试题。圆点位置使用从上到下、从左到右的 1–25 编号。':'Original familiarization, not official content. Dot positions are numbered 1–25, left to right, top to bottom.'}</p>
  </div>;
}
