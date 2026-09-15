'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useAuth} from '@clerk/nextjs';
import {useI18n} from '@/lib/i18n';
import {useSolveRequest} from '@/lib/solve-request';
import {ruleNames, type FigureRule} from '@/lib/figure';
import Figure from '@/components/practice/Figure';

export default function Page(){const {userId}=useAuth();return <FigureSolver key={userId??'visitor'}/>;}
function FigureSolver(){
 const {lang}=useI18n();const zh=lang==='zh';
 const [frames,setFrames]=useState([11,38,416,200,11]);
 const [result,setResult]=useState<{next:number;rules:FigureRule[]}[]|null>(null);
 const {run,busy,error}=useSolveRequest<{next:number;rules:FigureRule[]}[]>('/api/solve/figure');
 return <div className="space-y-6">
 <p className="rounded-xl bg-indigo-50 p-4 text-sm leading-6">{zh?'支持：固定旋转、左右镜像、循环平移、外围移动、黑白翻转及旋转后翻转。此工具只检查这些规则，不能识别任意图片或所有笔试题。':'Supported: fixed rotations, reflection, cyclic shifts, perimeter movement, inversion, and rotation with inversion. This tool checks these rules only; it does not interpret arbitrary images or every assessment question.'}</p>
 <div className="flex flex-wrap gap-4">{frames.map((mask,i)=><Figure key={i} mask={mask} label={`${zh?'图':'Figure'} ${i+1}`} onChange={busy?undefined:value=>{setFrames(frames.map((v,j)=>i===j?value:v));setResult(null);}}/>)}</div>
 <div className="flex flex-wrap gap-3"><button disabled={frames.length>=8||busy} onClick={()=>{setFrames([...frames,0]);setResult(null);}} className="rounded-lg border px-4 py-2 disabled:opacity-40">{zh?'添加图形':'Add figure'}</button><button disabled={frames.length<=3||busy} onClick={()=>{setFrames(frames.slice(0,-1));setResult(null);}} className="rounded-lg border px-4 py-2 disabled:opacity-40">{zh?'删除最后一幅':'Remove last'}</button><button disabled={busy} onClick={async()=>{const r=await run({frames});if(r)setResult(r);}} className="rounded-lg bg-indigo-600 px-5 py-2 text-white disabled:opacity-40">{busy?'…':zh?'求解':'Solve'}</button></div>
 {error&&<p role="alert" className="text-red-600">{error}</p>}
 {result&&<section className="space-y-4 rounded-xl border p-5" aria-live="polite"><h2 className="font-semibold">{zh?'求解结果':'Results'}</h2><p>{!result.length?(zh?'没有找到符合已支持规则的解。请检查输入，或考虑其他规律。':'No supported rule matches. Check the figures or consider a different rule.'):result.length===1?(zh?'已支持规则得到同一个预测（不代表所有可能规律的唯一答案）。':'The matching supported rules agree on this prediction; other rule families may differ.'):(zh?'存在不同预测，暂时不能确定唯一答案。':'Multiple predictions match; a unique answer cannot be determined.')}</p>{result.map(r=><div key={r.next} className="flex flex-wrap items-center gap-5"><Figure mask={r.next} label={zh?'下一幅':'Next figure'}/><ul>{r.rules.map(rule=><li key={rule}>{ruleNames[rule][lang]}</li>)}</ul></div>)}</section>}
 <Link href="/practice" className="inline-block text-indigo-600 underline">{zh?'前往练习题库，选择「图形推理」开始练习':'Open Practice and choose Figure reasoning'}</Link>
 </div>;
}
