'use client';
import { useEffect, useState } from 'react';
import type { Explanation, PublicQuestion } from '@/lib/practice';
import { Shape } from '@/lib/shapes';
import Figure from './Figure';
import {ruleNames} from '@/lib/figure';
import ShapeRow from '@/components/pipeline/ShapeRow';
import { useI18n, shapeNameKey } from '@/lib/i18n';

export default function Lesson({explanation:ex,question:q}:{explanation:Explanation;question:PublicQuestion}) {
  const {lang,t}=useI18n();
  const zh=lang==='zh';
  const [frame,setFrame]=useState(0);
  const [playing,setPlaying]=useState(false);
  const max=ex.kind==='pipeline'?ex.steps.length:0;
  useEffect(()=>{
    if(!playing)return;
    const timer=setInterval(()=>setFrame(old=>old>=max?0:old+1),1800);
    return ()=>clearInterval(timer);
  },[playing,max]);
  if(ex.kind==='figure')return <div className="mt-5 space-y-4 rounded-xl border bg-white p-5 text-slate-700"><h3 className="font-bold">{zh?'图形规律解析':'Figure explanation'}</h3><p>{zh?'正确选项：':'Correct option: '}{String.fromCharCode(64+ex.choice)}</p><p>{ruleNames[ex.rule][lang]}</p><p className="text-sm">{zh?'逐幅检验同一变换，再把它应用到第五幅。下面最后一幅就是预测结果。':'Check the same transformation between every pair, then apply it to figure 5. The final figure below is the predicted answer.'}</p><div className="flex flex-wrap gap-3">{ex.frames.map((mask,i)=><Figure key={i} mask={mask} label={`${i+1}${i===5?' ✓':''}`}/>)}</div></div>;
  if(ex.kind==='numerical')return <div className="mt-5 space-y-2 rounded-xl border bg-white p-5 text-slate-700">
    <h3 className="font-bold">{zh?'解题步骤':'Worked solution'}</h3>
    <p>{zh?'先乘后加。先选两个不同数字，使乘积与目标的差是 1–9，且不与前两个数字重复。':'Multiply before adding. Choose two distinct digits whose product leaves a remainder from 1–9, different from both digits.'}</p>
    <p>① {ex.digits[0]} × {ex.digits[1]} = {ex.product}</p>
    <p>② c = {ex.target} − {ex.product} = {ex.digits[2]}</p>
    <p>③ {ex.product} + {ex.digits[2]} = {ex.target} ✓</p>
    <p className="text-sm">{zh?'最后检查：三个数字均在 1–9 内，且互不重复。符合条件的其他答案也算正确。':'Finally, check that all three digits are distinct and between 1 and 9. Other valid solutions are accepted.'}</p>
  </div>;
  if(ex.kind==='data'&&q.kind==='data')return <div className="mt-5 space-y-3 rounded-xl border bg-white p-5 text-slate-700">
    <h3 className="font-bold">{zh?'解题步骤':'Worked solution'}</h3>
    <p>{q.metric==='growth'?(zh?'① 找到该部门第一年和第二年的销售额。② 用第二年减第一年，得到变化额。③ 除以第一年（基期），再乘 100%。':'① Read this department’s Year 1 and Year 2 sales. ② Subtract Year 1 from Year 2. ③ Divide the change by Year 1, then multiply by 100%.'):q.metric==='share'?(zh?'① 将所有部门第二年销售额相加，得到总额。② 用目标部门第二年销售额除以这个总额，再乘 100%。':'① Sum Year 2 sales across all departments. ② Divide the target department’s Year 2 sales by that total, then multiply by 100%.'):(zh?'① 找到两个指定部门第二年的销售额。② 按题目顺序，用前者除以后者。':'① Read Year 2 sales for both specified departments. ② Divide the first department’s sales by the second’s.')}</p>
    <p className="font-mono text-lg">{ex.numerator} ÷ {ex.denominator}{q.metric!=='ratio'?' × 100%':''} ≈ {ex.value.toFixed(1)}{q.metric!=='ratio'?'%':''}</p>
    <p className="text-sm">{zh?'结果保留一位小数。注意分母：增长率用基期，占比用总额，比值按题目指定的顺序。':'Round to one decimal place. The denominator is the base year for growth, the total for share, or the second quantity for a ratio.'}</p>
  </div>;
  if(ex.kind!=='pipeline')return null;
  const seq=frame===0?ex.steps[0].input:ex.steps[frame-1].output;
  return <div className="mt-5 space-y-4 rounded-xl border bg-white p-5 text-slate-700">
    <h3 className="font-bold">{zh?'推导过程与动画':'Reasoning & walkthrough'}</h3>
    <p>{zh?'先从输入向前执行未知方框之前的变换；再从最终输出逆向撤销未知方框之后的变换。这样就能确定未知方框两端的图形。':'Apply the known boxes before the unknown box to the input. Work backwards from the final output, undoing the boxes after it. This isolates the shapes on both sides of the unknown box.'}</p>
    <div className="flex flex-wrap items-center gap-3"><ShapeRow seq={ex.before}/><span>→ ? →</span><ShapeRow seq={ex.after}/></div>
    <p className="text-sm">{zh?'逐个查找右边图形在左边的位置：':'Find each right-hand shape’s position on the left:'} {ex.after.map((v,i)=>`${i+1} ← ${ex.before.indexOf(v)+1}`).join(' · ')}。</p>
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="mb-3 text-sm" aria-live="polite">{frame===0?(zh?'初始输入':'Initial input'):`${zh?'第':'Step'} ${frame}${zh?' 级输出':''} · ${ex.steps[frame-1].permutation.join('')}`}</p>
      <div className="relative mx-auto h-16 w-64" aria-label={zh?'图形移动演示':'Shape movement demonstration'}>
        {[1,2,3,4].map(id=><div key={id} className="absolute top-1 flex h-12 w-12 items-center justify-center rounded-lg border bg-white transition-transform duration-700 motion-reduce:transition-none" style={{transform:`translateX(${seq.indexOf(id)*64}px)`}}><Shape id={id} size={28} title={t(shapeNameKey(id))}/></div>)}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <button type="button" onClick={()=>{setPlaying(false);setFrame(0);}} className="rounded border px-3 py-2">{zh?'重置':'Reset'}</button>
        <button type="button" onClick={()=>setPlaying(!playing)} className="rounded bg-indigo-600 px-3 py-2 text-white">{playing?(zh?'暂停':'Pause'):(zh?'播放动画':'Play animation')}</button>
        <button type="button" onClick={()=>{setPlaying(false);setFrame((frame+1)%(max+1));}} className="rounded border px-3 py-2">{zh?'下一步':'Next step'}</button>
      </div>
    </div>
    <ol className="space-y-3">{ex.steps.map((step,i)=><li key={i} className={`rounded-lg border p-3 ${frame===i+1?'border-indigo-400 bg-indigo-50':'border-gray-200'}`}>
      <p className="mb-2 font-semibold">{zh?'第':'Step'} {i+1} · {step.permutation.join('')} {step.unknown?(zh?'（未知方框的答案）':'(inferred box)'):''}</p>
      <div className="flex flex-wrap items-center gap-2"><ShapeRow seq={step.input} size={22}/><span>→</span><ShapeRow seq={step.output} size={22}/></div>
      <p className="mt-2 text-xs">{zh?'输出从本级输入依次取第':'Read positions from this step’s input:'} {step.permutation.join(', ')} {zh?'位。注意：每一级都使用上一级的输出。':''}</p>
    </li>)}</ol>
  </div>;
}
