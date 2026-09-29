'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import GridBoard from './GridBoard';

const sample={kind:'grid' as const,sequence:[7,19,11],spatial:[
  {cells:[1,0,0,1,0,1,1,0,1,1,1,1,0,0,0,0]},
  {cells:[1,0,0,1,0,1,0,0,1,0,0,1,0,1,1,0]},
  {cells:[0,1,1,0,1,0,0,1,0,0,0,0,1,1,1,1]},
]};
const reference=[7,19,11,1,0,1];
export default function GridTraining(){
  const {lang}=useI18n(),zh=lang==='zh';
  const [round,setRound]=useState(0);
  const [answer,setAnswer]=useState<number[]|null>(null);
  return <div className="space-y-6"><h1 className="text-3xl font-bold">{zh?'空间记忆训练':'Grid memory training'}</h1><p className="max-w-3xl text-sm leading-7 text-slate-600">{zh?'这类题同时考查工作记忆和空间判断。与普通圆点记忆不同，你需要在干扰任务之后仍然记住位置与顺序。下面是一轮免费固定样题；模拟考提供 9 轮限时随机练习。':'Train working memory and spatial judgement together. Keep the dot sequence in mind while completing interference tasks. Try this free fixed sample; the member exam offers nine timed, randomized rounds.'}</p><section className="rounded-2xl border border-slate-200 p-5 sm:p-8"><GridBoard key={round} question={sample} zh={zh} disabled={!!answer} onAnswer={setAnswer}/>{answer&&<div role="status" className="mt-6 rounded-xl bg-indigo-50 p-5"><h2 className="font-semibold">{zh?'本轮得分':'Round score'} · {answer.filter((v,i)=>v===reference[i]).length}/6</h2><p className="mt-3 text-sm">{zh?'正确位置：7 → 19 → 11。对称判断：对称、不对称、对称。每个顺序位置与每次判断各 1 分。':'Positions: 7 → 19 → 11. Symmetry: yes, no, yes. Each ordered position and judgement earns one point.'}</p><p className="mt-2 text-sm">{zh?'你的回忆：':'Your recall: '}{answer.slice(0,3).join(' → ')}</p><button onClick={()=>{setAnswer(null);setRound(v=>v+1);}} className="mt-4 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm">{zh?'重做这道样题':'Repeat this sample'}</button></div>}</section><Link href={`/${lang}/exams`} className="inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">{zh?'前往模拟考中心 →':'Go to mock exam centre →'}</Link><p className="text-xs text-slate-500">{zh?'原创熟悉练习，非官方试题。圆点位置使用从上到下、从左到右的 1–25 编号。':'Original familiarization, not official content. Dot positions are numbered 1–25, left to right, top to bottom.'}</p></div>;
}
