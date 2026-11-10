'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTrainingActivity } from '@/lib/use-training-activity';
import { useI18n } from '@/lib/i18n';
import { PAIRS, PEAK_DIMENSIONS, SCENARIOS, STATEMENTS, type Dimension, type Pair, type Scenario, type Statement } from '@/content/peak-bank';

type Item = {type:'statement';item:Statement}|{type:'pair';item:Pair}|{type:'scenario';item:Scenario};
const DIMS=Object.keys(PEAK_DIMENSIONS) as Dimension[];

function shuffle<T>(values:T[]):T[] {
  const result=[...values];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
/** One positive statement per dimension, two reverse-worded checks on included dimensions, five pairs and three scenarios. */
export function drawRound():Item[] {
  const forward=DIMS.map(dim=>shuffle(STATEMENTS.filter(s=>s.dim===dim&&!s.reverse))[0]);
  const reverse=shuffle(DIMS).slice(0,2).map(dim=>shuffle(STATEMENTS.filter(s=>s.dim===dim&&s.reverse))[0]);
  const statements=shuffle([...forward,...reverse]).map(item=>({type:'statement' as const,item}));
  const pairs=shuffle(PAIRS).slice(0,5).map(item=>({type:'pair' as const,item}));
  const scenarios=shuffle(SCENARIOS).slice(0,3).map(item=>({type:'scenario' as const,item}));
  return [...statements,...pairs,...scenarios];
}

export default function PeakTraining(){
  const {lang}=useI18n(),zh=lang==='zh';
  const activity=useTrainingActivity('training:peak');
  // Drawn after mount so server and client markup match.
  const [items,setItems]=useState<Item[]|null>(null);
  const [answers,setAnswers]=useState<Record<number,number>>({});
  const [done,setDone]=useState(false);
  useEffect(()=>{const timer=setTimeout(()=>setItems(drawRound()),0);return ()=>clearTimeout(timer);},[]);
  const labels=zh?['非常不符合','较不符合','一般','较符合','非常符合']:['Strongly disagree','Disagree','Neutral','Agree','Strongly agree'];
  const total=items?.length??0, answered=Object.keys(answers).length;
  function pick(index:number,value:number){activity.start();setAnswers({...answers,[index]:value});}
  function next(){activity.reset();setAnswers({});setDone(false);setItems(drawRound());window.scrollTo({top:0,behavior:'smooth'});}

  // Self-description profile: agreement on positive statements, reversed for reverse-worded ones, plus pair choices.
  const profile=DIMS.map(dim=>{
    let sum=0,count=0,picks=0;
    items?.forEach((entry,i)=>{
      const a=answers[i];if(a===undefined)return;
      if(entry.type==='statement'&&entry.item.dim===dim){sum+=entry.item.reverse?4-a:a;count++;}
      if(entry.type==='pair'&&(a===0?entry.item.a:entry.item.b).dim===dim)picks++;
    });
    return {dim,score:count?sum/count:null,picks};
  });
  const conflicts=DIMS.flatMap(dim=>{
    const pos=items?.findIndex(e=>e.type==='statement'&&e.item.dim===dim&&!e.item.reverse)??-1;
    const neg=items?.findIndex(e=>e.type==='statement'&&e.item.dim===dim&&e.item.reverse)??-1;
    if(pos<0||neg<0||answers[pos]===undefined||answers[neg]===undefined)return [];
    const bothAgree=answers[pos]>=3&&answers[neg]>=3, bothDisagree=answers[pos]<=1&&answers[neg]<=1;
    return bothAgree||bothDisagree?[{dim,pos,neg}]:[];
  });

  let statementNo=0,pairNo=0,scenarioNo=0;
  return <div className="space-y-6"><span className="text-xs font-semibold tracking-wider text-indigo-600">PEAK · {zh?'工作风格专项训练':'WORK STYLE TRAINING'}</span><h1 className="text-3xl font-bold">{zh?'工作风格与情境练习':'Work style & situational practice'}</h1>
    <p className="text-sm leading-7 text-slate-600">{zh?'PEAK 了解你的经历、工作方式和价值取向，常见形式包括：对陈述打分、在两种做法中选更像自己的一项、以及职场情境选择。本页每轮随机抽取 10 道陈述、5 组二选一和 3 个情境，题库共 ':'PEAK explores your experience, working style and values. Common formats include rating statements, choosing which of two approaches is more like you, and workplace scenarios. Each round draws 10 statements, 5 pairs and 3 scenarios at random from a bank of '}{STATEMENTS.length+PAIRS.length+SCENARIOS.length}{zh?' 道原创题，不是官方题库，也没有“标准人格答案”。':' original items. These are not official questions and there is no “correct personality”.'} <a href="https://www.pgcareers.com/global/en/assesment-overviews" className="text-indigo-600 underline" target="_blank" rel="noreferrer">{zh?'官方说明':'Official overview'}</a></p>
    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{zh?'按真实经历回答，而不是猜测雇主想听什么。前后矛盾的回答比“不够完美”的回答更容易引起注意。本页不保存个人回答，不计算录用概率。':'Answer from real experience instead of guessing what an employer wants. Inconsistent answers stand out more than imperfect ones. This page does not save personal responses or calculate hiring probabilities.'}</p>
    {!items?<p role="status" className="text-sm text-slate-500">{zh?'正在抽题…':'Drawing questions…'}</p>:items.map((entry,i)=>{
      if(entry.type==='statement'){statementNo++;const s=entry.item;return <fieldset key={i} disabled={done} className="rounded-xl border border-slate-200 p-5"><legend className="px-2 text-sm font-medium"><span className="mr-2 text-xs text-slate-400">{zh?`陈述 ${statementNo}`:`Statement ${statementNo}`}</span>{s[lang]}</legend><div className="flex flex-wrap gap-2">{labels.map((label,j)=><label key={j} className={`cursor-pointer rounded-lg border px-3 py-3 text-sm ${answers[i]===j?'border-indigo-500 bg-indigo-50 text-indigo-800':'border-slate-200'}`}><input type="radio" name={`peak-${i}`} checked={answers[i]===j} onChange={()=>pick(i,j)} className="mr-2"/>{label}</label>)}</div>{done&&conflicts.some(c=>c.pos===i||c.neg===i)&&<p className="mt-3 text-sm text-amber-700">{zh?'这一题与同一维度的另一题回答方向相反，请检查是否前后一致。':'This answer points the opposite way to another statement on the same theme. Check your consistency.'}</p>}</fieldset>;}
      if(entry.type==='pair'){pairNo++;const p=entry.item;return <fieldset key={i} disabled={done} className="rounded-xl border border-slate-200 p-5"><legend className="px-2 text-sm font-medium"><span className="mr-2 text-xs text-slate-400">{zh?`二选一 ${pairNo}`:`Pair ${pairNo}`}</span>{zh?'哪一项更像你在工作中的做法？':'Which is more like you at work?'}</legend><div className="grid gap-2 sm:grid-cols-2">{[p.a,p.b].map((side,j)=><label key={j} className={`cursor-pointer rounded-lg border px-4 py-3 text-sm ${answers[i]===j?'border-indigo-500 bg-indigo-50 text-indigo-800':'border-slate-200'}`}><input type="radio" name={`peak-${i}`} checked={answers[i]===j} onChange={()=>pick(i,j)} className="mr-2"/>{side[lang]}</label>)}</div></fieldset>;}
      scenarioNo++;const sc=entry.item;return <fieldset key={i} disabled={done} className="rounded-xl border border-slate-200 p-5"><legend className="px-2 text-sm font-medium"><span className="mr-2 text-xs text-slate-400">{zh?`情境 ${scenarioNo}`:`Scenario ${scenarioNo}`}</span>{sc[lang]}</legend><div className="grid gap-2">{sc.options.map((option,j)=><label key={j} className={`cursor-pointer rounded-lg border px-4 py-3 text-sm ${answers[i]===j?'border-indigo-500 bg-indigo-50 text-indigo-800':'border-slate-200'}`}><input type="radio" name={`peak-${i}`} checked={answers[i]===j} onChange={()=>pick(i,j)} className="mr-2"/>{String.fromCharCode(65+j)}. {option[lang]}{done&&<span className={`mt-2 block text-xs leading-6 ${answers[i]===j?'text-indigo-700':'text-slate-500'}`}>{option.note[lang]}</span>}</label>)}</div></fieldset>;
    })}
    {done?<div role="status" className="space-y-4 rounded-xl bg-indigo-50 p-5"><h2 className="font-semibold">{zh?`本轮完成 · ${answered} / ${total}`:`Round complete · ${answered} / ${total}`}</h2>
      <p className="text-sm">{zh?'这不是人格评分，也不代表录用结果。下面是你本轮自我描述的倾向，用来检查回答是否与真实经历一致。':'This is not a personality score or a hiring prediction. Below is how you described yourself this round, to check consistency with your real experience.'}</p>
      <ul className="grid gap-2 sm:grid-cols-2">{profile.filter(p=>p.score!==null||p.picks).map(p=><li key={p.dim} className="rounded-lg bg-white p-3 text-sm"><div className="flex justify-between"><span className="font-medium">{PEAK_DIMENSIONS[p.dim][lang]}</span><span className="text-xs text-slate-500">{p.picks?(zh?`二选一选中 ${p.picks} 次`:`chosen ${p.picks}× in pairs`):''}</span></div>{p.score!==null&&<div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500" style={{width:`${p.score/4*100}%`}}/></div>}</li>)}</ul>
      <p className={`text-sm ${conflicts.length?'text-amber-800':'text-emerald-800'}`}>{conflicts.length?(zh?`发现 ${conflicts.length} 处前后不一致（${conflicts.map(c=>PEAK_DIMENSIONS[c.dim].zh).join('、')}），已在对应题目下标出。`:`${conflicts.length} inconsistent answer pair(s) found (${conflicts.map(c=>PEAK_DIMENSIONS[c.dim].en).join(', ')}), marked under the statements.`):(zh?'本轮正反陈述的回答方向一致。':'Your answers to positive and reverse-worded statements were consistent.')}</p>
      <p className="text-sm">{zh?'情境题每个选项下都附有分析，可以对照自己的选择，准备一个真实的工作或学习实例来支撑它。':'Each scenario option now shows a note. Compare it with your choice and prepare a real example that supports it.'}</p>
      <button onClick={next} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{zh?'换一组新题':'Next set'}</button></div>
    :<button disabled={!items||answered!==total} onClick={()=>{setDone(true);activity.complete();}} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-40">{zh?`完成并查看反思提示（${answered}/${total}）`:`Complete & reflect (${answered}/${total})`}</button>}
    <div><Link href={`/${lang}/exams`} className="text-sm font-semibold text-indigo-600">{zh?'前往互动认知模拟考 →':'Explore the interactive mock exam →'}</Link></div>
  </div>;
}
