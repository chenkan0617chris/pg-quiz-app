'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
const items=[
  {zh:'当任务目标不清晰时，我会主动向相关同事确认预期。',en:'When a task is unclear, I proactively clarify expectations with colleagues.',reflection:{zh:'回想一次目标不明确的真实经历：你如何确认优先级、行动并检查结果？',en:'Recall a time when goals were unclear. How did you clarify priorities, act and check the result?'}},
  {zh:'面对紧迫期限，我会尽早说明风险，并与团队讨论取舍。',en:'When a deadline is tight, I communicate risks early and discuss trade-offs with the team.',reflection:{zh:'回想你如何处理进度与质量的冲突。回答应反映真实、稳定的行为，而非想象中的完美表现。',en:'Think about how you balance speed and quality. Reflect your actual, consistent behaviour rather than an ideal persona.'}},
  {zh:'即使与我的观点不同，我也愿意认真听取同事的意见。',en:'I listen carefully to colleagues even when their views differ from mine.',reflection:{zh:'想到一次分歧：你听到了什么、改变了什么，又保留了哪些判断？',en:'Recall a disagreement: what did you hear, change or continue to believe?'}},
  {zh:'当我发现自己犯了错误，我会承认并推动修正。',en:'When I discover a mistake I made, I acknowledge it and work to correct it.',reflection:{zh:'回顾一次你承担责任的经历，用具体行动检验自己的选择是否符合日常行为。',en:'Recall taking responsibility. Compare your choice with concrete actions in your everyday work.'}},
  {zh:'我愿意学习不熟悉的方法，并通过反馈改进。',en:'I am willing to learn unfamiliar approaches and improve through feedback.',reflection:{zh:'回想最近学到的一项新技能，以及你如何使用反馈。保持诚实与一致。',en:'Think of a recently learned skill and how you used feedback. Be honest and consistent.'}},
];
export default function PeakTraining(){
  const {lang}=useI18n(),zh=lang==='zh';
  const [answers,setAnswers]=useState<Record<number,number>>({});
  const [done,setDone]=useState(false);
  const labels=zh?['非常不符合','较不符合','一般','较符合','非常符合']:['Strongly disagree','Disagree','Neutral','Agree','Strongly agree'];
  return <div className="space-y-6"><span className="text-xs font-semibold tracking-wider text-indigo-600">PEAK · {zh?'流程熟悉':'FAMILIARIZATION'}</span><h1 className="text-3xl font-bold">{zh?'工作风格与情境练习':'Work style familiarization'}</h1><p className="text-sm leading-7 text-slate-600">{zh?'官方 PEAK 关注经历、兴趣和工作态度，通常约 20 分钟，不设置统一限时。下面 5 道原创陈述帮助你熟悉阅读与自我判断，不是官方题库，也没有“标准人格答案”。':'The official PEAK explores experience, interests and work attitudes. Most applicants take about 20 minutes, without a fixed time limit. These five original statements help you practise reflection; they are not official questions or a personality answer key.'} <a href="https://www.pgcareers.com/global/en/assesment-overviews" className="text-indigo-600 underline" target="_blank" rel="noreferrer">{zh?'官方说明':'Official overview'}</a></p>
    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{zh?'按真实经历回答，而不是猜测雇主想听什么。本页不保存个人回答，不计算录用概率。':'Answer from real experience instead of guessing what an employer wants. This page does not save personal responses or calculate hiring probabilities.'}</p>
    {items.map((item,i)=><fieldset key={i} disabled={done} className="rounded-xl border border-slate-200 p-5"><legend className="px-2 text-sm font-medium">{i+1}. {item[lang]}</legend><div className="flex flex-wrap gap-2">{labels.map((label,j)=><label key={j} className={`cursor-pointer rounded-lg border px-3 py-3 text-sm ${answers[i]===j?'border-indigo-500 bg-indigo-50 text-indigo-800':'border-slate-200'}`}><input type="radio" name={`peak-${i}`} checked={answers[i]===j} onChange={()=>setAnswers({...answers,[i]:j})} className="mr-2"/>{label}</label>)}</div>{done&&<p className="mt-4 text-sm leading-7 text-slate-600">{item.reflection[lang]}</p>}</fieldset>)}
    {done?<div role="status" className="rounded-xl bg-indigo-50 p-5"><h2 className="font-semibold">{zh?'熟悉练习已完成 · 5 / 5':'Familiarization complete · 5 / 5'}</h2><p className="my-3 text-sm">{zh?'这不是人格评分。回看每题下方的反思提示，准备与你的回答一致的真实工作实例。':'This is not a personality score. Review the reflection prompts and consider real examples consistent with your responses.'}</p><button onClick={()=>{setAnswers({});setDone(false);}} className="text-sm text-indigo-700 underline">{zh?'重新练习':'Start again'}</button></div>:<button disabled={Object.keys(answers).length!==items.length} onClick={()=>setDone(true)} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-40">{zh?`完成并查看反思提示（${Object.keys(answers).length}/5）`:`Complete & reflect (${Object.keys(answers).length}/5)`}</button>}
    <div><Link href={`/${lang}/exams`} className="text-sm font-semibold text-indigo-600">{zh?'前往互动认知模拟考 →':'Explore the interactive mock exam →'}</Link></div>
  </div>;
}
